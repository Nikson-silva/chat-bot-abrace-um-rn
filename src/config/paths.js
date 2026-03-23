const path = require("path");

const BASE_DIR = path.join(__dirname, "../..");
const DADOS_DIR = path.join(BASE_DIR, "dados");

const CONTATOS_BLOQUEADOS_PATH = path.join(DADOS_DIR, "contatos-bloqueados.json");
const PIX_CSV_PATH = path.join(DADOS_DIR, "pix.csv");
const CONVERSAS_CSV_PATH = path.join(DADOS_DIR, "conversas-iniciadas.csv");
const OUT_QR_PATH = path.join(BASE_DIR, "out.png");

module.exports = {
    BASE_DIR,
    DADOS_DIR,
    CONTATOS_BLOQUEADOS_PATH,
    PIX_CSV_PATH,
    CONVERSAS_CSV_PATH,
    OUT_QR_PATH,
};
