# SGB Magaiver — Frontend

Interface web do sistema **SGB Magaiver**, construída com **React**, **Vite** e **Tailwind CSS**, com foco em usabilidade mobile-first e integração com a API REST do projeto.

## Tecnologias Utilizadas

- **React** — Biblioteca para construção da interface
- **Vite** — Bundler e servidor de desenvolvimento (`vite.config.js`)
- **Tailwind CSS** & **PostCSS** — Estilização (`tailwind.config.js`, `postcss.config.js`)
- **React Router** — Navegação entre páginas e proteção de rotas
- **Lucide React** — Ícones da interface
- **ESLint** — Padronização e qualidade de código (`eslint.config.js`)

## Estrutura de Pastas

```text
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                 # Imagens e SVGs estáticos
│   ├── components/
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Contexto global de autenticação (sessão e logout)
│   │   ├── CategoriaCard.jsx   # Card de exibição de categoria
│   │   ├── EstoqueCard.jsx     # Card de exibição de item de estoque
│   │   ├── FiadoCard.jsx       # Card de exibição de conta fiado
│   │   └── UsuarioCard.jsx     # Card de exibição de usuário
│   ├── layouts/
│   │   ├── MainLayout.jsx      # Layout principal (header com menu hambúrguer e navegação inferior)
│   │   └── RotaProtegida.jsx   # Wrapper que redireciona usuários não autenticados para /login
│   ├── pages/
│   │   ├── Home.jsx            # Página inicial
│   │   ├── Login.jsx           # Tela de autenticação
│   │   ├── Estoque.jsx         # CRUD e busca de estoque
│   │   ├── Fiado.jsx           # CRUD e busca de contas fiado
│   │   ├── Categoria.jsx       # CRUD de categorias
│   │   └── Usuarios.jsx        # CRUD de usuários
│   ├── App.jsx                 # Definição das rotas da aplicação
│   ├── App.css
│   ├── index.css
│   └── main.jsx                # Ponto de entrada do React
├── index.html
└── package.json
```

## Autenticação e Integração com a API

- As requisições utilizam `credentials: "include"` para enviar e receber o cookie `HttpOnly` (`jwt`) gerenciado pela API.
- Ao iniciar a aplicação, o `AuthContext` consulta a rota `/usuarios/me` para restaurar a sessão ativa.
- Rotas privadas são protegidas pelo componente `RotaProtegida.jsx`, redirecionando automaticamente para `/login` quando não há usuário autenticado.
- Certifique-se de que a API esteja rodando em `http://localhost:3000` com CORS habilitado para a origem do frontend e `credentials: true`.

## Como Executar Localmente

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Scripts Disponíveis

- `npm run dev` — Inicia o servidor local de desenvolvimento com HMR
- `npm run build` — Gera o bundle otimizado para produção na pasta `dist/`
- `npm run preview` — Pré-visualiza localmente o build de produção
- `npm run lint` — Executa a verificação de código com ESLint