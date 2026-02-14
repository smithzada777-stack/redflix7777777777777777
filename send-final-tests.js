darequire('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const targetEmail = "adalmirpsantos@gmail.com";

async function sendFinalTests() {
    console.log(`--- ENVIANDO TESTES FINAIS PARA: ${targetEmail} ---`);

    // 1. Teste de Pagamento Pendente (Novo Texto)
    try {
        console.log("Enviando teste PENDENTE...");
        const pending = await resend.emails.send({
            from: 'RedFlix <suporte@redflixoficial.site>',
            to: [targetEmail],
            subject: 'Detalhes do seu pedido na RedFlix',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                    <div style="background: #000; padding: 30px; text-align: center; border-bottom: 4px solid #E50914;">
                        <img src="https://i.imgur.com/6H5gxcw.png" alt="RedFlix" style="height: 40px;">
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="font-size: 24px; color: #111;">Confirmação de Pedido</h2>
                        <p style="color: #555;">Estamos aguardando a confirmação do seu plano <strong>Plano VIP Trimestral</strong>.</p>
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; font-size: 12px; color: #888; text-transform: uppercase;">Total a pagar</p>
                            <p style="margin: 5px 0; font-size: 32px; font-weight: 900; color: #E50914;">R$ 79,90</p>
                            <div style="background: #fff; padding: 10px; border: 1px dashed #ccc; margin-top: 15px; font-family: monospace; font-size: 12px; word-break: break-all;">
                                00020101021226850014br.gov.bcb.pix0136... (Código de exemplo)
                            </div>
                        </div>
                        <p style="font-size: 12px; color: #999;">Dúvidas? <a href="https://wa.me/5571991644164" style="color: #E50914;">Chame no suporte</a></p>
                    </div>
                </div>
            `
        });
        console.log("✅ Pendente enviado:", pending.data.id);
    } catch (e) { console.error("Erro no pendente:", e); }

    await new Promise(r => setTimeout(r, 2000));

    // 2. Teste de Acesso Liberado (Novo Texto)
    try {
        console.log("Enviando teste APROVADO...");
        const approved = await resend.emails.send({
            from: 'RedFlix <suporte@redflixoficial.site>',
            to: [targetEmail],
            subject: 'Seu acesso ao RedFlix está disponível',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                    <div style="background: #000; padding: 30px; text-align: center; border-bottom: 4px solid #E50914;">
                        <img src="https://i.imgur.com/6H5gxcw.png" alt="RedFlix" style="height: 40px;">
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="font-size: 24px; color: #111;">Acesso Liberado</h2>
                        <p style="color: #555;">Olá, seu plano <strong>Plano VIP Trimestral</strong> já está ativo no nosso sistema.</p>
                        <div style="text-align: left; background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 20px 0;">
                            <p style="color: #E50914; font-size: 11px; font-weight: 900; letter-spacing: 1px; margin: 0 0 10px 0;">PRÓXIMOS PASSOS</p>
                            <ul style="padding: 0; list-style: none; color: #333; font-size: 14px;">
                                <li style="margin-bottom: 10px;">✅ Aguarde nosso contato via WhatsApp.</li>
                                <li style="margin-bottom: 10px;">✅ Receba seu login exclusivo.</li>
                                <li style="margin-bottom: 10px;">✅ Aproveite o conteúdo em 4K.</li>
                            </ul>
                        </div>
                        <a href="https://wa.me/5571991644164" style="background: #E50914; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">FALAR COM SUPORTE</a>
                    </div>
                </div>
            `
        });
        console.log("✅ Aprovado enviado:", approved.data.id);
    } catch (e) { console.error("Erro no aprovado:", e); }

    console.log("--- TESTES FINAIS CONCLUÍDOS ---");
}

sendFinalTests();
