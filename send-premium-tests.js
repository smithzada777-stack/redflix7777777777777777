require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const targetEmail = "adalmirpsantos@gmail.com";

const Header = `
    <tr>
        <td align="center" style="background: #000000; background: linear-gradient(180deg, #1a0202 0%, #000000 100%); padding: 50px 20px; border-bottom: 5px solid #E50914;">
            <img src="https://i.imgur.com/6H5gxcw.png" alt="RedFlix" style="height: 65px; width: auto; display: block;" />
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
        body { margin: 0; padding: 0; width: 100% !important; font-family: 'Outfit', Arial, sans-serif; background-color: #050505; color: #ffffff; }
        .container { max-width: 600px; margin: 20px auto; background-color: #0a0a0a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
        .button {
            background-color: #E50914;
            color: #ffffff !important;
            padding: 18px 36px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 900;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 10px 20px rgba(229, 9, 20, 0.3);
            margin: 20px 0;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505;">
    <center>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="container">
            ${Header}
            <tr>
                <td style="padding: 50px 40px; text-align: center; color: #ffffff;">
                    ${content}
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 30px; background-color: #000000; color: #555555; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
                    <p style="margin: 0;">RedFlix © 2026 • Operação Premium</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;

async function sendPremiumTests() {
    console.log(`--- ENVIANDO TESTES PREMIUM PARA: ${targetEmail} ---`);
    const supportPhone = '5571991644164';

    // 1. Teste PENDENTE (Checkout Site)
    const origin1 = 'site-oficial';
    const plan1 = 'Plano Anual VIP';
    const waMsgPending = encodeURIComponent(`Olá, acabei de assinar o ${plan1} via ${origin1}, mas ainda estou com dúvida, poderia me ajudar?`);

    const contentPending = `
        <h2 style="font-size: 28px; font-weight: 900; margin: 0 0 10px 0; color: #ffffff;">PEDIDO CONFIRMADO</h2>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; color: #cccccc;">
            Estamos aguardando a confirmação do seu plano <strong>${plan1}</strong>.
        </p>

        <div style="background-color: #111111; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 30px; margin-bottom: 30px; text-align: center;">
            <p style="color: #555555; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 5px 0;">VALOR DO INVESTIMENTO</p>
            <p style="color: #E50914; font-size: 42px; font-weight: 900; margin: 0 0 20px 0; letter-spacing: -2px;">R$ 149,90</p>
            
            <div style="background-color: #000000; padding: 20px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.1); text-align: left;">
                <p style="margin: 0 0 10px 0; color: #999; font-size: 11px; text-transform: uppercase; font-weight: bold;">Copia e Cola Pix:</p>
                <code style="display: block; font-family: monospace; color: #22c55e; word-break: break-all; font-size: 12px; background: #0a0a0a; padding: 15px; border-radius: 6px;">00020101021226850014br.gov.bcb.pix0136...</code>
            </div>
        </div>

        <a href="https://wa.me/${supportPhone}?text=${waMsgPending}" style="color: #E50914; text-decoration: none; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
            PREFERE PAGAR POR WHATSAPP? FALE CONOSCO
        </a>
    `;

    // 2. Teste APROVADO (Painel Admin)
    const origin2 = 'painel-admin';
    const plan2 = 'Plano Trimestral VIP';
    const waMsgApproved = encodeURIComponent(`Oi, meu pagamento do ${plan2} via ${origin2} foi aprovado! Quero meu acesso agora.`);

    const contentApproved = `
        <h2 style="font-size: 28px; font-weight: 900; margin: 0 0 10px 0; color: #ffffff; italic; tracking-tighter;">ACESSO LIBERADO!</h2>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; color: #cccccc;">
            Olá, seu plano <strong>${plan2}</strong> já está ativo. Preparamos tudo para você.
        </p>
        
        <div style="background-color: #111111; border: 1px solid rgba(229, 9, 20, 0.2); border-radius: 12px; padding: 30px; text-align: left; margin-bottom: 30px;">
            <p style="color: #E50914; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">COMO ASSISTIR AGORA</p>
            <div style="margin-bottom: 12px; font-size: 14px; color: #ffffff;"><strong>1.</strong> Clique no botão de suporte abaixo para resgatar seu login.</div>
            <div style="margin-bottom: 12px; font-size: 14px; color: #ffffff;"><strong>2.</strong> Informe que veio do <strong>${origin2}</strong>.</div>
            <div style="font-size: 14px; color: #ffffff;"><strong>3.</strong> Nossa equipe enviará suas credenciais em instantes.</div>
        </div>

        <a href="https://wa.me/${supportPhone}?text=${waMsgApproved}" class="button">
            RESGATAR MEU ACESSO
        </a>
    `;

    try {
        console.log("Enviando PENDENTE (Site)...");
        await resend.emails.send({
            from: 'RedFlix <suporte@redflixoficial.site>',
            to: [targetEmail],
            subject: 'Aguardando confirmação do seu pedido RedFlix',
            html: getBaseHtml(contentPending)
        });

        console.log("Enviando APROVADO (Painel)...");
        await resend.emails.send({
            from: 'RedFlix <suporte@redflixoficial.site>',
            to: [targetEmail],
            subject: 'Seu acesso ao RedFlix está disponível',
            html: getBaseHtml(contentApproved)
        });

        console.log("✅ Testes Premium enviados!");
    } catch (e) {
        console.error("Erro nos testes:", e);
    }
}

sendPremiumTests();
