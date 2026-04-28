# Export Tabs Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** JSON export for saved tabs.

**Architecture:** 
- UI button in popup.
- Background: read storage + Chrome download API.

**Tech Stack:** TypeScript, Chrome Ext API.

---

### Task 1: UI

**Files:**
- Modify: `public/popup.html`

- [ ] **Step 1: Add Button**

```html
<button id="openButton" class="button" disabled>Open Tabs</button>
<button id="exportButton" class="button">Export Tabs</button>
```

- [ ] **Step 2: CSS**

```css
#exportButton { background-color: #6366f1; color: white; }
#exportButton:hover { background-color: #4f46e5; }
```

- [ ] **Step 3: Commit**

```bash
git add public/popup.html
git commit -m "feat: add export button"
```

### Task 2: Background

**Files:**
- Modify: `src/background/background.ts`

- [ ] **Step 1: `handleExportTabs`**

```typescript
async function handleExportTabs(sendResponse: (response: ExportResponse) => void) {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEY]);
    const tabs = result[STORAGE_KEY] as TabData[] || [];
    if (!tabs.length) return sendResponse({ success: false });
    const json = JSON.stringify(tabs, null, 2);
    const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;
    chrome.downloads.download({
      url: dataUrl,
      filename: `tab-saver-export-${new Date().toISOString().split('T')[0]}.json`,
      saveAs: true
    }, () => sendResponse({ success: !chrome.runtime.lastError }));
  } catch { sendResponse({ success: false }); }
}
```

- [ ] **Step 2: Register Listener**

```typescript
if (request.action === 'exportTabs') {
  handleExportTabs(sendResponse);
  return true;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/background/background.ts
git commit -m "feat: export logic"
```

### Task 3: Popup

**Files:**
- Modify: `src/popup/popup.ts`

- [ ] **Step 1: Listener**

```typescript
const exportButton = document.getElementById('exportButton') as HTMLButtonElement;
exportButton.addEventListener('click', async () => {
  exportButton.disabled = true;
  const response = await sendMessage<ExportTabsMessage, ExportResponse>({ action: 'exportTabs' });
  showMessage(response.success ? 'Export started!' : 'Export failed', response.success ? 'success' : 'error');
  exportButton.disabled = false;
});
```

- [ ] **Step 2: Commit**

```bash
git add src/popup/popup.ts
git commit -m "feat: wire export button"
```
