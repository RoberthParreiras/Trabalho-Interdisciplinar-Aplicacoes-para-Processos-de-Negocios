# Aplicação Node.js com Prisma e MySQL

Este guia explica como configurar, instalar e executar esta aplicação na sua máquina local.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados na sua máquina:

* **Node.js** (v22 ou superior)

* **npm** (já vem com o Node.js)

* **Docker** e **Docker Compose** (para rodar o banco de dados MySQL localmente)

## 1. Configurando o Banco de Dados com Docker

Em vez de instalar o MySQL diretamente no seu computador, usamos o Docker para rodar um contêiner isolado de banco de dados.

**Para iniciar o banco de dados (docker-compose.yaml):**
Abra o terminal na raiz do projeto e execute:

```bash
docker compose up -d

```

*(A flag `-d` roda o contêiner em segundo plano, deixando o terminal livre).*

## 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do seu projeto. Este arquivo armazenará de forma segura a string de conexão com o seu banco de dados.

Copie o conteúdo abaixo para o seu arquivo `.env`, garantindo que as credenciais coincidam com as do seu `docker-compose.yml`:

```env
# Formato: mysql://USUARIO:SENHA@HOST:PORTA/BANCO_DE_DADOS
DATABASE_URL="mysql://db_user:db_password@localhost:3306/my_database"

```

## 3. Instalando as Dependências

Instale as dependências do projeto usando o npm. Como configuramos um script `postinstall` no `package.json`, este comando também irá gerar automaticamente o Prisma Client para o seu sistema operacional.

```bash
npm install

```

## 4. Sincronizando o Schema do Banco de Dados

Antes de rodar a aplicação, você precisa criar as tabelas no seu banco de dados MySQL vazio. O Prisma cuida disso automaticamente com base no arquivo `prisma/schema.prisma`.

Execute o seguinte comando para aplicar o schema no banco de dados:

```bash
npx prisma db push

```

*(Nota: Se você estiver usando ativamente arquivos de migração para manter o histórico estrutural, use `npx prisma migrate dev` no lugar deste comando).*

## 5. Rodando a Aplicação

Inicie o servidor de desenvolvimento local. A aplicação está configurada para rodar usando o modo watch (observação) nativo do Node.js e o carregador do arquivo `.env`.

```bash
npm start

```

*(Se você não tiver um script de start configurado, pode rodar diretamente: `node --env-file=.env --watch src/main.js`)*

Seu servidor agora deve estar rodando e conectado com sucesso ao seu banco de dados MySQL no Docker!

>**Dica de Produtividade: Gerenciando o Banco de Dados no VS Code**
> 
> Para facilitar a visualização e manipulação das tabelas do MySQL diretamente no seu editor de código, sem precisar instalar programas pesados como o > MySQL Workbench ou DBeaver, recomendamos instalar as seguintes extensões no **Visual Studio Code**:
> 
> 1. **Database Client**
> 2. **Database Client JDBC**
> 
> **Como usar:** Após a instalação, um ícone de banco de dados aparecerá na barra lateral esquerda do VS Code. Clique nele, crie uma nova conexão (selecione MySQL), insira as mesmas credenciais que você configurou no arquivo `.env` e clique em conectar. Você poderá ver as tabelas, editar dados e rodar queries (consultas) diretamente pelo VS Code!

## Comandos Úteis

* **Parar o banco de dados:** `docker compose down`

* **Regerar o Prisma Client:** `npx prisma generate` (Execute este comando sempre que você alterar seu arquivo `schema.prisma`)
