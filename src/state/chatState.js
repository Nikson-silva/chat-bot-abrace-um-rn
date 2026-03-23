const { INATIVIDADE_MS } = require("../config/constants");

function createChatState() {
    const contatosIniciados = new Set();
    const etapasUsuario = new Map();
    const timersInatividade = new Map();
    const conversasBloqueadas = new Set();

    function hasContatoIniciado(numero) {
        return contatosIniciados.has(numero);
    }

    function marcarContatoIniciado(numero) {
        contatosIniciados.add(numero);
    }

    function removerContatoIniciado(numero) {
        contatosIniciados.delete(numero);
    }

    function getEtapa(numero) {
        return etapasUsuario.get(numero);
    }

    function setEtapa(numero, etapaData) {
        etapasUsuario.set(numero, etapaData);
    }

    function clearEtapa(numero) {
        etapasUsuario.delete(numero);
    }

    function isBloqueada(numero) {
        return conversasBloqueadas.has(numero);
    }

    function bloquearTemporariamente(numero) {
        conversasBloqueadas.add(numero);
    }

    function desbloquearTemporariamente(numero) {
        conversasBloqueadas.delete(numero);
    }

    function resetarFluxo(numero) {
        clearEtapa(numero);
        removerContatoIniciado(numero);
        desbloquearTemporariamente(numero);
    }

    function reiniciarTimerInatividade(numero) {
        if (timersInatividade.has(numero)) {
            clearTimeout(timersInatividade.get(numero));
        }

        const timer = setTimeout(() => {
            resetarFluxo(numero);
            console.log(`[Inatividade] Fluxo reiniciado para: ${numero.split("@")[0]}`);
        }, INATIVIDADE_MS);

        timersInatividade.set(numero, timer);
    }

    return {
        hasContatoIniciado,
        marcarContatoIniciado,
        removerContatoIniciado,
        getEtapa,
        setEtapa,
        clearEtapa,
        isBloqueada,
        bloquearTemporariamente,
        desbloquearTemporariamente,
        resetarFluxo,
        reiniciarTimerInatividade,
    };
}

module.exports = {
    createChatState,
};
