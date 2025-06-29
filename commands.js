// commands.js const os = require('os');

module.exports = { ping: async () => 'pong!',

hora: async () => new Date().toLocaleString(),

info: async () => { return 🖥️ Sistema operativo: ${os.type()} ${os.release()} 🧠 RAM libre: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB 🕒 Tiempo activo: ${(os.uptime() / 60).toFixed(2)} minutos; },

cmd: async (input) => { const { exec } = require('child_process'); return new Promise((resolve) => { exec(input, (err, stdout, stderr) => { if (err) return resolve(❌ Error: ${stderr}); resolve(🧾 Resultado:\n${stdout || 'Comando sin salida'}); }); }); },

kick: async (input, msg, client) => { const chat = await msg.getChat(); if (!chat.isGroup) return '❌ Este comando solo funciona en grupos.';

const botParticipant = chat.participants.find(p => p.id._serialized === client.info.wid._serialized);
if (!botParticipant?.isAdmin) return '⚠️ El bot no es administrador en este grupo.';

const targetNumber = input.replace(/[^0-9]/g, '') + '@c.us';
try {
  await chat.removeParticipants([targetNumber]);
  return `✅ Usuario ${input} fue expulsado.`;
} catch {
  return '❌ No se pudo expulsar (verifica si el número está en el grupo y si eres admin).';
}

} };

