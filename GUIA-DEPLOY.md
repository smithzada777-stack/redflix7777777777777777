# 🚀 Guia Completo de Deploy - RedFlix (Vercel)

Este é o guia único para deploy e manutenção do projeto RedFlix na Vercel.

---

## 📤 FASE 1: Enviar Código para o GitHub

### Criar repositório (se ainda não existe)
1. Acesse: https://github.com/new
2. Nome do repositório (ex: `redflix`)
3. Marque como **PRIVADO**
4. **NÃO** inicialize com README/gitignore
5. Clique em **Create repository**

### Comandos Git
```bash
git add .
git commit -m "Preparando para deploy na Vercel"

# Se o remote não existe ainda:
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git

# Se já existe mas quer mudar:
git remote set-url origin https://github.com/SEU-USUARIO/SEU-REPO.git

git push -u origin main
```

### Para futuros deploys (após alterações)
```bash
git add .
git commit -m "Descrição das alterações"
git push
# A Vercel faz deploy automaticamente!
```

(Nota: Sempre verifique com `git status` antes do push para não subir arquivos sensíveis. O `.gitignore` já protege `.env*` e Service Accounts.)

---

## 🌐 FASE 2: Configurar na Vercel

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **Add New...** → **Project**
4. Encontre e importe o repositório
5. Clique em **Deploy**
6. Aguarde o build (2-5 minutos)

---

## 🔐 FASE 3: Variáveis de Ambiente

Vá em **Settings** → **Environment Variables**.
Marque **Production**, **Preview** e **Development** para todas.

### Firebase (7 variáveis)

| Variável | Onde pegar |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → ⚙️ Project Settings → Your apps → Web app |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Mesmo lugar |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Mesmo lugar |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Mesmo lugar |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Mesmo lugar |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Mesmo lugar |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Mesmo lugar |

### APIs Externas (2 variáveis)

| Variável | Onde pegar |
|---|---|
| `RESEND_API_KEY` | https://resend.com/api-keys |
| `PUSHINPAY_TOKEN` | https://pushinpay.com.br/dashboard → Configurações → API |

### Configuração (2 variáveis)

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | URL do seu projeto (ex: `https://redflixoficial.site`) |
| `FIREBASE_SERVICE_ACCOUNT` | JSON completo da Service Account (ver Fase 4) |

**Total: 12 variáveis** (11 obrigatórias + MEASUREMENT_ID opcional)

---

## 🔐 FASE 4: Firebase Service Account (CRÍTICO)

**Sem isso o webhook NÃO funciona!**

### Como gerar:
1. Acesse: https://console.firebase.google.com
2. Selecione o projeto RedFlix
3. ⚙️ → **Project settings** → aba **Service accounts**
4. Clique em **Generate new private key** → Confirme
5. Um arquivo JSON será baixado

### Como configurar na Vercel:
1. Abra o JSON baixado no Notepad
2. Selecione **TODO** o conteúdo (Ctrl+A → Ctrl+C)
3. Na Vercel → Settings → Environment Variables
4. Nome: `FIREBASE_SERVICE_ACCOUNT`
5. Valor: Cole **TODO o JSON** (incluindo as chaves `{}`)
6. O JSON deve ficar em **uma única linha**
7. Salve e faça **Redeploy**

### Segurança:
- ✅ Nunca commite esse JSON no GitHub
- ✅ Use apenas variáveis de ambiente
- ✅ Se a chave vazar: Firebase → Service accounts → Manage → Delete → Gere uma nova

(Nota: O `.gitignore` do projeto já protege qualquer arquivo `*firebase*adminsdk*.json`. Mas cuidado extra nunca é demais.)

---

## 🔗 FASE 5: Configurar Webhook PushinPay

1. Acesse: https://pushinpay.com.br
2. Vá em **Configurações** → **Webhooks**
3. Adicione a URL: `https://SUA-URL.vercel.app/api/webhook/pushinpay`
4. Marque eventos: `payment.approved`, `payment.cancelled`, `payment.refunded`
5. Salve

(Nota: A URL deve apontar exatamente para `/api/webhook/pushinpay` — com o "s" em webhooks ou sem, depende de como a rota foi criada no projeto. Verifique a pasta `src/app/api/webhook/`.)

---

## 🔄 FASE 6: Atualizar URL Base (após primeiro deploy)

1. Copie a URL real do projeto na Vercel
2. Vá em Settings → Environment Variables
3. Edite `NEXT_PUBLIC_BASE_URL` com a URL real
4. Faça Redeploy: Deployments → ... → Redeploy

---

## 🧪 Testes Finais

- [ ] Site abre corretamente pela URL da Vercel
- [ ] Checkout funciona e gera QR Code PIX
- [ ] Dashboard admin está acessível (`/dashred`)
- [ ] PIX de R$ 1,00 pago → Redireciona para tela de sucesso
- [ ] Firebase atualizado (verificar no console)
- [ ] Email de confirmação recebido
- [ ] Logs da Vercel sem erros críticos

---

## 🆘 Problemas Comuns

### Build falhou
- Verifique se **todas** as 12 variáveis foram adicionadas
- Confirme que `FIREBASE_SERVICE_ACCOUNT` está em **uma linha só**
- Veja os logs: Deployments → [seu deploy] → Logs
- Teste localmente: `npm run build`

### Webhook não funciona
- Confirme `FIREBASE_SERVICE_ACCOUNT` está configurada
- Verifique a URL do webhook na PushinPay
- Veja os logs das Functions na Vercel

### Erro 500
- Verifique logs das Functions
- Confirme que todas as APIs estão ativas

### Variáveis não funcionam
- Variáveis com `NEXT_PUBLIC_` são acessíveis no frontend
- Variáveis SEM `NEXT_PUBLIC_` são apenas backend (APIs, webhooks)
- **Sempre faça redeploy** após alterar variáveis

---

## ✅ Checklist Completo

- [ ] Código no GitHub (repositório privado)
- [ ] Vercel conectada ao repositório
- [ ] 12 variáveis de ambiente adicionadas
- [ ] Firebase Service Account configurada (JSON em uma linha)
- [ ] NEXT_PUBLIC_BASE_URL atualizada com URL real
- [ ] Webhook configurado na PushinPay
- [ ] Deploy com sucesso (sem erros de build)
- [ ] Teste de pagamento PIX R$ 1,00 realizado
- [ ] Tudo funcionando! 🎉

---

**Repositório**: https://github.com/smithzada777-stack/redflix7777777777777777
**Deploy**: https://redflixoficial.site
**Plataforma**: Vercel
