# SGB Magaiver — Trabalho Interdisciplinar: Aplicações para Processos de Negócios

Sistema de gestão de negócios desenvolvido para controle de estoque, contas fiado, categorias, itens de comanda e usuários, estruturado em monorepo com API REST em Node.js/Express + Prisma e interface web em React + Vite + Tailwind CSS.

## Funcionalidades

- **Autenticação e Controle de Acesso:** Login com JWT armazenado em cookie `HttpOnly` e proteção de rotas no backend (`auth.js`) e no frontend (`RotaProtegida.jsx`).
- **Gestão de Estoque:** Cadastro, listagem, edição e remoção de itens de estoque.
- **Controle de Fiado:** Registro e acompanhamento de contas de clientes com valor e data de vencimento.
- **Categorias:** Gerenciamento de categorias para organização dos itens.
- **Usuários:** Administração de contas de acesso ao sistema.
- **Itens de Comanda:** Camada de API preparada para gerenciamento de itens de comanda.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+ recomendada)
- [Docker](https://www.docker.com/) e Docker Compose (opcional, para subir o banco de dados via `docker-compose.yaml`)