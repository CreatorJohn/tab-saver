# Export Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a JSON export feature for saved tabs.

**Architecture:** 
- Add UI button in popup.
- Background script handles the heavy lifting of reading from storage and triggering the Chrome download API.

**Tech Stack:** TypeScript, Chrome Extensions API (Manifest V3).

---

### Task 1: UI Update

**Files:**
- Modify: `public/popup.html`

- [ ] **Step 1: Add the Export button to the HTML**

```html
<!-- ... inside button-group ... -->
<button id="openButton" class="button" disabled>Open Tabs</button>
<button id="exportButton" class="button">Export Tabs</button>
```

- [ ] **Step 2: Add CSS for the export button**

```css
#exportButton {
  background-color: #6366f1;
  color: white;
}

#exportButton:hover {
  background-color: #4f46e5;
}
```

- [ ] **Step 3: Commit**

```bash
git add public/popup.html
git commit -m "feat: add export button to popup UI"
```

### Task 2: Background Logic

**Files:**
- Modify: `src/background/background.ts`

- [ ] **Step 1: Implement `handleExportTabs`**

```typescript
async function handleExportTabs(sendResponse: (response: ExportResponse) => void) {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEY]);
    const tabs = result[STORAGE_KEY] as TabData[] | undefined;

    if (!tabs || tabs.length === 0) {
      sendResponse({ success: false }); // Or could send success: true with message
      return;
    }

    const json = JSON.stringify(tabs, null, 2);
    const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;

    chrome.downloads.download({
      url: dataUrl,
      filename: `tab-saver-export-${new Date().toISOString().split('T')[0]}.json`,
      saveAs: true
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Download error:', chrome.runtime.lastError);
        sendResponse({ success: false });
      } else {
        sendResponse({ success: true });
      }
    });
  } catch (error) {
    console.error('Error exporting tabs:', error);
    sendResponse({ success: false });
  }
}
```

- [ ] **Step 2: Register action in listener**

```typescript
// ... inside chrome.runtime.onMessage.addListener ...
if (request.action === 'exportTabs') {
  handleExportTabs(sendResponse);
  return true;
}
```

- [ ] **Step 3: Verify build**

Run: `bun run build`

- [ ] **Step 4: Commit**

```bash
git add src/background/background.ts
git commit -m "feat: implement export logic in background script"
```

### Task 3: Popup Wiring

**Files:**
- Modify: `src/popup/popup.ts`

- [ ] **Step 1: Get DOM element and add listener**

```typescript
const exportButton = document.getElementById('exportButton') as HTMLButtonElement;

exportButton.addEventListener('click', async () => {
  try {
    exportButton.disabled = true;
    const response = await sendMessage<ExportTabsMessage, ExportResponse>({
      action: 'exportTabs'
    });

    if (response.success) {
      showMessage('Export started!', 'success');
    } else {
      showMessage('Export failed or no tabs to export', 'error');
    }
  } catch (error) {
    console.error('Error exporting tabs:', error);
    showMessage('Error exporting tabs', 'error');
  } finally {
    exportButton.disabled = false;
  }
});
```

- [ ] **Step 2: Verify build**

Run: `bun run build`

- [ ] **Step 3: Commit**

```bash
git add src/popup/popup.ts
git commit -m "feat: wire up export button in popup"
```
