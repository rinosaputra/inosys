# inosys

Opinionated, production‑grade **TanStack Start** fullstack starter with **branch‑based evolution**.

This repository is not a tutorial project and not a generic boilerplate dump.
It is a reusable engineering standard designed to evolve in a disciplined way:
`feature/*` → `dev` → `main`.

---

## Goals

- Modern fullstack reference implementation (TanStack ecosystem)
- Reusable, enterprise‑ready starter architecture
- Opinionated, but extensible
- Minimal, but powerful
- Clean integration (no package dumping)
- Clear Git workflow and branch evolution narrative

---

## Tech Stack (Current Direction)

- **TanStack Start** (Node server runtime)
- **TypeScript**
- **ESLint**
- **Vitest**
- **Auth:** Email/Password + **JWT access token** (API style, `Authorization: Bearer ...`)
- **DB:** **Knex.js + MySQL** (local dev via **XAMPP only**)

> Note: This repo intentionally starts minimal. Additional integrations are introduced via feature branches and merged through `dev`.

---

## Branch Strategy

- `main`  
  Stable snapshot. Minimal baseline + validated integrations only.

- `feature/*`  
  Isolated experiments and integrations (one feature per branch).

- `dev`  
  Controlled integration branch. Features land here before being promoted to `main`.

### Documentation for branches

All branch narratives / “blog posts” live in:

- `content/docs/branches/`

Each feature branch should add or update its matching documentation file.

---

## Commit Convention (Enforced)

This repository enforces **only** the following commit types:

- `feat: ...`
- `fix: ...`
- `chore: ...`

(Enforced via Husky + Commitlint.)

Examples:

- `chore: bootstrap tanstack-start baseline`
- `feat: add knex mysql connection`
- `fix: reject invalid jwt`

---

## Requirements

- **Node.js 20 LTS**
- MySQL via **XAMPP** (for local development)

Recommended:

- Git
- A POSIX-like shell (macOS/Linux) or PowerShell on Windows

---

## Getting Started

> The exact commands may differ slightly depending on how the TanStack Start app is bootstrapped in this repo.
> Once `main` is finalized, this section should be kept 100% accurate and minimal.

1. Clone:

```bash
git clone https://github.com/rinosaputra/inosys
cd inosys
```

2. Use Node 20:

```bash
node -v
# should be v20.x
```

3. Install dependencies:

```bash
npm install
```

4. Configure environment variables:

- Copy `.env.example` to `.env`
- Fill required values (DB + JWT secret)

```bash
cp .env.example .env
```

5. Run in development:

```bash
npm run dev
```

---

## Testing

Run unit tests (Vitest):

```bash
npm test
```

or

```bash
npm run test
```

(Depending on scripts defined in `package.json`.)

---

## Roadmap (Branch-based)

Planned evolution (high level):

- `feature/db-knex-mysql`
- `feature/auth-jwt`
- `feature/tanstack-query`
- Future: caching strategy, upload strategy, audit log, multi-role/RBAC, etc.

---

## Contributing

- Keep changes focused: 1 branch = 1 integration/feature.
- Update docs under `content/docs/branches/` for every significant branch.
- Follow the enforced commit convention (`feat|fix|chore`).
- Avoid premature abstractions and unnecessary dependencies.

---

## License

TBD (choose a license before announcing broadly; MIT is common for starters).