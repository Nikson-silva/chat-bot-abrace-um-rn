const { delay } = require("../utils/delay");
const { CHAT_STATES } = require("../config/constants");

function createWhatsAppGateway(client) {
    async function enviarTexto(remetente, mensagem, tempoParaIniciarDigitacao, tempoDeDigitacao) {
        try {
            await delay(tempoParaIniciarDigitacao);
            console.log("[-] Simulando digitação...");
            await client.setChatState(remetente, CHAT_STATES.TYPING);

            await delay(tempoDeDigitacao);
            console.log("[-] Interrompendo digitação e enviando mensagem...");
            await client.setChatState(remetente, CHAT_STATES.STOPPED);

            console.log(`[-] Mensagem enviada: ${mensagem}`);
            await client.sendText(remetente, mensagem);
        } catch (err) {
            console.error(`Erro ao executar enviarTexto para ${remetente}:`, err.message);
        }
    }

    async function enviarAudio(remetente, caminhoDoAudio, tempoDeGravacaoDeAudio) {
        try {
            console.log("[-] Simulando gravação de áudio...");
            await client.setChatState(remetente, CHAT_STATES.RECORDING);

            await delay(tempoDeGravacaoDeAudio);

            console.log("[-] Enviando áudio...");
            await client.setChatState(remetente, CHAT_STATES.STOPPED);
            await client.sendPtt(remetente, caminhoDoAudio);

            console.log("[-] Áudio enviado com sucesso.");
        } catch (err) {
            console.error(`Erro ao executar envio de áudio para ${remetente}:`, err.message);
        }
    }

    async function enviarImagem(remetente, caminhoImagem, nomeArquivo, legenda) {
        try {
            await client.sendImage(remetente, caminhoImagem, nomeArquivo, legenda);
        } catch (err) {
            console.error(`Erro ao enviar imagem para ${remetente}:`, err.message);
        }
    }

    async function enviarLocalizacao(remetente, latitude, longitude, descricao) {
        try {
            await client.sendLocation(remetente, latitude, longitude, descricao);
        } catch (err) {
            console.error(`Erro ao enviar localização para ${remetente}:`, err.message);
        }
    }

    async function esperar(ms) {
        await delay(ms);
    }

    function onAnyMessage(handler) {
        client.onAnyMessage(handler);
    }

    return {
        enviarTexto,
        enviarAudio,
        enviarImagem,
        enviarLocalizacao,
        esperar,
        onAnyMessage,
    };
}

module.exports = {
    createWhatsAppGateway,
};
