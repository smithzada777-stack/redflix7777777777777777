import * as admin from 'firebase-admin';

// Função para tentar inicializar o Admin SDK
function initializeAdmin() {
    if (admin.apps.length > 0) return admin.app();

    try {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
        let credentials;

        // Fallback para arquivo local (útil para builds locais e debug)
        const fs = require('fs');
        const path = require('path');
        const localFile = path.join(process.cwd(), 'redflix-11f4d-firebase-adminsdk-fbsvc-4265a3a4ea.json');

        if (fs.existsSync(localFile)) {
            try {
                credentials = JSON.parse(fs.readFileSync(localFile, 'utf8'));
                console.log('[FIREBASE ADMIN] Inicializado via arquivo JSON local.');
            } catch (e) {
                console.error('[FIREBASE ADMIN] Erro ao ler arquivo JSON local:', e);
            }
        }

        // Se não achou no arquivo, tenta no ambiente
        if (!credentials && serviceAccount) {
            const tryParse = (str: string) => {
                try {
                    let parsed = JSON.parse(str);
                    if (typeof parsed === 'string') parsed = JSON.parse(parsed);
                    return parsed;
                } catch (e) {
                    return null;
                }
            };

            credentials = tryParse(serviceAccount);

            if (!credentials) {
                const flattened = serviceAccount.replace(/\n/g, '').replace(/\r/g, '').trim();
                credentials = tryParse(flattened);
            }

            if (!credentials) {
                let clean = serviceAccount.trim();
                if (clean.startsWith('"') && clean.endsWith('"')) clean = clean.slice(1, -1);
                if (clean.startsWith("'") && clean.endsWith("'")) clean = clean.slice(1, -1);
                credentials = tryParse(clean);
            }
        }

        // Se chegamos aqui e temos credenciais, validamos a private_key e inicializamos
        if (credentials) {
            if (credentials.private_key) {
                credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
                console.log('[FIREBASE ADMIN] Inicializando com sucesso.');
                return admin.initializeApp({
                    credential: admin.credential.cert(credentials)
                });
            } else {
                console.error('[FIREBASE ADMIN] Credenciais encontradas mas sem "private_key". Chaves:', Object.keys(credentials).join(', '));
            }
        } else {
            console.warn('[FIREBASE ADMIN] Nenhuma credencial encontrada (env ou arquivo).');
        }

        return null;

    } catch (error: any) {
        console.error('[FIREBASE ADMIN] Erro fatal:', error.message);
        return null;
    }
}

const app = initializeAdmin();

// Exporta o Firestore apenas se o app inicializou.
export const adminDb = app ? app.firestore() : null as any;
