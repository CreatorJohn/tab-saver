# VS Code Setup for Chrome Extension Development

**Date:** 2026-04-27  
**Status:** Approved  
**Topic:** Automating debug, reload, and linting workflows for Tab Saver.

## 1. Overview
The goal is to create a seamless developer experience where saving code in VS Code automatically builds the extension, reloads it in a dedicated Chrome instance, and allows for direct source-level debugging.

## 2. Debugging & Reloading
### Launch Configuration
- **File:** `.vscode/launch.json`
- **Action:** Launch Chrome with `--load-extension` pointing to the `dist/` directory.
- **Goal:** Enable breakpoints in `src/` files that map to the running extension via source maps.

### Automatic Reloading
- **Mechanism:** Add a watcher to `background.ts` (using a standard hot-reload script or a simple filesystem watcher).
- **Behavior:** When Webpack finishes a build in `dist/`, the extension reloads itself using `chrome.runtime.reload()`.

### Build Support
- **Webpack:** Ensure `devtool: 'source-map'` is set in `webpack.config.cjs` for accurate breakpoint mapping.

## 3. Linting & Code Quality
### TypeScript
- **Config:** Update `tsconfig.json` to include `"chrome"` in the `compilerOptions.types`.
- **Validation:** Ensure `@types/chrome` is utilized for IDE intelligence.

### Manifest Intellisense
- **Config:** Add a `json.schemas` entry in `.vscode/settings.json`.
- **Source:** Map `manifest.json` to `https://json.schemastore.org/chrome-manifest`.
- **Goal:** Provide autocompletion, validation, and hover docs for the extension manifest.

### ESLint & Prettier
- **ESLint:** Install `eslint` and `eslint-plugin-chrome-extension`.
- **Prettier:** Use `.prettierrc` for consistent formatting.
- **VS Code Integration:** Configure `.vscode/settings.json` to trigger `editor.codeActionsOnSave` for lint fixes and formatting.

## 4. Dependencies to Add
- `eslint`
- `eslint-plugin-chrome-extension`
- `prettier`
- `eslint-config-prettier`
- `eslint-plugin-prettier`

## 5. Success Criteria
1. Pressing `F5` opens Chrome with the extension loaded.
2. Setting a breakpoint in `src/popup/popup.ts` pauses execution in VS Code when the popup is opened.
3. Saving a file triggers a rebuild and the extension reloads automatically.
4. Lint errors (e.g., using `browser.*` instead of `chrome.*`) are highlighted in the editor.
