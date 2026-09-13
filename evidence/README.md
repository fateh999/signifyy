# Evidence branch

Visual verification artifacts for the Expo SDK 51 -> 57 upgrade (#2).

This is an **orphan branch**. It shares no history with `main` and contains no
application code — only screenshots and screen recordings. Binaries are kept out
of the code history on purpose; nothing here should ever be merged into `main`.

## Layout

```
evidence/
  baseline-sdk51/   captured before any upgrade work began
  issue-<n>/        per-sub-issue after state
```

## How to link from a PR

Push the file here, then embed the raw URL:

```
https://raw.githubusercontent.com/fateh999/signifyy/evidence/evidence/<path>
```

Images render inline in PR bodies with normal markdown. MP4 recordings do not
render on raw URLs — link those via the `blob` URL instead, which gives a
player:

```
https://github.com/fateh999/signifyy/blob/evidence/evidence/<path>
```
