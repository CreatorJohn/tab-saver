# Import Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Impl JSON import with merge/overwrite + neumorphic UI.

**Architecture:**
- Update `types.ts`: `importTabs` req/res.
- `StorageManager`: merge logic + URL deduplication.
- Popup: neumorphic toggle + import btn.
- `popup.ts`: `FileReader` + validation.

**Tech Stack:** TypeScript, Chrome Extensions API, FileReader API.

---

### Task 1: Type Definitions

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Add Import Types**
Update `src/types.ts`: include `ImportTabsMessage`, update `Message` + `MessageResponse`.

```typescript
// ... existing types

type SuccessImportResponse = {
  success: true
  count: number
}

type FailedImportResponse = {
  success: false
  message: string
}

type ImportResponse = SuccessImportResponse | FailedImportResponse

type ImportTabsMessage = {
  action: "importTabs"
  tabs: TabData[]
  mode: "merge" | "overwrite"
}

// Update unions
type MessageResponse = SaveResponse | OpenResponse | LoadResponse | ExportResponse | ImportResponse
type Message = LoadTabsMessage | SaveTabsMessage | OpenTabsMessage | ExportTabsMessage | ImportTabsMessage
```

- [ ] **Step 2: Commit**

```bash
git add src/types.ts
git commit -m "chore: add types for import functionality"
```

### Task 2: Background Storage Logic

**Files:**
- Modify: `src/services/storage_manager.ts`
- Modify: `src/background/background.ts`

- [ ] **Step 1: Implement `handleImportTabs` in `StorageManager`**
Merge logic + Map for URL deduplication.

```typescript
static async handleImportTabs(
  newTabs: TabData[],
  mode: 'merge' | 'overwrite',
  sendResponse: (response: ImportResponse) => void
) {
  try {
    let finalTabs: TabData[] = [];

    if (mode === 'overwrite') {
      finalTabs = newTabs;
    } else {
      // Fetch existing
      const result = await chrome.storage.local.get([this.STORAGE_KEY]);
      const existingTabs = (result[this.STORAGE_KEY] as TabData[]) || [];

      // Use Map for deduplication by URL (new tabs win)
      const tabMap = new Map<string, TabData>();
      existingTabs.forEach(t => tabMap.set(t.url, t));
      newTabs.forEach(t => tabMap.set(t.url, t));

      finalTabs = Array.from(tabMap.values());
    }

    await chrome.storage.local.set({ [this.STORAGE_KEY]: finalTabs });
    sendResponse({ success: true, count: finalTabs.length });
  } catch (error) {
    console.error('Import error:', error);
    sendResponse({ success: false, message: (error as Error).message });
  }
}
```

- [ ] **Step 2: Route message in `background.ts`**
Update switch.

```typescript
// ... inside listener
case 'importTabs':
  StorageManager.handleImportTabs(message.tabs, message.mode, sendResponse);
  break;
```

- [ ] **Step 3: Commit**

```bash
git add src/services/storage_manager.ts src/background/background.ts
git commit -m "feat: implement import storage logic with URL deduplication"
```

### Task 4: UI Components (Popup)

**Files:**
- Modify: `public/popup.html`

- [ ] **Step 1: Add Merge Toggle and Import Button**
Update button group, add toggle above.

```html
<div class="toggle-container">
  <label class="switch-label">Merge with existing</label>
  <div class="switch" id="mergeToggle">
    <div class="switch-handle"></div>
  </div>
</div>

<div class="button-group">
  <!-- existing buttons -->
  <button id="importButton" class="button">Import Tabs</button>
</div>

<input type="file" id="fileInput" accept=".json" style="display: none;">
```

- [ ] **Step 2: Add CSS for Toggle**
Update style block.

```css
.toggle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 12px 16px;
  background-color: var(--bg);
  border-radius: var(--radius-main);
  box-shadow: var(--shadow-inset);
}

.switch-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.switch {
  width: 44px;
  height: 24px;
  background-color: var(--bg);
  border-radius: 12px;
  box-shadow: var(--shadow-flat);
  cursor: pointer;
  position: relative;
  transition: var(--transition);
}

.switch.active {
  box-shadow: var(--shadow-inset);
}

.switch-handle {
  width: 16px;
  height: 16px;
  background-color: var(--text-secondary);
  border-radius: 50%;
  position: absolute;
  top: 4px;
  left: 4px;
  transition: var(--transition);
}

.switch.active .switch-handle {
  left: 24px;
  background-color: var(--accent);
}

#importButton { color: #8b5cf6; }
```

- [ ] **Step 3: Commit UI**

```bash
git add public/popup.html
git commit -m "style: add neumorphic merge toggle and import button"
```

### Task 5: Import Logic (Popup)

**Files:**
- Modify: `src/popup/popup.ts`

- [ ] **Step 1: Wire up Toggle and Import**
Toggle state + file selection.

```typescript
const mergeToggle = document.getElementById('mergeToggle') as HTMLDivElement;
const importButton = document.getElementById('importButton') as HTMLButtonElement;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;

let isMergeMode = false;

mergeToggle.addEventListener('click', () => {
  isMergeMode = !isMergeMode;
  mergeToggle.classList.toggle('active', isMergeMode);
});

importButton.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const content = event.target?.result as string;
      const tabs = JSON.parse(content) as TabData[];

      // Basic validation
      if (!Array.isArray(tabs) || !tabs.every(t => t.url && t.title)) {
        throw new Error('Invalid file format');
      }

      const response = await sendMessage<ImportTabsMessage, ImportResponse>({
        action: 'importTabs',
        tabs,
        mode: isMergeMode ? 'merge' : 'overwrite'
      });

      if (response.success) {
        showMessage(`Successfully imported ${response.count} tabs!`, 'success');
      } else {
        showMessage(response.message || 'Import failed', 'error');
      }
    } catch (err) {
      showMessage('Error parsing file: ' + (err as Error).message, 'error');
    } finally {
      fileInput.value = ''; // Reset for next use
    }
  };
  reader.readAsText(file);
});
```

- [ ] **Step 2: Verify Build**
Run: `bun run build`

- [ ] **Step 3: Commit Logic**

```bash
git add src/popup/popup.ts
git commit -m "feat: implement file reading and import logic in popup"
```
