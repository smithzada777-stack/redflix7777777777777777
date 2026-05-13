import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { adminDb } from '@/lib/firebaseAdmin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build');
const ADMIN_EMAIL = 'adalmirpsantos@gmail.com';

// Calcula dias restantes da assinatura
function getDaysRemaining(createdAt: any, plan: string): number {
    if (!createdAt) return 999;
    const created = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

    let totalDays = 30;
    const planLower = (plan || '').toLowerCase();
    if (planLower.includes('tri') || planLower === '3 meses') totalDays = 90;
    else if (planLower.includes('sem') || planLower === '6 meses') totalDays = 180;

    return totalDays - diffDays;
}

// Vercel Cron: roda 1x por dia
// GET /api/notify-expiring
export async function GET(request: Request) {
    // Verificar authorization header para segurança do cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!adminDb) {
        return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    try {
        // Buscar leads ativos (approved ou renewed)
        const snapshot = await adminDb.collection('leads')
            .where('status', 'in', ['approved', 'renewed'])
            .get();

        const alerts: string[] = [];
        const toDelete: string[] = [];
        const notified: { email: string; days: number; action: string }[] = [];

        for (const doc of snapshot.docs) {
            const lead = doc.data();
            const days = getDaysRemaining(lead.createdAt, lead.plan);

            // Remover vencidos há mais de 7 dias da aba de renovações
            if (days < -7) {
                toDelete.push(doc.id);
                continue;
            }

            // Alertas nos marcos: 7 dias antes, 1 dia antes, 1 dia depois, 7 dias depois
            const alertDays = [7, 1, -1, -7];
            if (alertDays.includes(days)) {
                let urgency = '';
                let emoji = '';

                if (days === 7) { urgency = 'Falta 1 SEMANA para vencer'; emoji = '⏰'; }
                else if (days === 1) { urgency = 'Vence AMANHÃ'; emoji = '🔴'; }
                else if (days === -1) { urgency = 'Venceu ONTEM'; emoji = '⚠️'; }
                else if (days === -7) { urgency = 'Venceu há 1 SEMANA'; emoji = '🚨'; }

                alerts.push(`${emoji} ${urgency}: ${lead.email} (${lead.plan})`);
                notified.push({ email: lead.email, days, action: urgency });
            }
        }

        // Enviar email consolidado ao admin se houver alertas
        if (alerts.length > 0) {
            const alertsHtml = alerts.map(a => `<li style="margin-bottom: 8px; font-size: 14px;">${a}</li>`).join('');

            await resend.emails.send({
                from: 'Sistema <sistema@redflixoficial.site>',
                to: [ADMIN_EMAIL],
                subject: `📋 ${alerts.length} assinatura(s) precisam de atenção`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px;">
                        <h2 style="color: #E50914; margin-bottom: 20px;">Alerta de Assinaturas</h2>
                        <ul style="list-style: none; padding: 0;">
                            ${alertsHtml}
                        </ul>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 11px; color: #999;">Cron automático DvnFlix • ${new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                `,
            });
        }

        // Marcar vencidos >7 dias como 'expired' (remove da aba renovações)
        for (const id of toDelete) {
            await adminDb.collection('leads').doc(id).update({ status: 'expired' });
        }

        return NextResponse.json({
            success: true,
            alertsSent: alerts.length,
            expiredMarked: toDelete.length,
            notified,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[NOTIFY-EXPIRING] Erro:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
