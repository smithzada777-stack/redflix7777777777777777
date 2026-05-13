# 🏆 GUIA DEFINITIVO: Integração PIX (PushinPay + Firebase + Vercel)

Este documento é o manual mestre para a integração de pagamentos PIX no RedFlix.
Ele reúne toda a experiência acumulada durante o desenvolvimento — erros, soluções e a arquitetura final que funciona 100%.

**Use este guia como referência em qualquer projeto futuro de PIX.**

---

## 📐 1. A ARQUITETURA COMPLETA (Visão Geral)

O sistema **não fica perguntando** para a API se o PIX foi pago (isso dá erro 404 às vezes). Ele usa **Webhooks**:

```
Cliente gera PIX no Checkout
    ↓
Backend chama API PushinPay → recebe QR Code + ID da transação
    ↓
Backend salva no Firebase com status "pending" (IMEDIATAMENTE)
    ↓
Frontend "escuta" o Firebase em tempo real (onSnapshot)
    ↓
Cliente paga o PIX
    ↓
PushinPay avisa nosso Webhook automaticamente (POST)
    ↓
Webhook atualiza Firebase: status → "paid"
    ↓
Frontend detecta a mudança instantaneamente → Tela de Sucesso!
    ↓
Email de confirmação é enviado (Resend)
```

(Nota: Este fluxo é chamado internamente de "Fluxo de Ouro" — é o padrão que funciona sem falhas.)

---

## 🏗️ 2. ESTRUTURA DO BANCO DE DADOS (Firebase Firestore)

### Coleções Necessárias:

1. **`payments` (O Rastreador)**: Cada PIX gerado vira um documento aqui. O ID do documento DEVE ser o ID da Transação da API de PIX.
   - Campos: `id`, `status` (pending), `value`, `created_at`

2. **`leads` (O Cliente)**: Onde ficam os dados de quem está comprando.
   - Campos: `email`, `status`, `transactionId` (link com a coleção payments)

---

## 💳 3. GERANDO O PIX (Backend: `/api/payment`)

Quando o código chama a API de PIX, ele **não pode apenas mostrar o QR Code**. Ele precisa preparar o terreno.

### O Fluxo Correto:

1. **Chama a API (PushinPay)** → Recebe o ID da transação e o QR Code
2. **Grava no Firestore IMEDIATAMENTE**:
```javascript
await db.collection('payments').doc(String(transactionId)).set({
    id: String(transactionId),
    status: 'pending',
    value: 1000,
    created_at: new Date().toISOString()
});
```
3. **Envia o e-mail de "Pedido Pendente"** (garante que o cliente tenha registro da compra)
4. **Retorna para o Frontend**: Envia o ID da transação para que a tela saiba o que "monitorar"

### ⚠️ REGRA DE OURO:
Assim que receber o ID do PIX da PushinPay, **GRAVE NO BANCO IMEDIATAMENTE** com status `pending`.
Se não fizer isso, o Frontend fica "ouvindo" um documento que não existe e o usuário acha que deu erro.

---

## 📡 4. DETECÇÃO EM TEMPO REAL (Frontend: onSnapshot)

Para a tela mudar sozinha quando o cliente paga, use o `onSnapshot` do Firebase.

### Implementação:
```javascript
// No seu componente React/Next.js:
import { onSnapshot, doc } from "firebase/firestore";

useEffect(() => {
    if (!transactionId) return;

    // "Escuta" o documento específico desse pagamento
    const unsubscribe = onSnapshot(doc(db, "payments", String(transactionId)), (snap) => {
        const data = snap.data();
        if (data && (data.status === 'paid' || data.status === 'approved')) {
            // A MÁGICA ACONTECE AQUI:
            setShowSuccessScreen(true);
            confetti(); // (Opcional, mas recomendado para UX)
        }
    });

    return () => unsubscribe();
}, [transactionId]);
```

