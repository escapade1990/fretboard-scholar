# FretboardScholar

<a href="https://escapade1990.github.io/fretboard-scholar/" target="_blank" rel="noreferrer">Github Page</a>

## Development

Use Node.js 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The production build exports a static site to `apps/web/out` with the
`/fretboard-scholar` base path for GitHub Pages.

```sh
npm run test
npm run typecheck
npm run lint
npm run build
npm run check
```

`check` runs types, lint, unit tests and production build. In restricted environments Nx needs
permission to open local IPC sockets; disabling its daemon alone does not remove that requirement.

Next.js manages `apps/web/next-env.d.ts`; Git ignores it because dev and production use different
generated type paths. `typecheck` generates the required Next.js types before running TypeScript,
so it also works before the first dev server or build. The generated `apps/web/AGENTS.md` block is
tracked as Next.js recommends.

The [orchestration trial](docs/orchestration-trial.md) records dependency compatibility ceilings,
behavioral verification and milestone commits from the refactor.
