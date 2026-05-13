import { sendEmail } from './src/lib/email';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function test() {
    console.log("Enviando Pendente...");
    await sendEmail({
        email: 'adalmirpsantos@gmail.com',
        plan: 'Plano Teste (Mensal)',
        price: '29,90',
        status: 'pending',
        origin: 'Teste Manual'
    });

    console.log("Enviando Aprovado...");
    await sendEmail({
        email: 'adalmirpsantos@gmail.com',
        plan: 'Plano Teste (Mensal)',
        price: '29,90',
        status: 'approved',
        origin: 'Teste Manual'
    });

    console.log("Testes enviados com sucesso!");
}

test().catch(console.error);
