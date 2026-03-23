const fs = require("fs");
const { PIX_CSV_PATH } = require("../config/paths");

function createPixService() {
    function carregarConfigPix() {
        if (!fs.existsSync(PIX_CSV_PATH)) {
            throw new Error("Arquivo pix.csv não encontrado.");
        }

        const conteudo = fs.readFileSync(PIX_CSV_PATH, "utf8").trim();
        const linhas = conteudo.split("\n");

        if (linhas.length < 2) {
            throw new Error("Arquivo pix.csv não contém dados.");
        }

        const dados = linhas[1].split(",");

        if (dados.length < 3) {
            throw new Error("Dados incompletos no pix.csv.");
        }

        const banco = dados[0].replace(/"/g, "").trim();
        const titular = dados[1].replace(/"/g, "").trim();
        const chave = dados[2].replace(/"/g, "").trim();

        return { banco, titular, chave };
    }

    return {
        carregarConfigPix,
    };
}

module.exports = {
    createPixService,
};
