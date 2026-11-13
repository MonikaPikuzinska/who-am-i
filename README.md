# Kim jestem?

A small Guess Who board. Photos in `src/assets/characters/` become the cards. The game keeps your secret character, eliminated cards, and asked questions in a cookie. There is no backend.

## Add or replace a photo

Put a file in `src/assets/characters/` named:

`{group}{position}-{name}.{jpg|jpeg|png|webp}`

Example: `skz6-felix.jpg` is card `skz6`, caption **FELIX**. Underscores in the name become spaces (`lee_know` → **LEE KNOW**). Each group is one row, and the number is the place in that row (1–8), not a global 1–32.

A new file with the same group and position replaces that card. To change which row comes first, edit `GROUP_ORDER` in `src/lib/characters.ts`.

Questions are the list in `src/data/questions.ts`. Add new ones at the end so saved “asked” marks stay on the same questions.

Descriptions are in `src/data/descriptions.ts`. Each key is the card id from the filename (`skz6-felix.jpg` → `skz6`). Write a short sentence as the value. An empty string shows “No description yet.”

## Run locally

Vite 8 needs Node.js 20.19+ or 22.12+. This folder has an `.nvmrc` set to 22.

```bash
nvm use
npm install
npm run dev
```

## Publish on GitHub Pages

1. Push the `main` branch to GitHub.
2. In the repo, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

The workflow builds with `npm ci` and `npm run build`, then publishes the `dist` folder. `vite.config.ts` uses `base: './'` so the site works whether the address is `username.github.io/repo/` or a user site.