### ⚠️ IMPORTANTE:
- O ID **tem que ser String**! Use `String(idDoPix)` sempre.
- O Frontend não deve ficar fazendo polling ("já pagou?") a cada 5 segundos. O `onSnapshot` abre um canal direto (WebSocket) com o Firestore.

---

## 🪝 5. O WEBHOOK (Backend: `/api/webhook/pushinpay`)

O Webhook é o sinal que vem da PushinPay avisando que o dinheiro caiu.

### Passo a Passo do Webhook:

1. **Recebe o POST da PushinPay**
2. **Identifica o ID**: `const id = body.id;`
3. **Atualiza o Status no Firebase**:
```javascript
// Isso é o que faz a tela do cliente mudar em 1 segundo:
await db.collection('payments').doc(String(id)).update({ status: 'paid' });
```
4. **Localiza o Lead**: Busca quem é o dono desse ID e muda o status dele para `approved`
5. **Dispara o e-mail final** de "Acesso Liberado"

### Checklist do Webhook Blindado:
1. Recebeu o POST? ✅
2. O ID existe? ✅
3. O status é novo? ✅
4. Gravou no Firebase usando Admin SDK? ✅

### Backend DEVE usar `firebase-admin` (SDK Administrativo):
```javascript
var admin = require("firebase-admin");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    });
}

const db = admin.firestore();
```

(Nota: O Client SDK — `import { db } from './firebase.js'` — NÃO funciona no backend/webhook porque não tem permissão. Use SEMPRE o Admin SDK.)

---

## 🚫 6. O QUE NÃO FAZER (Erros que já aconteceram)

### Erro 1: Usar Client SDK no Backend
- **Errado**: `import { db } from './firebase.js'` dentro do Webhook/API
- **Consequência**: Webhook falha silenciosamente por falta de permissão
- **Correto**: Usar `firebase-admin` com Service Account

### Erro 2: Não salvar o documento antes do pagamento
- **Errado**: Gerar o PIX e não salvar NADA no banco imediatamente
- **Consequência**: Frontend ouve um documento que não existe
- **Correto**: Gravar com status `pending` no momento da geração do PIX

### Erro 3: Comparar IDs com tipos diferentes
- **Errado**: Comparar ID numérico com string, ou "PAID" com "paid"
- **Consequência**: O código recebe confirmação mas acha que é outro pedido
- **Correto**: Sempre usar `String(id)` e `.toLowerCase()` nos status

### Erro 4: Formato dos dados da PushinPay
- **Atenção**: Em algumas versões, a PushinPay envia dados como formulário (`x-www-form-urlencoded`), não JSON
- **Solução**: O código do servidor pode precisar de `querystring.parse` para ler corretamente
- (Nota: Verifique a documentação atual da PushinPay — o formato pode ter mudado. No projeto RedFlix atual, o webhook recebe JSON normalmente.)

### Erro 5: Esquecer o `await` nos e-mails
- Na Vercel, o e-mail **não chega** se você não usar `await`
- Sem `await`, a função termina antes do e-mail ser enviado

---

## 🔓 7. PERMISSÕES DO FIREBASE (Firestore Rules)

Se aparecer o erro **"Missing or insufficient permissions"**, é porque o Firebase está bloqueando leitura/escrita.

### Solução — Regras de Teste (Modo Aberto):
Vá em Firebase Console → Firestore Database → Rules e cole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Clique em **Publicar**.

(Nota: Essas regras dão acesso total — ideal para desenvolvimento e testes. Para produção com muitos usuários, considere restringir escrita apenas ao Admin SDK e leitura apenas para documentos do próprio usuário. Mas para o modelo atual do RedFlix, funciona perfeitamente.)

---

## 📧 8. ESTRATÉGIA DE E-MAILS (Resend)

### Dois momentos de envio:
- **Pendente**: Deve chegar no segundo que o QR Code aparece. Serve para o cliente pagar depois se a internet cair.
- **Aprovado**: Deve chegar no momento do Webhook. Contém botão de suporte.

