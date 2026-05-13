import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build');

const Header = () => `
    <tr>
        <td align="center" style="background: #000000; background: linear-gradient(180deg, #1a0202 0%, #000000 100%); padding: 45px 20px; border-bottom: 4px solid #E50914;">
            <img src="https://i.imgur.com/MD1ffQ7.png" alt="DvnFlix" style="height: 55px; width: auto; display: block;" />
        </td>
    </tr>
`;

export const getEmailHtml = (content: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DvnFlix</title>
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
                    <p style="margin: 0;">DvnFlix © 2026 • Premium Experience</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;

export async function sendEmail({ email, plan, price, status, pixCode, origin = 'DvnFlix', phone = '' }: { email: string, plan: string, price: string, status: string, pixCode?: string, origin?: string, phone?: string }) {
    if (!process.env.RESEND_API_KEY) return { error: "API Key missing" };

    try {
        await notifyAdmin({ email, plan, price, status, origin, phone });
    } catch (e) {
        console.error("Erro ao notificar admin:", e);
    }

    // Se não for um teste interno, não envia mais o e-mail para o cliente (pedido do admin)
    if (!email.toLowerCase().includes('teste')) {
        return { data: { id: "skipped_customer" } };
    }

    if (email.toLowerCase().startsWith('anon.') || email.toLowerCase().includes('@redflix.com')) {
        return { data: { id: "skipped_anonymous" } };
    }

    let subject = '';
    let innerContent = '';
    const supportPhone = '5571991644164';
    const cleanOrigin = origin === 'painel-admin' ? 'DvnFlix' : origin;

    if (status === 'approved') {
        subject = '✅ Seu acesso ao DvnFlix está disponível';
        const waMsgApproved = encodeURIComponent(`Oi, acabei de assinar meu plano na DvnFlix e ainda não recebi meu acesso, poderia me ajudar?`);

        innerContent = `
            <div style="font-size: 40px; margin-bottom: 10px;">✅</div>
            <h2 style="font-size: 26px; font-weight: 900; margin: 0 0 10px 0; color: #111111; letter-spacing: -1px;">ACESSO LIBERADO!</h2>
            <p style="font-size: 16px; line-height: 1.6; margin: 0 10%; color: #666666;">
                Sua assinatura já está ativa no sistema. Siga os passos para começar a assistir agora.
            </p>
            
            <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 12px; padding: 25px; text-align: left; margin: 30px 0;">
                <p style="color: #E50914; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0;">PRÓXIMOS PASSOS</p>
                <div style="margin-bottom: 10px; font-size: 14px; color: #333;"><strong>1.</strong> Aguarde no máximo até <strong>5 minutos</strong> para que nosso sistema envie seu acesso diretamente pelo WhatsApp.</div>
                <div style="margin-bottom: 10px; font-size: 14px; color: #333;"><strong>2.</strong> Caso não receba dentro desse prazo, você pode acionar nosso suporte clicando no botão abaixo.</div>
                <div style="font-size: 14px; color: #333;"><strong>3.</strong> Aproveite todo o conteúdo em 4K.</div>
            </div>

            <a href="https://wa.me/${supportPhone}?text=${waMsgApproved}" class="button">
                SUPORTE VIA WHATSAPP
            </a>
        `;
    } else {
        subject = '⏳ Pedido Pendente - DvnFlix';
        // Formantando o preço para ficar bonito na mensagem do WA
        const cleanPrice = price.toString().replace('.', ',');
        const waMsgPending = encodeURIComponent(`Olá, acabei de gerar o pedido da assinatura de R$ ${cleanPrice} na DvnFlix e tenho dúvidas, poderia me ajudar?`);

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

            <p style="font-size: 14px; color: #777; margin-bottom: 10px;">Aguarde no máximo até <strong>5 minutos</strong> após o pagamento para que o acesso chegue via WhatsApp. Se não receber ou tiver dúvidas sobre o pagamento, chame no botão abaixo:</p>
            <a href="https://wa.me/${supportPhone}?text=${waMsgPending}" class="button">
                SUPORTE VIA WHATSAPP
            </a>
        `;
    }

    const isRenove = origin === 'renove';
    const sender = isRenove ? 'Renove <renove@redflixoficial.site>' : 'DvnFlix <suporte@redflixoficial.site>';

    try {
        const { data, error } = await resend.emails.send({
            from: sender,
            to: [email],
            subject: isRenove ? subject.replace('DvnFlix', 'Renove') : subject,
            html: getEmailHtml(innerContent),
        });
        if (error) return { error };
        return { data };
    } catch (error) {
        return { error: String(error) };
    }
}

async function notifyAdmin({ email, plan, price, status, origin, phone }: any) {
    const adminEmail = 'adalmirpsantos@gmail.com';
    const isApproved = status === 'approved';
    const cleanPrice = price.toString().replace('.', ',');

    const subject = isApproved
        ? `💰 VENDA APROVADA: R$ ${cleanPrice} (${origin})`
        : `⏳ NOVO PIX GERADO: R$ ${cleanPrice} (${origin})`;

    const content = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: ${isApproved ? '#22c55e' : '#e50914'}; text-transform: uppercase;">
                ${isApproved ? '✅ VENDA APROVADA - ENVIAR ACESSO!' : '⏳ Novo Pix Gerado'}
            </h2>
            <p style="font-size: 14px; background: #f0fdf4; padding: 10px; border-radius: 5px; color: #166534; font-weight: bold; display: ${isApproved ? 'block' : 'none'};">
                Busque este e-mail no seu Dashboard para pegar o WhatsApp do cliente e liberar o acesso!
            </p>
            <p><strong>Origem:</strong> ${origin === 'landing_page' ? 'DVNFLIX LP' : origin === 'renove' ? 'RENOVE APP' : 'DASHBOARD'}</p>
            <p><strong>Plano:</strong> ${plan}</p>
            <p><strong>Valor:</strong> R$ ${cleanPrice}</p>
            <p><strong>Cliente:</strong> ${email}</p>
            <p><strong>WhatsApp:</strong> ${phone}</p>
            ${isApproved && phone ? `<p style="margin-top: 15px;"><a href="https://wa.me/${phone.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20seu%20acesso%20da%20DvnFlix%20est%C3%A1%20liberado!" style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">📲 CHAMAR NO WHATSAPP</a></p>` : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 10px; color: #999;">Notificação automática do sistema DvnFlix.</p>
        </div>
    `;

    return resend.emails.send({
        from: 'DvnFlix <onboarding@resend.dev>',
        to: [adminEmail],
        subject: subject,
        html: content,
    });
}
