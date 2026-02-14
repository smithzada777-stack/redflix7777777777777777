require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const targetEmail = "adalmirpsantos@gmail.com";

const Header = `
    <tr>
        <td align="center" style="background: #000000; background: linear-gradient(180deg, #1a0202 0%, #000000 100%); padding: 45px 20px; border-bottom: 4px solid #E50914;">
            <img src="https://i.imgur.com/6H5gxcw.png" alt="RedFlix" style="height: 55px; width: auto; display: block;" />
        </td>
    </tr>
`;

const getBaseHtml = (content) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; width: 100% !important; font-family: 'Outfit', 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; color: #333333; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #eeeeee; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .button {
            background-color: #E50914;
            color: #ffffff !important;
            padding: 18px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 900;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 20px 0;
            font-size: 14px;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f6f6;">
    <center>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="background-color: #ffffff;">
            ${Header}
            <tr>
                <td style="padding: 45px 35px; text-align: center; color: #333333;">
                    ${content}
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 25px; background-color: #fafafa; color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0;">RedFlix © 2026 • Premium Experience</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;

async function sendVoiceFeedbackTests() {
    console.log(`--- ENVIANDO TESTES (FEEDBACK ÁUDIO) PARA: ${targetEmail} ---`);
    const supportPhone = '5571991644164';

    // 1. Teste PENDENTE
    const price1 = "29,90";
    const waMsgPending = encodeURIComponent(`Olá, acabei de gerar o pedido da assinatura de R$ ${price1} na RedFlix e tenho dúvidas, poderia me ajudar?`);

    const contentPending = `
        <div style="font-size: 40px; margin-bottom: 10px;">⏳</div>
        <h2 style="font-size: 26px; font-weight: 900; margin: 0 0 10px 0; color: #111111; letter-spacing: -1px;">PEDIDO PENDENTE</h2>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 10%; color: #666666;">
            Recebemos sua solicitação para a assinatura de <strong>R$ ${price1}</strong>.
        </p>

        <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 12px; padding: 25px; margin: 30px 0;">
            <p style="color: #999999; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 5px 0;">VALOR DA ASSINATURA</p>
            <p style="color: #E50914; font-size: 38px; font-weight: 900; margin: 0; letter-spacing: -1px;">R$ ${price1}</p>
        </div>

        <p style="font-size: 14px; color: #777; margin-bottom: 10px;">Caso tenha qualquer dúvida sobre o pagamento ou queira acelerar o processo:</p>
        <a href="https://wa.me/${supportPhone}?text=${waMsgPending}" class="button">
            FALAR COM SUPORTE
        </a>
    `;

    // 2. Teste APROVADO
    const waMsgApproved = encodeURIComponent(`Oi, acabei de assinar meu plano na RedFlix e ainda não recebi meu acesso, poderia me ajudar?`);

    const contentApproved = `
        <div style="font-size: 40px; margin-bottom: 10px;">✅</div>
        <h2 style="font-size: 26px; font-weight: 900; margin: 0 0 10px 0; color: #111111; letter-spacing: -1px;">ACESSO LIBERADO!</h2>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 10%; color: #666666;">
            Sua assinatura já está ativa no sistema. Siga os passos para começar a assistir agora.
        </p>
        
        <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 12px; padding: 25px; text-align: left; margin: 30px 0;">
            <p style="color: #E50914; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0;">PRÓXIMOS PASSOS</p>
            <div style="margin-bottom: 10px; font-size: 14px; color: #333;"><strong>1.</strong> Clique no botão de suporte abaixo para resgatar seu login.</div>
            <div style="margin-bottom: 10px; font-size: 14px; color: #333;"><strong>2.</strong> Nossa equipe enviará suas credenciais exclusivas.</div>
            <div style="font-size: 14px; color: #333;"><strong>3.</strong> Aproveite todo o conteúdo em 4K.</div>
        </div>

        <a href="https://wa.me/${supportPhone}?text=${waMsgApproved}" class="button">
            RESGATAR MEU ACESSO
        </a>
    `;

    try {
        console.log("Enviando PENDENTE corrigido...");
        await resend.emails.send({
            from: 'RedFlix <suporte@redflixoficial.site>',
            to: [targetEmail],
            subject: '⏳ Pedido Pendente - RedFlix',
            html: getBaseHtml(contentPending)
        });

        console.log("Enviando APROVADO corrigido...");
        await resend.emails.send({
            from: 'RedFlix <suporte@redflixoficial.site>',
            to: [targetEmail],
            subject: '✅ Seu acesso ao RedFlix está disponível',
            html: getBaseHtml(contentApproved)
        });

        console.log("✅ Novos testes enviados!");
    } catch (e) { console.error("Erro:", e); }
}

sendVoiceFeedbackTests();
