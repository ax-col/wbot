const os = require('os');

module.exports = {
  ping: async () => 'pong!',
  hora: async () => new Date().toLocaleString(),
  info: async () => {
    return `🖥️ Sistema: ${os.type()} ${os.release()}
🧠 RAM libre: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB
🕒 Uptime: ${(os.uptime() / 60).toFixed(1)} min`;
  },
  cmd: async (input) => {
    const { exec } = require('child_process');
    return new Promise((resolve) => {
      exec(input, (err, stdout, stderr) => {
        if (err) return resolve(`❌ Error: ${stderr}`);
        resolve(`🧾 Resultado:\n${stdout || 'Comando sin salida'}`);
      });
    });
  },
  kick: async (input, msg, sock) => {
    const jid = msg.key.remoteJid;
    if (!jid.endsWith('@g.us')) return '❌ Este comando solo funciona en grupos.';

    const metadata = await sock.groupMetadata(jid);
    const botIsAdmin = metadata.participants.find(p => p.id === sock.user.id && p.admin !== null);
    if (!botIsAdmin) return '⚠️ El bot no es administrador.';

    const number = input.replace(/[^0-9]/g, '');
    const target = `${number}@s.whatsapp.net`;

    try {
      await sock.groupParticipantsUpdate(jid, [target], 'remove');
      return `✅ Usuario ${number} expulsado.`;
    } catch {
      return '❌ No se pudo expulsar (verifica que esté en el grupo y que seas admin).';
    }
  }
};