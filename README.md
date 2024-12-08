# 🛒 Mercadinho Dia Feliz

## Descrição do Projeto
Plataforma de e-commerce para mercado local, oferecendo uma experiência de compra online intuitiva e moderna.

## 🚀 Tecnologias Utilizadas
- **Frontend**: HTML5, Bootstrap 5, JavaScript
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT
- **ORM**: Sequelize

## 📦 Pré-requisitos
- Node.js (v14 ou superior)
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

### Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/mercadinho-dia-feliz.git
cd mercadinho-dia-feliz
```

### Configurar Backend
```bash
cd backend
cp .env.example .env
npm install
```

### Configurar Banco de Dados
1. Crie um banco de dados PostgreSQL chamado `mercadinho`
2. Atualize as credenciais no arquivo `.env`

### Iniciar Servidor
```bash
npm run dev  # Modo de desenvolvimento
npm start    # Modo produção
```

## 🔐 Variáveis de Ambiente
Configure no arquivo `.env`:
- `PORT`: Porta do servidor
- `DB_HOST`: Endereço do banco de dados
- `DB_NAME`: Nome do banco
- `DB_USER`: Usuário do banco
- `DB_PASS`: Senha do banco
- `JWT_SECRET`: Chave secreta para tokens

## 🌟 Funcionalidades
- Cadastro e Login de Usuários
- Catálogo de Produtos
- Carrinho de Compras
- Painel Administrativo

## 🤝 Contribuição
1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato
Clairton Lima - [Seu Email]

Feito com ❤️ para a comunidade de desenvolvimento
