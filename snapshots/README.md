# Snapshots

Full copies of the Cercana app (`kuidao/`) at important points, so any version can be restored.

| File | Commit | What it is |
|---|---|---|
| `cercana-v0.3-before-inspora.zip` | c2db92d | Live mode batch 1 (accounts, shifts, team, caregiver profiles, Docker), before the Inspora-inspired homepage and UI changes. Videos and `marketing/` excluded; they're unchanged. |

Restore into a folder: `unzip cercana-v0.3-before-inspora.zip -d cercana-v0.3`, then `cd cercana-v0.3 && npm install && npm run dev`.
Or straight from git: `git checkout c2db92d -- kuidao` (local tag: `cercana-v0.3-before-inspora`).
