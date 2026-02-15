import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { sendEmail } from '@/lib/email';
import querystring from 'querystring';

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const contentType = req.headers.get('content-type') || '';
        let data: any;

        // Parse inteligente para suportar múltiplos formatos (JSON ou Form UrlEncoded)
        if (contentType.includes('application/json')) {
            try {
                data = JSON.parse(bodyText);
            } catch (e) {
                data = querystring.parse(bodyText);
            }
        } else {
            data = querystring.parse(bodyText);
        }

        console.log('--- [WEBHOOK PUSHINPAY] RECEBIDO ---');

        const transactionId = (data.id || data.transaction_id || data.reference || data.external_id || data.reference_id)?.toString().toLowerCase();
        const status = (data.status || data.transaction_status || '').toString().toLowerCase();
        const rawPayerEmail = data.payer_email || data.email || data.payer?.email;
        const payerEmail = rawPayerEmail?.toLowerCase().trim();

        if (!transactionId) {
            console.error('[WEBHOOK] Sem ID de transação no payload.');
            return NextResponse.json({ error: 'ID not found' }, { status: 200 });
        }

        console.log(`[WEBHOOK] ID: ${transactionId} | Status: ${status}`);

        // 1. Atualiza a coleção de pagamentos
        try {
            if (adminDb) {
                await adminDb.collection('payments').doc(transactionId).set({
                    status: status,
                    updated_at: new Date().toISOString(),
                    webhook_payload: data
                }, { merge: true });
            }
        } catch (dbError) {
            console.error('[WEBHOOK] Erro ao atualizar payments:', dbError);
        }

        // 2. Se o status for positivo, atualiza o Lead e envia o e-mail de acesso
        const positiveStatuses = ['paid', 'approved', 'confirmed', 'concluido', 'sucesso'];
        if (positiveStatuses.includes(status)) {
            console.log(`[WEBHOOK] Pagamento confirmado para ID: ${transactionId}. Iniciando liberação...`);

            if (adminDb) {
                const leadsRef = adminDb.collection('leads');
                const snapshot = await leadsRef.where('transactionId', '==', transactionId).get();

                if (!snapshot.empty) {
                    for (const doc of snapshot.docs) {
                        const leadData = doc.data();

                        try {
                            const newStatus = leadData.isRenewal ? 'renewed' : 'approved';
                            // Primeiro garante a atualização no Banco (Dashboard)
                            await doc.ref.update({
                                status: newStatus,
                                paidAt: new Date().toISOString()
                            });
                            console.log(`[WEBHOOK] Lead ${doc.id} ATUALIZADO PARA ${newStatus.toUpperCase()} no banco.`);
                        } catch (dbErr: any) {
                            console.error(`[WEBHOOK] Erro ao atualizar lead no banco: ${dbErr.message}`);
                        }

                        // Depois tenta enviar o e-mail (isolado)
                        if (leadData.email) {
                            try {
                                await sendEmail({
                                    email: leadData.email,
                                    plan: leadData.plan || 'Plano RedFlix',
                                    price: leadData.price || '0,00',
                                    status: 'approved'
                                });
                                console.log(`[WEBHOOK] E-mail de aprovação enviado com sucesso para ${leadData.email}`);
                            } catch (emailErr: any) {
                                console.error(`[WEBHOOK] FALHA NO E-MAIL (Mas Dashboard foi atualizado): ${emailErr.message}`);
                            }
                        }
                    }
                } else if (payerEmail) {
                    // FALLBACK: Tenta por e-mail se não achou por ID de transação diretamente
                    console.log(`[WEBHOOK] Tentando fallback por e-mail: ${payerEmail}`);

                    // Busca sem filtro de status primeiro para conferir se o lead existe
                    const snapEmail = await leadsRef.where('email', 'in', [payerEmail, payerEmail.toLowerCase()]).get();

                    if (!snapEmail.empty) {
                        // Pega o lead mais recente que esteja pendente
                        const doc = snapEmail.docs.find(d => ['pending', 'pending_payment'].includes(d.data().status)) || snapEmail.docs[0];
                        const leadData = doc.data();

                        try {
                            const newStatus = leadData.isRenewal ? 'renewed' : 'approved';
                            await doc.ref.update({
                                status: newStatus,
                                transactionId: transactionId,
                                paidAt: new Date().toISOString()
                            });
                            console.log(`[WEBHOOK] Lead ${doc.id} aprovado via Fallback de E-mail.`);

                            await sendEmail({
                                email: payerEmail,
                                plan: leadData.plan || 'Plano RedFlix',
                                price: leadData.price || '0,00',
                                status: 'approved',
                                origin: leadData.origin || 'RedFlix'
                            });
                        } catch (err: any) {
                            console.error(`[WEBHOOK] Erro no fluxo de fallback: ${err.message}`);
                        }
                    } else {
                        console.error(`[WEBHOOK] ERRO CRÍTICO: Nenhum lead encontrado para o e-mail ${payerEmail} ou transação ${transactionId}. O pagamento foi recebido mas não pôde ser vinculado a um cliente.`);
                    }
                }
            }
        }

        return NextResponse.json({ success: true, message: 'Webhook processed' }, { status: 200 });

    } catch (error: any) {
        console.error('--- [WEBHOOK] ERRO CRÍTICO ---', error.message);
        return NextResponse.json({ error: 'Internal Error' }, { status: 200 });
    }
}
