# Frontend orchestration trial

## Approved scope

Update retained dependencies to current compatible stable versions, migrate their configuration,
add behavioral unit coverage, and simplify settings and playback ownership. Preserve the visible
interface, existing local-storage keys, note weighting, and GitHub Pages static export. Commit each
verified milestone. The user approved this plan on 2026-11-01.

## Baseline

- Starting commit: `6cd63b19fd3f5b372e419d619474450515283054`.
- Existing user change: npm metadata in `package-lock.json`, saved separately before dependency work.
- Production build passed with `NX_DAEMON=false NX_ISOLATE_PLUGINS=false npm run build`.
- The sandbox blocks Nx's local IPC socket; the baseline build required an approved external run.
- No application unit tests existed. Root scripts provided only build, start, and dev commands.
- Orchestration CLI `npm run doctor`: 0 changes, 16 unchanged, 0 conflicts; Codex CLI 0.166.0.
- `fe_researcher` completed read-only baseline research before implementation approval.

## Task ledger

The initial implementation is not a repair. After a failed acceptance check, increment the task's
repair count before correction and verification. The maximum is two attempts per unresolved
acceptance criterion; replacing a worker does not reset its count.

| Task | Owner                              | Scope                                                | Status                 | Repairs                                |
| ---- | ---------------------------------- | ---------------------------------------------------- | ---------------------- | -------------------------------------- |
| R0   | fe_researcher / Luna high          | Read-only orientation and behavior map               | Done                   | 0/2                                    |
| D1   | fe_developer_high / Terra high     | Dependency and configuration migrations              | Done                   | Install 1/2; types/build 2/2; lint 2/2 |
| T1   | fe_tester / Luna high              | Note generation and selector characterization        | Done: 8 tests          | 0/2                                    |
| D2   | fe_developer_medium / Terra medium | Settings persistence consolidation                   | Done: 5 tests          | 0/2                                    |
| D3   | fe_developer_high / Terra high     | Playback, RAF cleanup, speech lifecycle              | Done                   | 2/2                                    |
| T2   | fe_tester / Luna high              | Settings characterization and regression tests       | Done                   | 0/2                                    |
| T3   | fe_tester / Luna high              | Playback, speech, timer and weighted-selection tests | Done                   | 2/2                                    |
| V3   | fe_reviewer / Sol high             | Independent correctness and plan review              | Done: no open findings | 0/2                                    |

The main chat owns coordination, this report, final verification, and commits. Workers have explicit
path ownership and must preserve each other's work. Dependent mutations are serialized. Existing
assertions must be preserved until failures are classified independently.

## Dependency migration

- Updated retained direct dependencies to current compatible releases, including Nx 24.0.3,
  Next 16.4.3, React 19.3.1, Tailwind 4.3.3 and Jest 30.5.2.
- TypeScript 6.0.3 is the compatible ceiling: typescript-eslint requires <6.1 and ts-jest requires
  <7. ESLint 9.39.5 is the ceiling supported by the current React/import/accessibility plugins.
  The post-update npm outdated report lists only these two intentional major-version ceilings.
- Added Tailwind's required PostCSS adapter, migrated ESLint to flat configuration, and adjusted
  React refs and TypeScript module resolution. CI now uses Node 24.
- Initial installation failed on stale Nx 18 resolution; fresh resolution passed without force or
  legacy-peer-deps. The generated lock supersedes the original npm metadata-only user change;
  its patch remains preserved separately.
- Typecheck passed. Production static export passed and retains /fretboard-scholar/_next/ assets.
  Lint passed with 12 visible warnings. Eight newly introduced compiler-rule errors also occur
  against the original source under the new tooling; independent reviewer V0 verified that
  comparison before only those three new rule severities became warnings. Original hooks and
  module-boundary enforcement remain intact.
- Production npm audit reports zero vulnerabilities. Full audit reports 48 development-only
  vulnerabilities (3 low, 45 moderate), with no high or critical findings.
- Characterization tests passed: 2 suites, 8 tests. No prior test expectation was weakened.

## Refactor and final proof

- Settings retain all established keys, defaults, raw voice URI format and stable public methods.
  Shared typed persistence validates stored values and tolerates denied storage. Malformed existing
  values remain intact rather than being deleted or silently rewritten.
- Playback owns one RAF chain with its actual request handle and separate timing. Weighted
  selection preserves original position weights, excludes the previous note when alternatives
  exist, and terminates for empty and single-note pools. Settings changes are used during playback.
- Speech construction is guarded, voice listeners and utterances are cleaned up, and empty voice
  lists finish loading. Independent review caught the consumer-level consequence: an empty list
  previously erased the persisted voice. A real Settings/Redux regression now covers asynchronous
  empty, fallback and saved-voice lists without changing the saved preference.
- Independent review also caught Tailwind 4 removing bg-opacity-75. The backdrop now uses the
  supported alpha syntax and generated CSS confirms 75 percent opacity.
- T3's two harness repairs changed the deterministic starting clock and optional-property deletion
  types. The weighted assertions were retained; timestamp zero has separate coverage. Independent
  review confirmed test integrity. A stale-note speech regression was fixed in production code.
- Final application check passed: typecheck, lint, 8 Jest suites / 28 tests, and production build.
  The final build reused Nx's successful production-build cache after the same source had already
  been built by the worker. No test was skipped or existing expectation weakened to obtain green.
- A browser loaded the production static export, started playback, observed the timer advance and
  the note change, stopped playback, opened Settings, visually confirmed the translucent backdrop,
  changed the fret count to 18, and confirmed it survived reload.
- StrictMode and repeated single-note speech do not have dedicated automated cases. Weighting and
  empty/single/duplicate pools have focused tests; lifecycle behavior has hook tests and browser
  smoke evidence. Full speech behavior across browser/OS voice engines was not exercised.

## Milestones

- `1024283`: frontend dependencies and configuration migration.
- `ac37b40`: note generation and selector characterization.
- `9abcdb3`: safe settings persistence.
- `0a632de`: playback/speech ownership, regression coverage and backdrop compatibility.

The installed FE roles were exercised by this signed-in desktop chat, with configured Luna, Terra
and Sol variants. CLI doctor, installation and launcher unit tests were exercised. A new interactive
task launched through npm start was not run; that is a remaining CLI end-to-end acceptance boundary,
not evidence supplied by this desktop trial.

## Verification and continuation

The refactor is complete and verified. Completed application tasks have no remaining acceptance
failures. A separate interactive CLI-launched trial remains outside the evidence from this desktop
session.
