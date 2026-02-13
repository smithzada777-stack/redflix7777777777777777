# 🎯 Comandos Git - Execute na Ordem

## ⚠️ ANTES DE COMEÇAR:
1. Crie um repositório no GitHub: https://github.com/new
2. Nome sugerido: `redflix`
3. Deixe como PRIVADO
4. NÃO inicialize com README, .gitignore ou licença
5. Clique em "Create repository"

---

## 📝 Comandos para executar no terminal:

### 1. Adicionar todos os arquivos
```bash
git add .
```

### 2. Fazer commit
```bash
git commit -m "Preparando projeto RedFlix para deploy na Vercel"
```

### 3. Verificar se o remote já existe
```bash
git remote -v
```

**Se aparecer "origin", pule para o passo 5.**
**Se NÃO aparecer nada, execute o passo 4.**

### 4. Adicionar o remote (SUBSTITUA SEU-USUARIO pelo seu username do GitHub)
```bash
git remote add origin https://github.com/SEU-USUARIO/redflix.git
```

**OU se você já tem o remote mas quer mudar:**
```bash
git remote set-url origin https://github.com/SEU-USUARIO/redflix.git
```

### 5. Fazer push para o GitHub
```bash
git push -u origin main
```

**Se der erro de autenticação:**
- Use um Personal Access Token do GitHub
- Ou configure SSH keys
- Tutorial: https://docs.github.com/pt/authentication

---

## ✅ Depois do Push:

1. Verifique se o código apareceu no GitHub
2. Vá para: https://vercel.com
3. Faça login com GitHub
4. Importe o projeto
5. Configure as variáveis de ambiente (veja DEPLOY-VERCEL.md)
6. Deploy! 🚀

---

## 🔄 Para futuros deploys (após alterações):

```bash
git add .
git commit -m "Descrição das alterações"
git push
```

A Vercel vai fazer deploy automaticamente! ✨
