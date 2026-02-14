import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build');

const Header = () => `
    <tr>
        <td align="center" style="background: #000000; background: linear-gradient(180deg, #1a0202 0%, #000000 100%); padding: 45px 20px; border-bottom: 4px solid #E50914;">
            <img src="https://i.imgur.com/6H5gxcw.png" alt="RedFlix" style="height: 55px; width: auto; display: block;" />
        </td>
    </tr>
`;

export const getEmailHtml = (content: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RedFlix</title>
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
            ${Header()}
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

export async function sendEmail({ email, plan, price, status, pixCode, origin = 'RedFlix' }: { email: string, plan: string, price: string, status: string, pixCode?: string, origin?: string }) {
    if (!process.env.RESEND_API_KEY) return { error: "API Key missing" };

    // Notificar Admin (Adalmir) sobre a atividade
    try {
        await notifyAdmin({ email, plan, price, status, origin });
    } catch (e) {
        console.error("Erro ao notificar admin:", e);
    }

    if (email.toLowerCase().startsWith('anon.') || email.toLowerCase().includes('@redflix.com')) {
        return { data: { id: "skipped_anonymous" } };
    }

    let subject = '';
    let innerContent = '';
    const supportPhone = '5571991644164';
    const cleanOrigin = origin === 'painel-admin' ? 'RedFlix' : origin;

    if (status === 'approved') {
        subject = '✅ Seu acesso ao RedFlix está disponível';
        const waMsgApproved = encodeURIComponent(`Oi, acabei de assinar meu plano na RedFlix e ainda não recebi meu acesso, poderia me ajudar?`);

        innerContent = `
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
    } else {
        subject = '⏳ Pedido Pendente - RedFlix';
        // Formantando o preço para ficar bonito na mensagem do WA
        const cleanPrice = price.toString().replace('.', ',');
        const waMsgPending = encodeURIComponent(`Olá, acabei de gerar o pedido da assinatura de R$ ${cleanPrice} na RedFlix e tenho dúvidas, poderia me ajudar?`);

        innerContent = `
            <div style="font-size: 40px; margin-bottom: 10px;">⏳</div>
            <h2 style="font-size: 26px; font-weight: 900; margin: 0 0 10px 0; color: #111111; letter-spacing: -1px;">PEDIDO PENDENTE</h2>
            <p style="font-size: 16px; line-height: 1.6; margin: 0 10%; color: #666666;">
                Recebemos sua solicitação para a assinatura de <strong>R$ ${cleanPrice}</strong>.
            </p>

            <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 12px; padding: 25px; margin: 30px 0;">
                <p style="color: #999999; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 5px 0;">VALOR DA ASSINATURA</p>
                <p style="color: #E50914; font-size: 38px; font-weight: 900; margin: 0; letter-spacing: -1px;">R$ ${cleanPrice}</p>
            </div>

            <p style="font-size: 14px; color: #777; margin-bottom: 10px;">Caso tenha qualquer dúvida sobre o pagamento ou queira acelerar o processo:</p>
            <a href="https://wa.me/${supportPhone}?text=${waMsgPending}" class="button">
                FALAR COM SUPORTE
            </a>
        `;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'RedFlix <suporte@redflixoficial.site>',
            to: [email],
            subject: subject,
            html: getEmailHtml(innerContent),
        });
        if (error) return { error };
        return { data };
    } catch (error) {
        return { error: String(error) };
    }
}

async function notifyAdmin({ email, plan, price, status, origin }: any) {
    const adminEmail = 'adalmirpsantos@gmail.com';
    const isApproved = status === 'approved';
    const cleanPrice = price.toString().replace('.', ',');

    const subject = isApproved
        ? `💰 VENDA APROVADA: R$ ${cleanPrice} (${origin})`
        : `⏳ NOVO PIX GERADO: R$ ${cleanPrice} (${origin})`;

    const content = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: ${isApproved ? '#22c55e' : '#e50914'}; text-transform: uppercase;">
                ${isApproved ? 'Venda Aprovada!' : 'Novo Pix Gerado'}
            </h2>
            <p><strong>Origem:</strong> ${origin === 'landing_page' ? 'REDFLIX LP' : origin === 'renove' ? 'RENOVE APP' : 'DASHBOARD'}</p>
            <p><strong>Plano:</strong> ${plan}</p>
            <p><strong>Valor:</strong> R$ ${cleanPrice}</p>
            <p><strong>Cliente:</strong> ${email}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 10px; color: #999;">Notificação automática do sistema RedFlix.</p>
        </div>
    `;

    return resend.emails.send({
        from: 'Sistema <sistema@redflixoficial.site>',
        to: [adminEmail],
        subject: subject,
        html: content,
    });
}
