const fs = require("fs");
const wppconnect = require("@wppconnect-team/wppconnect");

const { SESSION_NAME } = require("./src/config/constants");
const { OUT_QR_PATH } = require("./src/config/paths");
const { createWhatsAppGateway } = require("./src/gateways/whatsappGateway");
const { createChatbot } = require("./src/core/chatbot");
const { createChatState } = require("./src/state/chatState");
const { createBloqueioService } = require("./src/services/bloqueioService");
const { createPixService } = require("./src/services/pixService");
const { createConversaLogService } = require("./src/services/conversaLogService");
const { createAtendimentoService } = require("./src/services/atendimentoService");

const state = createChatState();
const bloqueioService = createBloqueioService();
const pixService = createPixService();
const conversaLogService = createConversaLogService();
const atendimentoService = createAtendimentoService({
    pixService,
    conversaLogService,
});

wppconnect
    .create({
        session: SESSION_NAME,
        catchQR: (base64Qr, asciiQR) => {
            console.log(asciiQR);

            const matches = base64Qr.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                console.error("QR code inválido.");
                return;
            }

            const imageBuffer = Buffer.from(matches[2], "base64");
            fs.writeFile(OUT_QR_PATH, imageBuffer, "binary", (err) => {
                if (err) {
                    console.error("Erro ao salvar QR code:", err.message);
                }
            });
        },
        logQR: false,
    })
    .then((client) => {
        const gateway = createWhatsAppGateway(client);

        const chatbot = createChatbot({
            gateway,
            state,
            bloqueioService,
            atendimentoService,
        });

        chatbot.start();
    })
    .catch((error) => {
        console.error("Erro ao iniciar sessão do WhatsApp:", error);
    });
