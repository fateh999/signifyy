# Phase 1 — Remove unused dependencies

Branch: `phase-1/remove-unused-deps` (issue #3)

No source files changed in this phase, so the expected visual result is
**zero pixel difference** against the SDK 51 baseline.

| artifact | meaning |
| --- | --- |
| `01-home-light-after.png` | home screen after removing 13 dependencies |
| `02-home-light-diff.png` | diff vs `baseline-sdk51/01-home-light.png` — 0% |

## Results

- home light vs `baseline-sdk51/01-home-light.png` — **0% pixel change**
- home dark vs `baseline-sdk51/02-home-dark.png` — **0% pixel change**
- theme toggle light -> dark — **84.97%**, matching the recorded baseline delta

## Note on a false positive

The first diff run reported 2.61% across 4 regions. That was **not** a
regression: it was leftover app state from the earlier baseline session
(a `sample.pdf` row in the persisted MMKV document list, plus an open
bottom sheet). The changed regions matched the accessibility tree frames
for that row and the FAB exactly. Clearing the MMKV store and relaunching
produced 0%. The store was restored afterwards so the simulator remains a
faithful baseline for later phases.
