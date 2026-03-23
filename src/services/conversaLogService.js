const fs = require("fs");
const path = require("path");
const { CONVERSAS_CSV_PATH } = require("../config/paths");

function createConversaLogService() {
    function salvarConversasIniciadas(numero, motivo) {
        const numeroLimpo = numero.split("@")[0];
        const dataHora = new Date().toLocaleString("pt-BR");
        const linha = `"${dataHora}","${motivo}","+${numeroLimpo}"\n`;

        const pasta = path.dirname(CONVERSAS_CSV_PATH);

        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true });
        }

        if (!fs.existsSync(CONVERSAS_CSV_PATH)) {
            const cabecalho = `"Data/Hora","Motivo da conversa","Telefone"\n`;
            fs.writeFileSync(CONVERSAS_CSV_PATH, cabecalho, "utf8");
        }

        fs.appendFileSync(CONVERSAS_CSV_PATH, linha, "utf8");
        console.info(`✅ Registro de início de conversa salvo em: ${CONVERSAS_CSV_PATH}`);
    }

    return {
        salvarConversasIniciadas,
    };
}

module.exports = {
    createConversaLogService,
};
