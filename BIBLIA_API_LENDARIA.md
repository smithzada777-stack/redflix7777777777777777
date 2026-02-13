# 🏆 A BÍBLIA DA API LENDÁRIA: O GUIA DEFINITIVO REDFLIX 🏆

Este documento é o manual mestre de arquitetura para qualquer projeto de vendas online. Ele detalha o segredo por trás do "Fluxo de Ouro": **Gerar Pix → Atualizar Banco → Detectar Pagamento → Mostrar Sucesso na Tela → Enviar E-mails**.

Siga estritamente esta arquitetura para garantir que o cliente veja a "Tela de Sucesso" no exato segundo em que pagar, seja no Checkout ou no Dashboard.

---

## 🏗️ 1. A ARQUITETURA DO BANCO DE DADOS (FIREBASE)
Sem um banco bem estruturado, você não tem como "ouvir" o pagamento em tempo real.

### Coleções Necessárias:
1.  **`payments` (O Rastreador)**: Cada Pix gerado é um documento aqui. O ID do documento DEVE ser o ID da Transação da API de Pix.
    *   Campos: `id`, `status` (pending), `value`, `created_at`.
2.  **`leads` (O Cliente)**: Onde ficam os dados de quem está comprando.
    *   Campos: `email`, `status`, `transactionId` (link com a coleção payments).

---

## 💳 2. PASSO A PASSO: GERANDO O PIX E ATUALIZANDO A TELA
Quando o seu código chama a API de Pix, ele não pode apenas mostrar o QR Code. Ele precisa preparar o terreno.

### O Fluxo no Backend (`/api/payment`):
1.  **Chama a API (PushinPay)** -> Recebe o ID da transação e o QR Code.
2.  **Grava no Firestore Imediatamente**: 
    ```javascript
    await db.collection('payments').doc(transactionId).set({ status: 'pending', ... });
    ```
3.  **Envia o E-mail de "Pedido Pendente"**: Isso garante que o cliente tenha o registro da compra.
4.  **Retorna para o Frontend**: Envia o ID da transação para que a tela saiba o que "monitorar".

---

## 📡 3. O SEGREDO DO "REAL-TIME": DETECTANDO O PAGAMENTO (FRONTEND)
Para a tela mudar sozinha (Checkout ou Dashboard) quando o cliente paga, você usa o `onSnapshot` do Firebase.

### Como Implementar o Monitoramento:
```javascript
// No seu componente React/Next.js:
useEffect(() => {
    if (!transactionId) return;

    // "Escuta" o documento específico desse pagamento
    const unsubscribe = onSnapshot(doc(db, "payments", transactionId), (snap) => {
        const data = snap.data();
        if (data && (data.status === 'paid' || data.status === 'approved')) {
            // A MÁGICA ACONTECE AQUI:
            setShowSuccessScreen(true); // Muda a tela para sucesso!
            confetti(); // Joga confetes (opcional, mas recomendado)
        }
    });

    return () => unsubscribe();
}, [transactionId]);
```

---

## 🪝 4. O WEBHOOK: O GATILHO QUE LIBERA TUDO
O Webhook é o sinal que vem do banco (PushinPay) avisando que o dinheiro caiu.

### O Passo a Passo do Webhook (`/api/webhook`):
1.  **Recebe o POST do banco**.
2.  **Identifica o ID**: `const id = body.id;`.
3.  **Atualiza o Status Global**:
    ```javascript
    // Isso é o que faz a tela do cliente mudar em 1 segundo:
    await db.collection('payments').doc(id).update({ status: 'paid' });
    ```
4.  **Localiza o Lead**: Busca quem é o dono desse ID e muda o status dele para `approved`.
5.  **Dispara o E-mail Final**: Chama a função de e-mail de "Acesso Liberado".

---

## 📧 5. A ESTRATÉGIA MESTRE DE E-MAILS (RESEND)
O e-mail é o seu seguro contra reembolsos e suporte lotado.

### Configuração de Sucesso:
*   **Pendente**: Deve chegar no segundo que o QR Code aparece na tela. Serve para o cliente pagar depois se a internet dele cair.
*   **Aprovado**: Deve chegar no momento do Webhook. Contém o botão de suporte com a mensagem que você já configurou para rastrear a origem.

### Design "Anti-Bugs":
*   Use fundos brancos no corpo (`#ffffff`).
*   NÃO use o nome do produto no assunto se for algo sensível; use termos como "Seu pedido RedFlix".
*   Sempre teste antes enviando para si mesmo para garantir que não caiu no aba "Promoções" ou "Spam".

---

## 🔧 6. CHECKLIST DE IMPLEMENTAÇÃO (RESUMO)

1.  [ ] **Firebase**: Cria a conta de serviço e libera permissões de leitura/escrita.
2.  [ ] **API Pix**: Configura o Token e testa a geração de um QR Code de R$ 1,00.
3.  [ ] **Frontend Pix**: Implementa o `onSnapshot` para que a tela de "Aguardando Pagamento" vire "Sucesso!" sozinha.
4.  [ ] **Webhook**: Garante que o endereço do Webhook está configurado corretamente na plataforma de pagamento (Ex: https://seu-site.com/api/webhook/pushinpay).
5.  [ ] **Resend**: Verifica o domínio, adiciona o **DMARC** no DNS e testa o envio com `await`.

---

---

## 🔐 7. PROTOCOLO DE SEGURANÇA DASHRED (ULTRA)
Para proteger sua operação de invasores e garantir que apenas VOCÊ tenha acesso ao Dash:

### A. IP Shield (Barreira de Origem)
O sistema foi configurado para reconhecer exclusivamente o seu IP. Se alguém tentar acessar de outro local, o sistema trava.
*   **Configuração**: No seu `.env.local` da Vercel, defina a variável `NEXT_PUBLIC_ALLOWED_IP` com o seu endereço IP atual.

### B. Firebase Auth (Blindagem de E-mail)
Substituímos a senha simples por uma autenticação real do Google Firebase. 
*   **Ação**: Você deve criar seu usuário admin no Console do Firebase (Authentication > Users). O Dashboard agora exige E-mail e Senha protegidos pelo backend do Google.

### C. Persistência de 7 Dias
A sessão foi estendida para durar **1 semana**. Se você não limpar os cookies, ficará logado mesmo atualizando a página. Após 7 dias, o sistema desloga automaticamente para garantir que sua conta não fique exposta para sempre.

---

## 🛑 O QUE PODE DAR ERRADO (NÃO FAÇA ISSO)
*   **NÃO esqueça de preencher o `NEXT_PUBLIC_ALLOWED_IP`**: Se seu IP mudar, você será bloqueado. Basta entrar na Vercel e atualizar a variável com o novo IP.
*   **NÃO ignore o AWAIT**: Na Vercel, o e-mail não chega se você não usar `await`.
*   **NÃO use fundos 100% pretos**: Gmail buga e inverte cores. Use branco no corpo.

---
**NOME DO PROTOCOLO**: `API LENDÁRIA v.3.0 - SECURITY REINFORCED`
**DESENVOLVEDOR**: ANTIGRAVITY
**PARA**: RedFlix VIP
