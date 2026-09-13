# SDK 51 baseline

Captured **before** any upgrade work began, on the pre-upgrade tree. Once the
SDK moves this state is unrecoverable, so these are the reference images every
sub-issue diffs against.

## Environment

| | |
|---|---|
| Device | iPhone 17 simulator, iOS 26.5 (`F11DD74A-C674-400A-B754-9478B6CD20E9`) |
| Build | `Release` — see caveat below |
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
| `03-document-picker.png` | AlertPopup bottom sheet open — `@gorhom/bottom-sheet` v4 behaviour, the component moving to v5 in #5 |

## Caveat: Release build, not Debug

Two upstream problems block a Debug build of SDK 51 on Xcode 26. Both are
documented in #2; neither is caused by app code:

1. `react-native-image-crop-picker@0.40.0` calls `TOCropViewController`'s
   `customAspectRatio`, removed in TOCrop 3.2.0. The podspec sets no version
   constraint so CocoaPods resolves the newest 3.x. Worked around by pinning
   `TOCropViewController ~> 2.7.4`.
2. `expo-dev-menu` (SDK 51) references `TARGET_IPHONE_SIMULATOR`, which no
   longer exists in the Xcode 26 SDK. Patched locally in `node_modules` to use
   `#if targetEnvironment(simulator)`.

Neither workaround is committed to `main` — they were local-only, applied to
produce this baseline. Both disappear on their own once the SDK upgrade lands.

## Coverage gap

The document render and signature canvas screens are **not** captured. Reaching
them requires importing a real PDF through the native document picker, and
`simctl addmedia` refuses PDFs. Those screens need a manual capture, which
matters most for #6 (signature canvas rewrite) where stroke feel is the whole
point.

## Reproducing a comparison

`screenshot-diff` requires **absolute** paths — relative paths fail with a
"not found on the tool-server host" error:

```
argent run screenshot-diff --udid <UDID> \
  --baselinePath "$PWD/evidence/baseline-sdk51/01-home-light.png" \
  --captureCurrent
```
