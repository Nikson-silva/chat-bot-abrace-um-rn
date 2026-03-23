const fs = require("fs");
const path = require("path");
const { CONTATOS_BLOQUEADOS_PATH } = require("../config/paths");

function createBloqueioService() {
    garantirArquivo();

    let contatosBloqueados = carregarBloqueados();

    function garantirArquivo() {
        const pasta = path.dirname(CONTATOS_BLOQUEADOS_PATH);

        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true });
        }

        if (!fs.existsSync(CONTATOS_BLOQUEADOS_PATH)) {
            fs.writeFileSync(CONTATOS_BLOQUEADOS_PATH, JSON.stringify([], null, 2), "utf8");
        }
    }

    function carregarBloqueados() {
        try {
            const conteudo = fs.readFileSync(CONTATOS_BLOQUEADOS_PATH, "utf8");
            return JSON.parse(conteudo || "[]");
        } catch (error) {
            console.error("Erro ao carregar contatos bloqueados:", error.message);
            return [];
        }
    }

    function salvarBloqueados() {
        fs.writeFileSync(
            CONTATOS_BLOQUEADOS_PATH,
            JSON.stringify(contatosBloqueados, null, 2),
            "utf8",
        );
    }

    function isBloqueadoPermanentemente(numero) {
        return contatosBloqueados.includes(numero);
    }

    function bloquearPermanentemente(numero) {
        if (isBloqueadoPermanentemente(numero)) {
            return;
        }

        contatosBloqueados.push(numero);
        salvarBloqueados();
        console.log(`[INFO] Contato ${numero.split("@")[0]} bloqueado permanentemente.`);
    }

    return {
        isBloqueadoPermanentemente,
        bloquearPermanentemente,
    };
}

module.exports = {
    createBloqueioService,
};
