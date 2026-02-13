# 🚀 Guia de Deploy - Vercel

## ✅ Pré-requisitos
- Repositório GitHub: https://github.com/smithzada777-stack/redflix7777777777777777
- Conta Vercel conectada ao GitHub
- Deploy automático já configurado

---

## 🔐 Configurar Variáveis de Ambiente

### Passo 1: Acessar Configurações
1. Vá para: https://vercel.com/dashboard
2. Selecione o projeto **redflix7777777777777777**
3. Clique em **Settings**
4. Vá em **Environment Variables**

### Passo 2: Adicionar Variáveis
Abra o arquivo **`VERCEL-ENV-VARS.txt`** (local, não está no Git)

Para cada linha do arquivo:
1. Copie o nome da variável (antes do `=`)
2. Copie o valor (depois do `=`)
3. Cole na Vercel
4. Marque: ✅ Production ✅ Preview ✅ Development
5. Clique em **Add**

**Total: 12 variáveis**

### Passo 3: Verificar
Confirme que todas as variáveis foram adicionadas:
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
- NEXT_PUBLIC_BASE_URL
- FIREBASE_SERVICE_ACCOUNT

---

## 🚀 Deploy

### Automático
Qualquer push para `main` faz deploy automaticamente!

```bash
git add .
git commit -m "Suas alterações"
git push
```

### Manual
1. Vá em **Deployments**
2. Clique em **...** (três pontos)
3. Selecione **Redeploy**

---

## 🔗 Configurar Webhook PushinPay

Após o primeiro deploy:

1. Copie a URL do projeto (ex: `https://redflix7777777777777777.vercel.app`)
2. Acesse: https://pushinpay.com.br
3. Vá em **Configurações** → **Webhooks**
4. Adicione: `https://SUA-URL.vercel.app/api/webhooks/pushinpay`
5. Marque eventos: `payment.approved`, `payment.cancelled`, `payment.refunded`

---

## 🧪 Testar

- [ ] Site abre corretamente
- [ ] Checkout funciona
- [ ] Geração de Pix funciona
- [ ] Dashboard admin acessível
- [ ] Emails sendo enviados

---

## 🆘 Problemas?

### Build falhou
- Verifique se todas as 12 variáveis foram adicionadas
- Confirme que `FIREBASE_SERVICE_ACCOUNT` está em uma linha só
- Veja os logs: **Deployments** → **[seu deploy]** → **Logs**

### Erro 500
- Verifique os logs das Functions
- Confirme que todas as APIs estão ativas

---

## 📝 Comandos Úteis

```bash
# Ver status do Git
git status

# Fazer novo deploy
git add .
git commit -m "Descrição"
git push

# Ver remote configurado
git remote -v
```

---

**Pronto! Seu projeto está configurado para deploy automático! 🎉**
