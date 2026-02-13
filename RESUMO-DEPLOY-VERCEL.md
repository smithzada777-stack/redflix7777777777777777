# 🚀 Resumo Rápido - Deploy Vercel

## ✅ Status: PRONTO PARA DEPLOY!

Todos os arquivos necessários estão configurados corretamente.

---

## 📋 O QUE VOCÊ PRECISA FAZER:

### 1️⃣ Criar Repositório no GitHub (5 minutos)
```bash
# No terminal, execute:
git add .
git commit -m "Preparando para deploy na Vercel"

# Depois, vá em: https://github.com/new
# Crie um repositório PRIVADO chamado "redflix"
# Copie os comandos que o GitHub mostrar e execute aqui
```

### 2️⃣ Conectar na Vercel (3 minutos)
1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em "Add New..." → "Project"
4. Importe o repositório "redflix"

### 3️⃣ Configurar Variáveis de Ambiente (10 minutos)
**IMPORTANTE:** Você precisa adicionar 12 variáveis de ambiente na Vercel.

Todas as variáveis estão listadas no arquivo `DEPLOY-VERCEL.md` com os valores corretos.

**Copie e cole cada uma na Vercel:**
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
- RESEND_API_KEY
- PUSHINPAY_TOKEN
- PUSHINPAY_WEBHOOK_TOKEN
- NEXT_PUBLIC_BASE_URL (use temporariamente: https://redflix.vercel.app)
- FIREBASE_SERVICE_ACCOUNT (JSON completo em uma linha)

### 4️⃣ Deploy! (2 minutos)
Clique em "Deploy" e aguarde!

### 5️⃣ Atualizar URL (2 minutos)
Depois do deploy:
1. Copie a URL real do projeto (ex: https://redflix-abc123.vercel.app)
2. Atualize a variável `NEXT_PUBLIC_BASE_URL` na Vercel
3. Faça um redeploy

### 6️⃣ Configurar Webhook PushinPay (3 minutos)
1. Acesse: https://pushinpay.com.br
2. Vá em Configurações → Webhooks
3. Adicione: `https://SUA-URL.vercel.app/api/webhooks/pushinpay`

---

## 📖 Guia Completo

Para instruções detalhadas passo a passo, abra o arquivo:
**`DEPLOY-VERCEL.md`**

---

## 🆘 Problemas?

### Build falhou?
- Verifique se TODAS as 12 variáveis foram adicionadas
- Confirme que o JSON do Firebase está correto (uma linha só)

### Site não abre?
- Aguarde 2-3 minutos após o deploy
- Limpe o cache do navegador (Ctrl + Shift + R)

### Pix não funciona?
- Confirme que o webhook foi configurado no PushinPay
- Verifique se a URL está correta

---

## ⏱️ Tempo Total Estimado: 25 minutos

**Boa sorte! 🚀**
