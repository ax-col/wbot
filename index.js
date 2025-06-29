// index.js 
const OWNER_NUMBER = '573219724961'; const { state, saveState } = useSingleFileAuthState('./auth.json');

async function startBot() { const sock = makeWASocket({ logger: P({ level: 'silent' }), printQRInTerminal: true, auth: state, });

sock.ev.on('creds.update', saveState);

sock.ev.on('connection.update', ({ connection, lastDisconnect }) => { if (connection === 'close') { const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut; console.log('⛔ Conexión cerrada. Reconectando...', shouldReconnect); if (shouldReconnect) startBot(); } else if (connection === 'open') { console.log('✅ Bot conectado'); sock.sendMessage(${OWNER_NUMBER}@s.whatsapp.net, { text: '🤖 Bot iniciado correctamente.' }); } });

sock.ev.on('messages.upsert', async ({ messages, type }) => { if (type !== 'notify') return; const msg = messages[0]; if (!msg.message || !msg.key.remoteJid) return;

const sender = msg.key.remoteJid;
if (!sender.includes(OWNER_NUMBER)) return; // solo el owner puede usarlo

const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
if (!body.startsWith('/')) return;

const [command, ...args] = body.trim().slice(1).split(/\s+/);
if (commands[command]) {
  try {
    const response = await commands[command](args.join(' '), msg, sock);
    await sock.sendMessage(sender, { text: response }, { quoted: msg });
  } catch (err) {
    console.error(err);
    await sock.sendMessage(sender, { text: '⚠️ Error al ejecutar el comando.' }, { quoted: msg });
  }
}

}); }

startBot();

