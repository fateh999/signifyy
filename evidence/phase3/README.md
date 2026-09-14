# Phase 3 evidence — Expo SDK 57 on the New Architecture

Captured on iPhone 17 simulator (iOS 26.5), Release build, against the
SDK 51 captures in `baseline-sdk51/`.

| File | What it shows |
| --- | --- |
| `01-home-light.png` | Home, light theme, one saved document |
| `02-home-dark.png` | Home, dark theme, after toggle |
| `03-document-picker.png` | Alert sheet at its 40% snap point |
| `04-document-render.png` | PDF rendered, page indicator `1 / 1` |
| `05-signature-box-placed.png` | Signature box placed on the page |
| `06-home-light-diff.png` | Home diff vs baseline |
| `07-document-render-diff.png` | PDF diff vs baseline |

## Reading the diffs

**Home (light and dark)** — 0.06% and 0.07% mismatch, confined to two
header regions. Both regions are pixel-for-pixel identical after a 1px
horizontal and 1px vertical shift (0.00% differing, maxDelta 0). RN 0.86
rounds glyph positions differently than RN 0.74. Nothing moved visually.

**Document picker** — 0% against baseline. Worth noting because the sheet
initially rendered at zero height: `@gorhom/bottom-sheet` v5 defaults
`enableDynamicSizing` to true, which measures content instead of honouring
`snapPoints`, and the alert body is flex-based so it measured to nothing.
Setting it to false restores the v4 behaviour.

**PDF render** — 10.85% mismatch, and this one is a real rendering change.
`react-native-pdf` v6 does not render under Fabric at all (`onLoadComplete`
never fires, page count stays 0), so v7 is mandatory rather than optional.
v7 insets the page:

| | Baseline | SDK 57 |
| --- | --- | --- |
| Page width | 1205px | 1185px |
| Page height | 1559px | 1535px |

Ink coverage matches (5.362% vs 5.267%) and mean luminance matches
(240.76 vs 240.59), so this is the same page drawn to a slightly smaller
box, not different content. The increase in midtones (6.336% → 9.316%) is
softer antialiasing from the rescale.

**Signature placement, the part that matters.** The inset feeds the
placement maths in `Helpers.ts`, so it was measured on the written file
rather than assumed. Signature landed at x=277.94, y=357.90, w=76.12,
h=76.20 on a 612×792 page. The inset accounts for 0.42pt of drift, which is
0.07% of page width — below what anyone can see, and well inside the page.

## Verified paths

Home light and dark, theme toggle (92.95% repaint, a full light-to-dark
swap), document picker, PDF render, signature canvas empty, stroke drawn,
undo/redo, signature box placed, and signed PDF written to disk
(19,949 bytes, 2 embedded images).

## Caveats

Simulator only — physical device regression is issue #9 and was explicitly
scoped out. Baseline and current are both Release builds.
