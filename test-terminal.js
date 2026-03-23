const readline = require("readline");

const { createChatbot } = require("./src/core/chatbot");
const { createChatState } = require("./src/state/chatState");
const { createBloqueioService } = require("./src/services/bloqueioService");
const { createPixService } = require("./src/services/pixService");
const { createConversaLogService } = require("./src/services/conversaLogService");
const { createAtendimentoService } = require("./src/services/atendimentoService");

function createConsoleGateway() {
    let messageHandler = null;

    return {
        enviarTexto: async (remetente, mensagem) => {
            console.log(`\n[BOT -> ${remetente}]`);
            console.log(mensagem);
        },

        enviarAudio: async (remetente, caminhoDoAudio) => {
            console.log(`\n[BOT -> ${remetente}] [ÁUDIO] ${caminhoDoAudio}`);
        },

        enviarImagem: async (remetente, caminhoImagem, nomeArquivo, legenda) => {
            console.log(`\n[BOT -> ${remetente}] [IMAGEM] ${caminhoImagem}`);
            if (legenda) {
                console.log(`Legenda: ${legenda}`);
            }
        },

        enviarLocalizacao: async (remetente, latitude, longitude, descricao) => {
            console.log(`\n[BOT -> ${remetente}] [LOCALIZAÇÃO]`);
            console.log(`Lat: ${latitude} | Long: ${longitude} | Desc: ${descricao}`);
        },

        esperar: async () => {},

        onAnyMessage: (handler) => {
            messageHandler = handler;
        },

        simularMensagemRecebida: async (texto, remetente = "558399999999@c.us") => {
            if (!messageHandler) {
                throw new Error("Nenhum handler de mensagem foi registrado.");
            }

            await messageHandler({
                body: texto,
                from: remetente,
                isGroupMsg: false,
                chatId: remetente,
                fromMe: false,
                t: Math.floor(Date.now() / 1000),
            });
        },
    };
}

async function main() {
    const gateway = createConsoleGateway();
    const state = createChatState();
    const bloqueioService = createBloqueioService();
    const pixService = createPixService();
    const conversaLogService = createConversaLogService();
    const atendimentoService = createAtendimentoService({
        pixService,
        conversaLogService,
    });

    const chatbot = createChatbot({
        gateway,
        state,
        bloqueioService,
        atendimentoService,
    });

    chatbot.start();

    console.log("Teste do chatbot via terminal iniciado.");
    console.log("Digite uma mensagem e pressione Enter.");
    console.log('Digite "sair" para encerrar.\n');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "[VOCÊ] ",
    });

    rl.prompt();

    rl.on("line", async (line) => {
        const texto = line.trim();

        if (texto.toLowerCase() === "sair") {
            rl.close();
            return;
        }

        try {
            await gateway.simularMensagemRecebida(texto);
        } catch (error) {
            console.error("Erro no teste:", error.message);
        }

        rl.prompt();
    });

    rl.on("close", () => {
        console.log("\nTeste encerrado.");
        process.exit(0);
    });
}

main();
