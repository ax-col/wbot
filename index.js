// index.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const commands = require('./commands');

const OWNER_NUMBER = '573219724961';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot conectado');
  client.sendMessage(`${OWNER_NUMBER}@c.us`, '🤖 Bot iniciado correctamente.');
});

client.on('message', async msg => {
  if (msg.from !== `${OWNER_NUMBER}@c.us`) return; // solo el owner puede usarlo
  if (!msg.body.startsWith('/')) return;

  const [command, ...args] = msg.body.trim().slice(1).split(/\s+/);
  if (commands[command]) {
    try {
      const response = await commands[command](args.join(' '), msg, client);
      msg.reply(response);
    } catch (err) {
      console.error(err);
      msg.reply('⚠️ Error al ejecutar el comando.');
    }
  }
});

client.on('disconnected', (reason) => {
  console.log('❌ Bot desconectado:', reason);
});

client.initialize();
