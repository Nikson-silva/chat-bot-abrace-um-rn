const { AUDIO_PATHS, IMAGE_PATHS } = require("../config/constants");

function createAtendimentoService({ pixService, conversaLogService }) {
    async function enviarMenuInicial(gateway, remetente) {
        await gateway.enviarTexto(
            remetente,
            "_Olá! 👋 Esta conversa é realizada por um chatbot criado por alunos da Unifacisa para auxiliar no atendimento._",
            2000,
            3000,
        );

        await gateway.enviarAudio(remetente, AUDIO_PATHS.SAUDACAO, 10000);
    }

    async function enviarMenuPrincipal(gateway, remetente, menuPrincipal, inicio = false) {
        if (inicio) {
            await gateway.enviarTexto(
                remetente,
                `*[Abrace um RN]*\n\n*Qual o motivo do seu contato hoje?*\n\n${menuPrincipal}`,
                2000,
                10000,
            );
        } else {
            await gateway.enviarTexto(
                remetente,
                `*[Abrace um RN]*\n\n${menuPrincipal}`,
                2000,
                10000,
            );
        }
    }

    async function enviarSubmenuDoacao(gateway, remetente, submenuDoacao) {
        await gateway.enviarTexto(remetente, submenuDoacao, 2000, 4000);
    }

    async function atenderDoacaoPix(gateway, remetente) {
        const { banco, titular, chave } = pixService.carregarConfigPix();

        await gateway.esperar(2000);
        await gateway.enviarImagem(
            remetente,
            IMAGE_PATHS.DOACAO,
            "image-name",
            "🤝 Doe qualquer valor via PIX e faça a diferença na vida de quem precisa.",
        );

        await gateway.esperar(2000);
        await gateway.enviarAudio(remetente, AUDIO_PATHS.DOACAO_PIX, 8000);

        await gateway.enviarTexto(
            remetente,
            "💛 Quer apoiar o Abrace um RN de forma constante?\n" +
                "Faça uma doação mensal e nos ajude a manter o projeto ativo para cuidar de gestantes e bebês.\n" +
                "Para se inscrever, acesse: https://forms.gle/hMDfr8Ey4JULWB7o8\n" +
                "Sua ajuda faz toda a diferença! 🤝",
            2000,
            3000,
        );

        await gateway.enviarTexto(
            remetente,
            "*[Abrace um RN]*\n\n" +
                `🏦 *${banco}*\n` +
                `👤 *Titular:* ${titular}\n` +
                `📌 *Chave PIX (CPF):* ${chave}\n\n` +
                "📩 Por gentileza, me envie o comprovante para controle.\n\n" +
                "_Abaixo vou repetir a chave pix para facilitar copiar_",
            2000,
            3000,
        );

        await gateway.enviarTexto(remetente, chave.replace(/[-.\s()]/g, ""), 2000, 3000);
    }

    async function atenderDoacaoItens(gateway, remetente) {
        await gateway.esperar(2000);
        await gateway.enviarImagem(
            remetente,
            IMAGE_PATHS.DOACAO,
            "image-name",
            "🤝 Ajude nossa causa!",
        );

        await gateway.esperar(2000);

        await gateway.enviarTexto(
            remetente,
            "🍼 Que lindo gesto!\n\n" +
                "Ficamos muito felizes com sua intenção de doar itens para os bebês. 💙\n\n" +
                "Vou te enviar um áudio com mais detalhes.",
            2000,
            3000,
        );

        await gateway.esperar(2000);
        await gateway.enviarAudio(remetente, AUDIO_PATHS.DOACAO_ITENS, 8000);

        await gateway.enviarTexto(
            remetente,
            "📍 Você pode entregar sua doação no endereço abaixo:\n\n" +
                "Rua Vigário Calixto, 2501 - Catolé, Campina Grande - PB\n\n" +
                "_A seguir, vou enviar a localização para facilitar._",
            2000,
            3000,
        );

        await gateway.esperar(2000);
        await gateway.enviarLocalizacao(remetente, "-7.2332656", "-35.9022903", "Brasil");
    }

    async function atenderGestante(gateway, remetente) {
        await gateway.enviarAudio(remetente, AUDIO_PATHS.GESTANTE, 3000);

        await gateway.enviarTexto(
            remetente,
            "🌟 Que bom que você entrou em contato! 🌟\n\n" +
                "Para receber nosso apoio, basta acessar o site abaixo e preencher o formulário com suas informações ✍️📋. Sua solicitação passará por uma análise feita pela nossa equipe.\n\n" +
                "🔔 Para facilitar o contato, certifique-se de que seu perfil do Instagram esteja aberto (não privado).\n\n" +
                "Em breve, nossa equipe retornará para você pelo WhatsApp 📱, Instagram 📸 ou e-mail 📧.\n\n" +
                "💻 Para receber nosso apoio, acesse:\n" +
                "https://abrace-rn-frontend.vercel.app/receber\n\n" +
                "Estamos aqui para ajudar você no que precisar! 🤗💙",
            2000,
            4000,
        );
    }

    async function atenderVoluntario(gateway, remetente) {
        await gateway.enviarAudio(remetente, AUDIO_PATHS.VOLUNTARIO, 3000);

        await gateway.enviarTexto(
            remetente,
            "🙋‍♀️ Que bom que você quer ser voluntário(a) do Abrace um RN! 🤗\n\n" +
                "Para fazer parte do nosso time e ajudar gestantes em situação de vulnerabilidade, por favor, acesse o link abaixo e preencha o formulário de inscrição:\n\n" +
                "➡️ https://abrace-rn-frontend.vercel.app/voluntarie-se\n\n" +
                "Depois de se cadastrar, entraremos em contato com mais informações.\n\n" +
                "Muito obrigado por querer fazer a diferença com a gente! 💙🤝",
            2000,
            4000,
        );
    }

    async function atenderEmpresaParceira(gateway, remetente) {
        await gateway.enviarAudio(remetente, AUDIO_PATHS.EMPRESA, 3000);
        await gateway.esperar(2000);

        await gateway.enviarTexto(
            remetente,
            "🙋‍♀️ Que bom que você quer ser um Parceiro(a) do Abrace um RN! 🤗\n\n" +
                "Sua empresa pode fazer a diferença na vida de muitas gestantes e bebês.\n\n" +
                "Para iniciar essa parceria, acesse o link abaixo e preencha o formulário:\n\n" +
                "➡️ https://docs.google.com/forms/d/e/1FAIpQLSfqqE5bNaM-nzbMvOVqi17Mxw6nWFZ6mOalipBVdA_dkrTLBg/viewform\n\n" +
                "Depois disso, nossa equipe entrará em contato com você.\n\n" +
                "Muito obrigado pelo interesse em apoiar essa causa! 💙🤝",
            2000,
            4000,
        );
    }

    async function iniciarOutrosAssuntos(gateway, remetente) {
        await gateway.enviarAudio(remetente, AUDIO_PATHS.OUTROS, 3000);

        await gateway.enviarTexto(
            remetente,
            "📩 Por favor, conte um pouco mais sobre o assunto que deseja tratar. Estamos aqui para ajudar!",
            2000,
            4000,
        );
    }

    async function confirmarOutrosAssuntos(gateway, remetente, textoUsuario) {
        await gateway.enviarTexto(
            remetente,
            "✅ Recebemos sua mensagem!\n\n" +
                "Nossa equipe analisará o que você enviou e continuará o atendimento assim que possível.\n\n" +
                "📝 Resumo do que você informou:\n" +
                `${textoUsuario}`,
            2000,
            4000,
        );
    }

    function registrarMotivo(remetente, motivo) {
        conversaLogService.salvarConversasIniciadas(remetente, motivo);
    }

    return {
        enviarMenuInicial,
        enviarMenuPrincipal,
        enviarSubmenuDoacao,
        atenderDoacaoPix,
        atenderDoacaoItens,
        atenderGestante,
        atenderVoluntario,
        atenderEmpresaParceira,
        iniciarOutrosAssuntos,
        confirmarOutrosAssuntos,
        registrarMotivo,
    };
}

module.exports = {
    createAtendimentoService,
};
