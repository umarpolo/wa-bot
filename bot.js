const { default: makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const { state, saveState } = useSingleFileAuthState('./auth_info.json')

async function startBot() {
    const { version } = await fetchLatestBaileysVersion()
    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
    })

    sock.ev.on('creds.update', saveState)

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if (!m.message) return

        const sender = m.key.remoteJid
        const text = m.message.conversation || m.message.extendedTextMessage?.text

        if (text === 'ping') {
            await sock.sendMessage(sender, { text: 'pong!' })
        }
    })
}

startBot()

