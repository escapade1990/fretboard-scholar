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

The [orchestration trial](docs/orchestration-trial.md) records dependency compatibility ceilings,
behavioral verification, milestone commits and monitoring findings from the refactor.
