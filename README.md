# Scheduling SaaS · Web

[![CI](https://github.com/efvieira/scheduling-saas-web/actions/workflows/ci.yml/badge.svg)](https://github.com/efvieira/scheduling-saas-web/actions/workflows/ci.yml)
[![CD](https://github.com/efvieira/scheduling-saas-web/actions/workflows/cd.yml/badge.svg)](https://github.com/efvieira/scheduling-saas-web/actions/workflows/cd.yml)
![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
[![License: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)

Frontend em **Angular 22** do SaaS de agendamento para pequenos negócios. São duas experiências:

- **Página pública de agendamento** (`/b/:slug`), pensada para o celular. A cliente escolhe o serviço, a profissional, o dia e o horário, informa nome e WhatsApp e confirma. Nos serviços pré-pagos, recebe o Pix Copia e Cola.
- **Painel do negócio** (`/painel`): login e agenda do dia, com ações de confirmar, marcar como atendido, falta ou cancelar.

A API está em [scheduling-saas-api](https://github.com/efvieira/scheduling-saas-api).

### ✨ Destaques

- ⚡ **Angular 22** com componentes standalone, *signals*, controle de fluxo (`@if`, `@for`) e rotas com *lazy loading*
- 🔐 Interceptor que injeta o JWT só nas rotas do painel, e *guard* de rota
- 🕒 Datas sempre no fuso de São Paulo, independentemente do fuso do aparelho
- ♿ Foco visível, `aria-pressed`/`aria-selected` nas escolhas e respeito a `prefers-reduced-motion`
- 🧪 Testes com **Vitest** (runner padrão do Angular)
- 🐳 Imagem **nginx** que serve o app e faz proxy de `/api`, eliminando CORS

### 🛠️ Stack

Angular 22 · TypeScript 6 · RxJS · SCSS · Vitest · nginx · Docker · GitHub Actions

## 🚀 Como rodar

### Tudo com Docker (web + API + Postgres)

```bash
docker compose up -d
```

Acesse http://localhost:4200/b/studio-bela. O painel fica em `/painel`, com login `dona@studiobela.demo` e senha `demo1234`.

O compose usa a imagem publicada da API (`ghcr.io/efvieira/scheduling-saas-api`).

### Desenvolvimento

Com a API rodando em `localhost:8080`:

```bash
npm install
npm start
```

O `proxy.conf.json` encaminha `/api` para a API.

### Testes e build

```bash
npx ng test --watch=false
npx ng build
```

## 🎨 Design

- Paleta ameixa e lilás com acento malva, pensada para salões e estúdios de beleza
- Tipografia: **Bricolage Grotesque** nos títulos e **Atkinson Hyperlegible** no texto (legibilidade no celular)
- O elemento marcante é a faixa de dias com números grandes, como uma agenda de papel

## 🔀 Fluxo de branches e CI/CD

`develop` (padrão) → `release` → `master`, sempre por PR. Detalhes em [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 Licença

[MIT](LICENSE)
