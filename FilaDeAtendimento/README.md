# Fila de Atendimento

Aplicação web simples para organizar atendimentos por ordem de chegada. O **coordenador** cria uma fila e compartilha o código; o **aluno** informa nome e código para receber uma senha e acompanhar a chamada.

## Funcionalidades

- Cadastro e login do coordenador.
- Criar, selecionar e excluir as próprias filas.
- Entrar em uma fila pelo código gerado.
- Visualizar senhas em espera e atendimento atual, com atualização periódica.
- Chamar a próxima pessoa, finalizar ou pular o atendimento atual.
- Acompanhar a posição e o status da senha pelo navegador.

O layout foi preservado do projeto original.

## Tecnologias

- **Frontend:** React, Vite e CSS.
- **Backend:** Node.js e Express.
- **Banco de dados:** PostgreSQL (dados persistentes).
- **Fila auxiliar:** Redis ou servidor compatível, como Memurai no Windows.

## Como executar localmente

**Pré-requisitos:** Node.js 20 ou superior, PostgreSQL e Redis (porta padrão `6379`). Não é necessário Docker.

1. Crie no PostgreSQL um banco vazio chamado `fila_atendimento`. As tabelas são criadas automaticamente quando a API inicia.
2. Dentro de `backend`, copie `.env.example` para `.env`. Edite `DATABASE_URL` com a senha correta do PostgreSQL e substitua `JWT_SECRET` por uma chave longa e aleatória. Verifique que o Redis está em execução.
3. Instale as dependências e inicie a API:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. Em outro terminal, inicie a interface:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Acesse **http://localhost:5173** no navegador. Para verificar os serviços da API, abra **http://localhost:3000/api/health**: o retorno deve indicar `postgres: "ok"` e `redis: "ok"`.

Por padrão, o frontend acessa a API em `http://localhost:3000/api`. Para usar outro endereço, copie `frontend/.env.example` para `frontend/.env` e ajuste `VITE_API_URL`.

## Como testar o fluxo

1. Acesse **Coordenador** e cadastre uma conta.
2. Crie uma fila e copie o código mostrado na tela.
3. Em outra aba ou navegador, entre em **Aluno**, informe nome e código e receba sua senha.
4. Na tela do coordenador, clique em **Chamar o próximo**.
5. Finalize ou pule a senha atual. Na tela do aluno, observe a atualização do status.

## Comandos úteis

No diretório `frontend`, `npm run build` gera a versão de produção em `dist/` e `npm run lint` analisa o código. No diretório `backend`, `npm start` inicia a API sem modo de observação.

## Configuração em rede

Por segurança, o exemplo configura a API para `127.0.0.1`. Para acessar de outros computadores da rede local, configure `HOST=0.0.0.0` no `backend/.env`, ajuste `CLIENT_URL` para a origem do frontend e use o IP do servidor em `VITE_API_URL`. Exponha apenas a API e não abra PostgreSQL ou Redis diretamente para os clientes.

A publicação do código no GitHub **não hospeda automaticamente** a API, o PostgreSQL ou o Redis. Para usar na internet, é preciso hospedar esses serviços separadamente e configurar HTTPS.

## Organização

```text
backend/
  sql/init.sql              # estrutura do banco
  src/config/               # conexões e inicialização
  src/routes/               # autenticação, filas e senhas
  src/services/             # sincronização das filas
frontend/
  src/pages/                # telas do coordenador e aluno
  src/App.css               # visual original preservado
  src/api.js                # comunicação com a API
```

## Segurança

Nunca envie os arquivos `.env` ou senhas para o GitHub. O `.gitignore` já exclui esses arquivos e pastas de dependências. Os arquivos `.env.example` servem apenas como modelos de configuração.
