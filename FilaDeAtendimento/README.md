# Fila de Atendimento — PostgreSQL + Redis, sem Docker

Sistema de filas com React + Node.js/Express + PostgreSQL + Redis.

## O que mudou nesta versão

- Não usa Docker.
- Não usa máquina virtual ou WSL.
- PostgreSQL continua sendo o banco permanente.
- Redis continua sendo usado para a fila de espera/cache.
- No Windows, o Redis pode ser fornecido pelo Memurai, que é compatível com a API Redis e pode rodar como serviço nativo do Windows.
- O backend cria/verifica as tabelas automaticamente ao iniciar.
- A API escuta em `0.0.0.0`, permitindo usar o sistema por outros PCs da rede.

## Requisitos

- Windows 10/11 64-bit
- Node.js 20+
- PostgreSQL instalado no Windows
- Redis compatível no Windows (Memurai é a opção recomendada para este projeto)

## 1. PostgreSQL

Instale o PostgreSQL e crie um banco chamado `fila_atendimento`.

No pgAdmin:

1. Servers → PostgreSQL → Databases.
2. Clique com o botão direito em Databases → Create → Database.
3. Nome: `fila_atendimento`.
4. Salve.

Não precisa executar `backend/sql/init.sql` manualmente: o backend faz isso ao iniciar.

## 2. Redis no Windows

O projeto espera Redis em `localhost:6379`.

No Windows, use um Redis compatível nativo, como Memurai, e deixe o serviço iniciado na porta 6379.

## 3. Configurar o backend

Abra `backend/.env` e ajuste principalmente:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=SUA_SENHA
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/fila_atendimento
REDIS_URL=redis://localhost:6379
JWT_SECRET=uma-chave-grande-e-aleatoria
HOST=0.0.0.0
PORT=3000
CLIENT_URL=http://localhost:5173
```

Se a senha do PostgreSQL tiver caracteres especiais, é melhor configurar a URL com esses caracteres devidamente codificados ou usar as variáveis de conexão separadas.

## 4. Instalar dependências

Backend:

```bat
cd backend
npm install
```

Frontend:

```bat
cd frontend
npm install
```

## 5. Iniciar

Backend:

```bat
cd backend
npm run dev
```

Frontend, em outro terminal:

```bat
cd frontend
npm run dev
```

Abra:

`http://localhost:5173`

Teste a API:

`http://localhost:3000/api/health`

O resultado esperado é parecido com:

```json
{"ok":true,"postgres":"ok","redis":"ok"}
```

## 6. Usar em vários PCs na mesma rede

O PC que executa PostgreSQL + Redis + backend será o servidor.

Descubra o IPv4 dele com:

```bat
ipconfig
```

Exemplo: `192.168.1.100`.

No `frontend/.env` dos PCs clientes:

```env
VITE_API_URL=http://192.168.1.100:3000/api
```

No `backend/.env` do servidor, adicione os endereços dos frontends em `CLIENT_URL`, separados por vírgula, ou use `*` durante o desenvolvimento.

Depois faça novamente:

```bat
npm run build
```

O frontend precisa ser servido pelo Vite ou por um servidor web. O PostgreSQL e o Redis não devem ser expostos diretamente aos computadores clientes; somente a API deve ser acessível pela rede.

## Importante

Para acesso pela internet, e não apenas pela rede local, será necessário hospedar a API e o PostgreSQL/Redis em um servidor acessível pela internet e configurar HTTPS. Esta versão já deixa o backend preparado para receber conexões de outros computadores, mas `localhost` só funciona no próprio PC.
