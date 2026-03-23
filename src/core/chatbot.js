const {
    MENU_PRINCIPAL,
    SUBMENU_DOACAO,
    SAUDACOES_HUMANAS,
    ETAPAS,
} = require("../config/constants");

function createChatbot({ gateway, state, bloqueioService, atendimentoService }) {
    const botOnlineTimestamp = Date.now();

    async function iniciarFluxo(remetente) {
        state.marcarContatoIniciado(remetente);

        console.info(`\n[-] Nova conversa iniciada com ${remetente.split("@")[0]}\n`);

        await atendimentoService.enviarMenuInicial(gateway, remetente);
        await atendimentoService.enviarMenuPrincipal(gateway, remetente, MENU_PRINCIPAL, true);

        state.setEtapa(remetente, { etapa: ETAPAS.AGUARDANDO_OPCAO });
    }

    async function voltarAoMenuPrincipal(remetente, voltarMenu = false) {
        if (!voltarMenu) {
            await gateway.enviarTexto(
                remetente,
                "Se desejar, você pode escolher outra opção no menu abaixo. 💙",
                1500,
                2500,
            );
        }

        await atendimentoService.enviarMenuPrincipal(gateway, remetente, MENU_PRINCIPAL);
        state.setEtapa(remetente, { etapa: ETAPAS.AGUARDANDO_OPCAO });
    }

    async function tratarSubopcaoDoacao(remetente, texto) {
        switch (texto) {
            case "1":
                await atendimentoService.atenderDoacaoPix(gateway, remetente);
                // await voltarAoMenuPrincipal(remetente);
                return;

            case "2":
                await atendimentoService.atenderDoacaoItens(gateway, remetente);
                // await voltarAoMenuPrincipal(remetente);
                return;

            case "3":
                await voltarAoMenuPrincipal(remetente, true);
                return;

            default:
                await gateway.enviarTexto(
                    remetente,
                    "❌ Opção inválida.\n\nEscolha uma opção:\n\n_1 - Doar via PIX_\n_2 - Doar itens para o bebê_\n_3 - Voltar ao menu principal",
                    2000,
                    4000,
                );
                return;
        }
    }

    async function tratarMenuPrincipal(remetente, texto) {
        switch (texto) {
            case "1":
                atendimentoService.registrarMotivo(remetente, "1 - Quero fazer uma doação");
                await atendimentoService.enviarSubmenuDoacao(gateway, remetente, SUBMENU_DOACAO);
                state.setEtapa(remetente, { etapa: ETAPAS.AGUARDANDO_SUBOPCAO_DOACAO });
                return;

            case "2":
                atendimentoService.registrarMotivo(
                    remetente,
                    "2 - Sou gestante e preciso de ajuda",
                );
                await atendimentoService.atenderGestante(gateway, remetente);
                await voltarAoMenuPrincipal(remetente);
                return;

            case "3":
                atendimentoService.registrarMotivo(remetente, "3 - Quero ser voluntário(a)");
                await atendimentoService.atenderVoluntario(gateway, remetente);
                await voltarAoMenuPrincipal(remetente);
                return;

            case "4":
                atendimentoService.registrarMotivo(
                    remetente,
                    "4 - Tenho uma empresa e quero ser parceiro",
                );
                await atendimentoService.atenderEmpresaParceira(gateway, remetente);
                await voltarAoMenuPrincipal(remetente);
                return;

            case "5":
                atendimentoService.registrarMotivo(remetente, "5 - Outros assuntos");
                await atendimentoService.iniciarOutrosAssuntos(gateway, remetente);
                state.setEtapa(remetente, { etapa: ETAPAS.AGUARDANDO_OUTROS_ASSUNTOS });
                return;

            default:
                await gateway.enviarTexto(
                    remetente,
                    `*[Abrace um RN]*\n\n❌ Opção inválida. Por favor, tente novamente!${MENU_PRINCIPAL}`,
                    2000,
                    4000,
                );
                return;
        }
    }

    async function tratarOutrosAssuntos(remetente, textoOriginal) {
        await atendimentoService.confirmarOutrosAssuntos(gateway, remetente, textoOriginal);
        await voltarAoMenuPrincipal(remetente);
    }

    async function processarMensagem(message) {
        if (
            !message.body ||
            !message.from ||
            message.isGroupMsg ||
            message.chatId === "status@broadcast"
        ) {
            return;
        }

        const textoOriginal = message.body.trim();
        const texto = textoOriginal.toLowerCase();
        const remetente = message.from;
        const etapaUsuario = state.getEtapa(remetente);
        const etapaAtual = etapaUsuario?.etapa;
        const horaMensagem = message.t ? message.t * 1000 : Date.now();

        if (message.fromMe && texto === "removi do chatbot") {
            bloqueioService.bloquearPermanentemente(message.to);
            state.clearEtapa(message.to);
            state.bloquearTemporariamente(message.to);
            return;
        }

        if (horaMensagem < botOnlineTimestamp) {
            return;
        }

        if (bloqueioService.isBloqueadoPermanentemente(remetente)) {
            return;
        }

        if (state.isBloqueada(remetente)) {
            return;
        }

        if (message.fromMe && SAUDACOES_HUMANAS.includes(texto)) {
            state.bloquearTemporariamente(message.to);
            state.clearEtapa(message.to);
            console.log(
                `[INFO] O fluxo não será iniciado para o número: ${message.to.split("@")[0]}`,
            );
            return;
        }

        state.reiniciarTimerInatividade(remetente);

        if (
            !state.hasContatoIniciado(remetente) &&
            !message.fromMe &&
            !state.isBloqueada(remetente)
        ) {
            await iniciarFluxo(remetente);
            return;
        }

        if (message.fromMe) {
            return;
        }

        if (etapaAtual === ETAPAS.AGUARDANDO_SUBOPCAO_DOACAO) {
            await tratarSubopcaoDoacao(remetente, texto);
            return;
        }

        if (etapaAtual === ETAPAS.AGUARDANDO_OPCAO) {
            await tratarMenuPrincipal(remetente, texto);
            return;
        }

        if (etapaAtual === ETAPAS.AGUARDANDO_OUTROS_ASSUNTOS) {
            await tratarOutrosAssuntos(remetente, textoOriginal);
            return;
        }

        await atendimentoService.enviarMenuPrincipal(gateway, remetente, MENU_PRINCIPAL);
        state.setEtapa(remetente, { etapa: ETAPAS.AGUARDANDO_OPCAO });
    }

    function start() {
        gateway.onAnyMessage(async (message) => {
            try {
                await processarMensagem(message);
            } catch (error) {
                console.error("Erro ao processar mensagem:", error.message);
            }
        });
    }

    return {
        start,
    };
}

module.exports = {
    createChatbot,
};
