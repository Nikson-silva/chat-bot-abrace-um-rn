const path = require("path");

const SESSION_NAME = "abraceumrn3";
const INATIVIDADE_MS = 1000 * 60 * 720; // 12 horas

const MENU_PRINCIPAL =
    "Digite o número da opção desejada:\n\n" +
    "_1 - Quero fazer uma doação_\n" +
    "_2 - Sou gestante e preciso de ajuda_\n" +
    "_3 - Quero ser voluntário(a)_\n" +
    "_4 - Tenho uma empresa e quero ser parceiro_\n" +
    "_5 - Outros assuntos_";

const SUBMENU_DOACAO =
    "🤝 Que bom que você quer fazer uma doação!\n\n" +
    "Escolha uma das opções abaixo:\n\n" +
    "_1 - Doar via PIX_\n" +
    "_2 - Doar itens para o bebê_\n" +
    "_3 - Voltar ao menu principal";

const SAUDACOES_HUMANAS = ["oi", "bom dia", "boa tarde", "boa noite"];

const ETAPAS = {
    AGUARDANDO_OPCAO: "aguardando_opcao",
    AGUARDANDO_SUBOPCAO_DOACAO: "aguardando_subopcao_doacao",
    AGUARDANDO_OUTROS_ASSUNTOS: "aguardando_outros_assuntos",
};

const CHAT_STATES = {
    TYPING: 0,
    RECORDING: 1,
    STOPPED: 2,
};

const AUDIO_PATHS = {
    SAUDACAO: path.join(__dirname, "../../arquivos/audio_saudacao.opus"),
    DOACAO_PIX: path.join(__dirname, "../../arquivos/1_1_audio_doacao_pix.opus"),
    DOACAO_ITENS: path.join(__dirname, "../../arquivos/1_2_audio_doacao_itens.opus"),
    GESTANTE: path.join(__dirname, "../../arquivos/2_gestante.opus"),
    VOLUNTARIO: path.join(__dirname, "../../arquivos/3_voluntariar.opus"),
    EMPRESA: path.join(__dirname, "../../arquivos/4_empresa_parceiro.opus"),
    OUTROS: path.join(__dirname, "../../arquivos/5_outros_assuntos.opus"),
};

const IMAGE_PATHS = {
    DOACAO: path.join(__dirname, "../../arquivos/imagem_doacao.png"),
};

module.exports = {
    SESSION_NAME,
    INATIVIDADE_MS,
    MENU_PRINCIPAL,
    SUBMENU_DOACAO,
    SAUDACOES_HUMANAS,
    ETAPAS,
    CHAT_STATES,
    AUDIO_PATHS,
    IMAGE_PATHS,
};
