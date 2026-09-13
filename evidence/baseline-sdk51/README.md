# SDK 51 baseline

Captured **before** any upgrade work began, on the pre-upgrade tree. Once the
SDK moves this state is unrecoverable, so these are the reference images every
sub-issue diffs against.

## Environment

| | |
|---|---|
| Device | iPhone 17 simulator, iOS 26.5 (`F11DD74A-C674-400A-B754-9478B6CD20E9`) |
| Build | `Release` — incidental, see below |
| Xcode | 26.6 (17F113) |
| expo | 51.0.26 |
| react-native | 0.74.5 |
| react | 18.2.0 |
| @shopify/react-native-skia | 1.2.3 |
| react-native-reanimated | 3.10.1 |
| @gorhom/bottom-sheet | 4.5.1 |

## Images

| File | Shows |
|---|---|
| `01-home-light.png` | Home, light theme, empty state |
| `02-home-dark.png` | Home, dark theme — theme toggle verified working (84.97% pixel change between the two) |
| `03-document-picker.png` | AlertPopup bottom sheet — `@gorhom/bottom-sheet` v4, the component moving to v5 in #5 |
| `04-document-render.png` | A real PDF rendered, page indicator `1 / 1` — `react-native-pdf` + `react-native-blob-util` working |
| `05-signature-empty.png` | Signature screen, empty canvas, Reset/Undo/Redo/Save toolbar |
| `06-signature-stroke.png` | One stroke drawn on the Skia canvas |
| `07-signature-flow.mp4` | Three-stroke signature, then undo, then redo — stroke rendering and history stack |
| `08-signature-final.png` | Canvas after undo→redo, all three strokes restored |

### What the signature diffs prove

A swipe from `(0.25, 0.35)` to `(0.75, 0.42)` produced a changed region at
`x=0.246 y=0.348 w=0.508 h=0.074` — the drawn line, matching the gesture. After
undo→redo the changed region grows to `x=0.246 y=0.298 w=0.539 h=0.125`,
covering all three strokes, so the history stack restores correctly.

This matters most for #6. `rn-perfect-sketch-canvas` is being replaced wholesale,
and these are the numbers the rewrite has to reproduce: a stroke must appear
where the finger went, and undo/redo must restore it.

## Why Release, and what that does not mean

Debug ships no JS — the app talks to Metro at runtime. Release compiles the
bundle to Hermes bytecode and embeds it (`main.jsbundle`, 5 MB here), so the app
runs standalone with dev tooling compiled out. That is what ships.

The baseline is Release for an **incidental** reason. A Debug build failed on
`expo-dev-menu`, so Release was tried to sidestep it — and failed identically,
because `expo-dev-client` is a full dependency rather than a `devDependency`, so
its pod compiles in both configurations. Patching the one offending line is what
produced a green build; the configuration was never the fix. Debug would very
likely build too with the same patch — it was not re-tested, since a working
Release build was enough to capture the baseline.

Being standalone did help here: with the bundle embedded, the app could be
driven through the full flow with no Metro attached.

## Local workarounds used (neither committed)

1. `react-native-image-crop-picker@0.40.0` calls `TOCropViewController`'s
   `customAspectRatio`, removed in TOCrop 3.2.0. The podspec declares no version
   constraint, so CocoaPods resolves the newest 3.x. Pinned
   `TOCropViewController ~> 2.7.4` in the Podfile, then `pod update
   TOCropViewController` — `pod install` alone will not move it.
2. `expo-dev-menu` (SDK 51) references `TARGET_IPHONE_SIMULATOR`, removed from
   the Xcode 26 SDK. Patched in `node_modules` to `#if targetEnvironment(simulator)`.

Both are upstream problems, not app code, and both are resolved by the upgrade.

## Reproducing a comparison

`screenshot-diff` requires **absolute** paths — relative paths fail with a
"not found on the tool-server host" error:

```
argent run screenshot-diff --udid <UDID> \
  --baselinePath "$PWD/evidence/baseline-sdk51/01-home-light.png" \
  --captureCurrent
```

Two notes for whoever automates this. The alert buttons carry no accessibility
labels, so `describe` will not find them by name — locate them with
`native-find-views --className RCTTextView` and convert the returned
`windowFrame` to normalized coordinates. And `screen-recording-stop --out`
failed to copy while still finalizing the recording, so read the `outputFile`
path from the `screen-recording-start` result instead.
