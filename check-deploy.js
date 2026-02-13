const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando preparação para deploy na Vercel...\n');

const checks = {
    '✅ Arquivo package.json existe': fs.existsSync('package.json'),
    '✅ Arquivo .gitignore existe': fs.existsSync('.gitignore'),
    '✅ Arquivo .env.local existe': fs.existsSync('.env.local'),
    '✅ Pasta node_modules existe': fs.existsSync('node_modules'),
    '✅ Pasta .next existe (build local)': fs.existsSync('.next'),
    '✅ Pasta src existe': fs.existsSync('src'),
    '⚠️  Arquivo Firebase Admin NÃO deve estar no Git': !fs.existsSync('.git') || checkGitIgnore(),
};

function checkGitIgnore() {
    try {
        const gitignore = fs.readFileSync('.gitignore', 'utf8');
        return gitignore.includes('*firebase*adminsdk*.json');
    } catch {
        return false;
    }
}

let allGood = true;
for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${check.replace(/^[✅⚠️❌]\s*/, '')}`);
    if (!passed && !check.includes('⚠️')) allGood = false;
}

console.log('\n📋 Variáveis de ambiente necessárias:');
const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
    'RESEND_API_KEY',
    'PUSHINPAY_TOKEN',
    'PUSHINPAY_WEBHOOK_TOKEN',
    'NEXT_PUBLIC_BASE_URL',
    'FIREBASE_SERVICE_ACCOUNT',
];

if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    requiredEnvVars.forEach(varName => {
        const hasVar = envContent.includes(varName);
        console.log(`${hasVar ? '✅' : '❌'} ${varName}`);
    });
} else {
    console.log('❌ Arquivo .env.local não encontrado!');
}

console.log('\n📝 Próximos passos:');
console.log('1. Criar repositório no GitHub');
console.log('2. Fazer commit e push do código');
console.log('3. Importar projeto na Vercel');
console.log('4. Configurar variáveis de ambiente na Vercel');
console.log('5. Fazer deploy!');

console.log('\n📖 Leia o arquivo DEPLOY-VERCEL.md para instruções detalhadas.');

if (allGood) {
    console.log('\n✅ Tudo pronto para o deploy! 🚀');
} else {
    console.log('\n⚠️  Alguns itens precisam de atenção antes do deploy.');
}
