const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');

const OWNER_NUMBER = '573219724961';
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
    const sock = makeWASocket({
        logger: undefined,
        printQRInTerminal: true,
        auth: state
    });

    sock.ev.on('creds.update', saveState);

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('❌ Conexión cerrada. Reintentando...', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ Bot conectado');
            sock.sendMessage(`${OWNER_NUMBER}@s.whatsapp.net`, { text: '🤖 Bot iniciado correctamente.' });
        }
    });
}

startBot();