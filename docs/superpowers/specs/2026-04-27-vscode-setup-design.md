# VS Code Setup for Extension Dev

**Date:** 2026-04-27  
**Status:** Approved  
**Topic:** Auto debug, reload, linting.

## 1. Overview
Seamless dev loop: Save -> Build -> Reload -> Debug.

## 2. Debug & Reload
### Launch Config
- `.vscode/launch.json`.
- Chrome with `--load-extension`.
- Source-level breakpoints.

### Auto Reload
- `background.ts` watcher.
- `chrome.runtime.reload()` on change.

### Build Support
- `webpack.config.cjs`: `devtool: 'source-map'`.

## 3. Linting & Quality
### TypeScript
- `tsconfig.json`: include `"chrome"`.
- IDE intelligence via `@types/chrome`.

### Manifest Intellisense
- `.vscode/settings.json`: `json.schemas`.
- `https://json.schemastore.org/chrome-manifest`.

### ESLint & Prettier
- `eslint`, `eslint-plugin-chrome-extension`.
- `.prettierrc`.
- Fix on Save.

## 4. Deps
- `eslint`, `eslint-plugin-chrome-extension`, `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`.

## 5. Success Criteria
1. `F5` open Chrome with ext.
2. Breakpoints work in TS.
3. Auto reload on save.
4. Lint errors highlighted.
