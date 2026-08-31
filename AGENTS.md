# OnMangeOu � back-office administration

D�p�t autonome du back-office interne. Frontend web Next.js, sans base de donn�es.

## R�f�rence

- Sp�cification ma�tre : `docs/reference/OnMangeOu_Specification_Technique_Maitre.md` (sections 3.4, 6.5, 19, 31)
- Tokens de marque : `docs/reference/onmangeou-tokens.json`
- Logos : `public/brand/`

## P�rim�tre de cette tranche

Connexion OTP, tableau de bord, dossiers de v�rification, supervision des �tablissements, journal d�audit en lecture seule.

Toutes les op�rations passent par l�API `http://localhost:3000/api/v1` via le BFF (`src/app/api/session/*`). Aucun acc�s PostgreSQL. Les jetons JWT ne quittent jamais le serveur Next : cookies HttpOnly uniquement.

## Commandes

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm verify
```

Le back-office �coute le port 3001. L�API occupe le 3000.

## R�gles imp�ratives

- TypeScript strict, aucun `any`.
- Textes utilisateur en fran�ais via `src/i18n/fr-CI.json` uniquement.
- Tokens de marque, Inter, pas de biblioth�que d�interface tierce.
- Compte nominatif : aucune impersonation. Bandeau visible sur les pages internes.
- Journal d�audit : lecture seule, aucun bouton de suppression.
- Motif obligatoire pour toute d�cision de v�rification.
- `proxy.ts` (convention Next.js 16, ex-middleware) prot�ge les pages internes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
