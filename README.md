# Mercadinho Dia Feliz 🛒

## 📝 Descrição
Mercadinho Dia Feliz é uma plataforma de e-commerce completa para mercados locais, oferecendo uma experiência de compra simples, intuitiva e moderna.

## 🚀 Funcionalidades
- 👤 Autenticação de usuários (cliente e admin)
- 🛍️ Catálogo de produtos
- 🏷️ Categorização de produtos
- 🛒 Carrinho de compras
- 📊 Painel administrativo
- 🔐 Gerenciamento de usuários

## 🛠️ Tecnologias Utilizadas
- **Backend**: Node.js, Express.js
- **Banco de Dados**: MongoDB Atlas
- **Frontend**: HTML5, Bootstrap 5, Vanilla JavaScript
- **Autenticação**: JWT (JSON Web Tokens)
- **Bibliotecas**: 
  * bcryptjs (hashing de senhas)
  * mongoose (ODM)
  * dotenv (gerenciamento de ambiente)

## 📦 Pré-requisitos
- Node.js (v14 ou superior)
- MongoDB Atlas
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/mercadinho-dia-feliz.git
cd mercadinho-dia-feliz
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
- Crie um arquivo `.env` na raiz do projeto
- Adicione suas configurações:
```
PORT=3000
MONGODB_URI=sua_uri_mongodb
JWT_SECRET=sua_chave_secreta
```

4. População inicial do banco de dados
```bash
npm run populate-db
```

5. Inicie o servidor
```bash
npm start
```

## 🔐 Credenciais de Teste
- **Admin**:
  - Email: admin@mercadinho.com
  - Senha: password123

- **Cliente**:
  - Email: cliente@mercadinho.com
  - Senha: password123

## 🌐 Rotas Principais
- `/`: Página inicial de vendas
- `/dashboard-admin.html`: Painel do administrador
- `/dashboard-cliente.html`: Painel do cliente

## 🤝 Contribuição
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato
Clairton Lima - [Seu LinkedIn ou Email]

## 🚧 Status do Projeto
🟢 Em desenvolvimento ativo
