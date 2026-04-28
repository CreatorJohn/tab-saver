# VS Code Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automate extension dev in VS Code.

**Architecture:** 
1. Source maps in Webpack.
2. Launch config for Chrome with auto-load.
3. VS Code Settings: JSON Schema + auto-fix.
4. ESLint + Prettier.
5. Hot-reload helper in background.

**Tech Stack:** Webpack, TypeScript, ESLint, Prettier, VS Code Debugger.

---

### Task 1: Source Maps

**Files:**
- Modify: `webpack.config.cjs`

- [ ] **Step 1: Update `webpack.config.cjs`**

```javascript
module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  // ...
```

- [ ] **Step 2: Commit**

```bash
git add webpack.config.cjs
git commit -m "chore: enable source maps and development mode in webpack"
```

### Task 2: Debug Config

**Files:**
- Create: `.vscode/launch.json`

- [ ] **Step 1: Create `.vscode/launch.json`**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome with Extension",
      "type": "chrome",
      "request": "launch",
      "url": "about:blank",
      "webRoot": "${workspaceFolder}",
      "runtimeArgs": [
        "--load-extension=${workspaceFolder}/dist",
        "--auto-open-devtools-for-tabs"
      ],
      "sourceMaps": true,
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add .vscode/launch.json
git commit -m "chore: add vscode launch configuration for chrome debugging"
```

### Task 3: Settings & Intellisense

**Files:**
- Create: `.vscode/settings.json`

- [ ] **Step 1: Create `.vscode/settings.json`**

```json
{
  "json.schemas": [
    {
      "fileMatch": ["manifest.json"],
      "url": "https://json.schemastore.org/chrome-manifest"
    }
  ],
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["typescript"],
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

- [ ] **Step 2: Commit**

```bash
git add .vscode/settings.json
git commit -m "chore: add vscode settings for manifest intellisense and auto-fix"
```

### Task 4: Linting Deps

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install deps**

Run: `bun add -d eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-chrome-extension`

- [ ] **Step 2: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: install linting and formatting dependencies"
```

### Task 5: ESLint & Prettier Config

**Files:**
- Create: `.eslintrc.json`, `.prettierrc`

- [ ] **Step 1: Create `.eslintrc.json`**

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "chrome-extension", "prettier"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:chrome-extension/recommended",
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  },
  "env": { "browser": true, "webextensions": true, "node": true }
}
```

- [ ] **Step 2: Create `.prettierrc`**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

- [ ] **Step 3: Commit**

```bash
git add .eslintrc.json .prettierrc
git commit -m "chore: configure eslint and prettier"
```

### Task 6: Hot-Reload Helper

**Files:**
- Create: `src/background/hot-reload.ts`
- Modify: `src/background/background.ts`

- [ ] **Step 1: Create `src/background/hot-reload.ts`**

```typescript
const filesInDirectory = (dir: any) =>
  new Promise((resolve) =>
    dir.createReader().readEntries((entries: any) =>
      Promise.all(
        entries
          .filter((e: any) => e.name[0] !== '.')
          .map((e: any) =>
            e.isDirectory ? filesInDirectory(e) : new Promise((resolve) => e.file(resolve))
          )
      )
        .then((files) => [].concat(...(files as any)))
        .then(resolve)
    )
  );

const timestampForFilesInDirectory = (dir: any) =>
  filesInDirectory(dir).then((files: any) =>
    files.map((f: any) => f.name + f.lastModifiedDate).join()
  );

const watchChanges = (dir: any, lastTimestamp?: string) => {
  timestampForFilesInDirectory(dir).then((timestamp) => {
    if (!lastTimestamp || lastTimestamp === timestamp) {
      setTimeout(() => watchChanges(dir, timestamp), 1000);
    } else {
      chrome.runtime.reload();
    }
  });
};

chrome.management.getSelf((self) => {
  if (self.installType === 'development') {
    chrome.runtime.getPackageDirectoryEntry((dir) => watchChanges(dir));
  }
});
```

- [ ] **Step 2: Import hot-reload**

```typescript
import "./hot-reload";
```

- [ ] **Step 3: Commit**

```bash
git add src/background/hot-reload.ts src/background/background.ts
git commit -m "feat: add hot-reload helper for development"
```