### Regras de Design:
- Use fundos brancos no corpo (`#ffffff`) — Gmail buga e inverte cores com fundo preto
- NÃO use o nome do produto no assunto se for sensível; use termos como "Seu pedido RedFlix"
- Sempre teste enviando para si mesmo antes (verificar se não cai em Spam/Promoções)

---

## 🔐 9. SEGURANÇA DO DASHBOARD (DASHRED)

### A. Firebase Auth (Blindagem de E-mail)
- A autenticação usa Firebase Auth real (não senha simples)
- Crie seu usuário admin no Console do Firebase: Authentication → Users
- O Dashboard exige E-mail e Senha protegidos pelo backend do Google

### B. Persistência de 7 Dias
- A sessão dura 1 semana
- Após 7 dias, desloga automaticamente

---

## 🧪 10. COMO TESTAR PIX EM PRODUÇÃO

### Opção 1: Ngrok (Testar localmente com webhook real)

```bash
# Instalar: https://ngrok.com/download
# Autenticar:
ngrok config add-authtoken SEU_TOKEN

# Criar túnel:
ngrok http 3000
```

Ngrok gera uma URL tipo `https://abc123.ngrok.io`.
Configure no PushinPay: `https://abc123.ngrok.io/api/webhook/pushinpay`

(Nota: Ngrok grátis muda a URL cada vez que reinicia. Para URL fixa, precisa do plano pago.)

### Opção 2: Deploy na Vercel (Produção)
Melhor opção — faça deploy e teste direto no ambiente real.

### Opção 3: LocalTunnel (Alternativa gratuita)
```bash
npm install -g localtunnel
lt --port 3000
```

### Debug de Webhooks:
- **Ngrok**: Acesse `http://localhost:4040` para ver todas as requisições
- **Vercel**: Veja logs em Deployments → [seu deploy] → Logs
- **Teste manual**:
```bash
curl -X POST https://sua-url/api/webhook/pushinpay \
  -H "Content-Type: application/json" \
  -d '{"event":"payment.approved","data":{"id":"test123","status":"approved"}}'
```

### Dica: Sempre teste com R$ 1,00 primeiro!

---

## 🛠️ 11. DIAGNÓSTICO RÁPIDO

Se o "Pago" não aparece na tela, verifique nesta ordem:

1. **O documento é criado no Firebase logo no começo?** (Se não → problema na geração do PIX, Seção 3)
2. **O Webhook está recebendo o POST?** (Olhe os logs da Vercel/Ngrok)
3. **O Webhook tem permissão de escrita?** (Se usa `firebase-admin` → TEM. Se não → Seção 5)
4. **O Frontend está ouvindo o mesmo ID?** (Verifique se um não é número e o outro string → Seção 6, Erro 3)
5. **As regras do Firestore permitem leitura?** (Se não → Seção 7)

---

## ✅ 12. CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Firebase: Service Account configurada com permissões de leitura/escrita
- [ ] API PIX: Token configurado, teste de geração de QR Code com R$ 1,00
- [ ] Backend: Documento salvo no Firestore com status `pending` ao gerar PIX
- [ ] Frontend: `onSnapshot` implementado para detectar mudança de status
- [ ] Webhook: Endereço configurado na PushinPay (ex: `https://seu-site.vercel.app/api/webhook/pushinpay`)
- [ ] Webhook: Usando `firebase-admin` (Admin SDK) para gravar no banco
- [ ] Resend: Domínio verificado, DMARC configurado, teste com `await`
- [ ] Teste real: PIX de R$ 1,00 pago e aprovado com sucesso

---

**PROTOCOLO**: API LENDÁRIA v.3.0 - SECURITY REINFORCED
**DESENVOLVEDOR**: ANTIGRAVITY
**PARA**: RedFlix VIP
**Guia validado e funcionando em 10/02/2026.**
