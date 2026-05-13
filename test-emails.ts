import { sendEmail } from './src/lib/email';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function test() {
    console.log("Enviando Pendente...");
    const res1 = await sendEmail({
        email: 'adalmirpsantos@gmail.com',
        plan: 'Plano Teste (Mensal)',
        price: '29,90',
        status: 'pending',
        origin: 'Teste Manual',
        phone: '5571991644164'
    });
    console.log("Resultado Pendente:", res1);

    console.log("Enviando Aprovado...");
    const res2 = await sendEmail({
        email: 'adalmirpsantos@gmail.com',
        plan: 'Plano Teste (Mensal)',
        price: '29,90',
        status: 'approved',
        origin: 'Teste Manual',
        phone: '5571991644164'
    });
    console.log("Resultado Aprovado:", res2);

    console.log("Testes enviados com sucesso!");
}

test().catch(console.error);
