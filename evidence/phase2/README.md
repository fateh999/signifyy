# Phase 2 — signature canvas rewrite

Captured on iPhone 17 simulator (iOS 26.5) against the SDK 51 dev-client
build, so this is a like-for-like comparison with `../baseline-sdk51/`.
Only the canvas implementation changed between the two sets.

| File | What it shows |
| --- | --- |
| `01-signature-empty.png` | Empty canvas with Reset/Undo/Redo/Save and the pen-tip control |
| `02-signature-stroke.png` | Single stroke drawn (0.25, 0.35) → (0.75, 0.42) |
| `03-signature-three-strokes.png` | Three stacked strokes before undo testing |
| `04-signature-red-thick.png` | Colour picker + widest pen tip |
| `05-tip-3px.png` / `06-tip-5px.png` / `07-tip-7px.png` | Pen-tip cycle at 3 / 5 / 7 px |

## Results

Stroke geometry is unchanged from baseline:

- Single stroke renders at x=0.2463 y=0.3482 w=0.5091 h=0.0744. The
  baseline recorded x=0.246 y=0.348 w=0.508 h=0.074 — a match to three
  decimals.
- Diffed against `../baseline-sdk51/06-signature-stroke.png`, variance is
  0.05% (1,629 of 3.2M pixels), entirely inside the stroke region itself.
  That is antialiasing noise, not a placement shift.
- Three strokes render at x=0.2463 y=0.2982 w=0.539 h=0.024, matching the
  baseline's post-redo region.

History behaves identically:

- Undo clears the stroke — 0% diff against the empty canvas.
- Redo restores it pixel-for-pixel — 0% diff against the pre-undo capture.
- Undo twice from three strokes returns exactly the single-stroke capture.
- Reset clears everything — 0% diff against the empty canvas.

Controls work:

- Colour swatches (red / green / blue / black) all apply. The red stroke
  capture contains 2,120 pure (255,0,0) pixels with antialiased edges.
- Pen tip scales monotonically: 3px → 6 device px, 5px → 8, 7px → 12 at
  @3x.
