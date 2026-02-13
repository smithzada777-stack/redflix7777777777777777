# 🔐 Variáveis de Ambiente - Vercel

## ⚠️ IMPORTANTE:
As credenciais completas estão no arquivo `.env.local` local.
**NÃO compartilhe este arquivo publicamente!**

---

## 📋 Lista de Variáveis Necessárias (12 no total):

### Firebase Configuration (7 variáveis)
1. `NEXT_PUBLIC_FIREBASE_API_KEY`
2. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
3. `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
4. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
5. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
6. `NEXT_PUBLIC_FIREBASE_APP_ID`
7. `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### External APIs (3 variáveis)
8. `RESEND_API_KEY`
9. `PUSHINPAY_TOKEN`
10. `PUSHINPAY_WEBHOOK_TOKEN`

### Application Config (2 variáveis)
11. `NEXT_PUBLIC_BASE_URL` - URL do seu projeto na Vercel
12. `FIREBASE_SERVICE_ACCOUNT` - JSON completo do Firebase Admin SDK

---

## 📝 Como Adicionar na Vercel:

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione cada variável do arquivo `.env.local`
5. Marque: **Production**, **Preview** e **Development**
6. Clique em **Save**

---

## ⚠️ Atenção Especial:

### FIREBASE_SERVICE_ACCOUNT
- Deve ser o JSON completo em **UMA ÚNICA LINHA**
- Copie do arquivo `.env.local` local
- Mantenha as aspas simples no início e fim

### NEXT_PUBLIC_BASE_URL
- Após o primeiro deploy, atualize com a URL real da Vercel
- Exemplo: `https://seu-projeto.vercel.app`

---

## ✅ Checklist:
- [ ] 12 variáveis adicionadas
- [ ] Todas marcadas para Production, Preview e Development
- [ ] FIREBASE_SERVICE_ACCOUNT em uma linha só
- [ ] NEXT_PUBLIC_BASE_URL atualizada após deploy
