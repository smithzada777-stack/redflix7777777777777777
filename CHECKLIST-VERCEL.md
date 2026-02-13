# ✅ Checklist de Deploy - RedFlix na Vercel

Marque cada item conforme for completando!

---

## 📦 FASE 1: Preparar Repositório GitHub

- [ ] Acessei https://github.com/new
- [ ] Criei repositório chamado "redflix"
- [ ] Marquei como PRIVADO
- [ ] NÃO inicializei com README/gitignore
- [ ] Cliquei em "Create repository"
- [ ] Copiei a URL do repositório

---

## 💻 FASE 2: Enviar Código para GitHub

- [ ] Abri o terminal na pasta do projeto
- [ ] Executei: `git add .`
- [ ] Executei: `git commit -m "Preparando para deploy na Vercel"`
- [ ] Executei: `git remote add origin https://github.com/MEU-USUARIO/redflix.git`
  - (ou `git remote set-url origin ...` se já existia)
- [ ] Executei: `git push -u origin main`
- [ ] Verifiquei que o código apareceu no GitHub

---

## 🌐 FASE 3: Configurar Vercel

- [ ] Acessei https://vercel.com
- [ ] Fiz login com GitHub
- [ ] Cliquei em "Add New..." → "Project"
- [ ] Encontrei o repositório "redflix"
- [ ] Cliquei em "Import"

---

## 🔐 FASE 4: Variáveis de Ambiente (12 no total)

### Firebase (7 variáveis)
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- [ ] NEXT_PUBLIC_FIREBASE_APP_ID
- [ ] NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

### APIs Externas (3 variáveis)
- [ ] RESEND_API_KEY
- [ ] PUSHINPAY_TOKEN
- [ ] PUSHINPAY_WEBHOOK_TOKEN

### Configuração (2 variáveis)
- [ ] NEXT_PUBLIC_BASE_URL (temporário: https://redflix.vercel.app)
- [ ] FIREBASE_SERVICE_ACCOUNT (JSON completo em UMA linha)

### Verificação
- [ ] Marquei Production, Preview e Development para TODAS
- [ ] Revisei que todas as 12 variáveis foram adicionadas

---

## 🚀 FASE 5: Deploy Inicial

- [ ] Cliquei em "Deploy"
- [ ] Aguardei o build (2-5 minutos)
- [ ] Vi a mensagem "Congratulations!" 🎉
- [ ] Copiei a URL do projeto (ex: https://redflix-abc123.vercel.app)
- [ ] Testei abrindo a URL no navegador

---

## 🔄 FASE 6: Atualizar URL Base

- [ ] Fui em Settings → Environment Variables na Vercel
- [ ] Encontrei NEXT_PUBLIC_BASE_URL
- [ ] Cliquei em "Edit"
- [ ] Colei a URL REAL do projeto
- [ ] Salvei
- [ ] Fui em Deployments → ... → Redeploy
- [ ] Aguardei o novo deploy

---

## 🔗 FASE 7: Configurar Webhook PushinPay

- [ ] Acessei https://pushinpay.com.br
- [ ] Fiz login
- [ ] Fui em Configurações → Webhooks
- [ ] Adicionei a URL: https://MINHA-URL.vercel.app/api/webhooks/pushinpay
- [ ] Marquei eventos: payment.approved, payment.cancelled, payment.refunded
- [ ] Salvei

---

## 🧪 FASE 8: Testes Finais

- [ ] Página inicial carrega corretamente
- [ ] Checkout abre sem erros
- [ ] Consigo gerar um código Pix de teste
- [ ] Dashboard admin está acessível
- [ ] Testei envio de email (se possível)
- [ ] Verifiquei os logs na Vercel (sem erros críticos)

---

## 🎉 CONCLUSÃO

- [ ] Projeto está no ar e funcionando!
- [ ] Salvei a URL do projeto: ___________________________
- [ ] Salvei o link do GitHub: ___________________________
- [ ] Salvei o link do dashboard Vercel: https://vercel.com/dashboard

---

## 📝 Anotações / Problemas Encontrados:

_____________________________________________________________________

_____________________________________________________________________

_____________________________________________________________________

_____________________________________________________________________

---

## 🆘 Se algo deu errado:

1. Verifique os logs na Vercel (Deployments → [seu deploy] → Logs)
2. Confirme que TODAS as 12 variáveis estão configuradas
3. Teste localmente com `npm run dev`
4. Leia o arquivo DEPLOY-VERCEL.md para mais detalhes

---

**Data do deploy:** ___/___/______
**Tempo total gasto:** _______ minutos
**Status final:** ⭐⭐⭐⭐⭐
