require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const emails = [
    "adalmirpsantos@gmail.com",
    "adalmirspereira@gmail.com",
    "adalmirferreira277@gmail.com",
    "dvielaferreira@gmail.com",
    "smithzada777@gmail.com",
    "setteoriginal@gmail.com",
    "ricosopereira3@gmail.com",
    "sntos436@gmail.com",
    "jose123fa27@gmail.com"
];

const resend = new Resend(process.env.RESEND_API_KEY);

async function warmupDomain() {
    console.log(`--- INICIANDO AQUECIMENTO DO DOMÍNIO (${emails.length} e-mails) ---`);

    for (const email of emails) {
        try {
            console.log(`Enviando para: ${email}...`);
            const { data, error } = await resend.emails.send({
                from: 'Suporte RedFlix <suporte@redflixoficial.site>',
                to: [email],
                subject: 'Informações sobre seu acesso RedFlix',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                        <h2 style="color: #E50914;">Olá!</h2>
                        <p>Este é um e-mail de serviço para confirmar as suas informações de contato na RedFlix.</p>
                        <p><strong>Ação necessária:</strong> Se este e-mail caiu na sua pasta de Promoções ou Spam, por favor, mova-o para a "Caixa de Entrada" e marque como "Confiável". Isso garante que você receba seus logins futuros sem atrasos.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #888;">Equipe Técnica RedFlix</p>
                    </div>
                `
            });

            if (error) {
                console.error(`❌ Erro para ${email}:`, error);
            } else {
                console.log(`✅ Enviado para ${email}. ID: ${data.id}`);
            }
        } catch (e) {
            console.error(`❌ Falha crítica para ${email}:`, e.message);
        }
        // Pequena pausa para evitar bloqueios por rajada
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log("--- AQUECIMENTO CONCLUÍDO ---");
}

warmupDomain();
