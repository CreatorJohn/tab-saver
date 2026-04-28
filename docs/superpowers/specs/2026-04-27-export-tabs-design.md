# Export Tabs Implementation Plan

**Goal:** Download saved tabs as JSON backup.

**Architecture:**
1. **UI:** "Export" btn in `popup.html`.
2. **Popup Logic:** send `exportTabs` msg to background.
3. **Background Engine:** fetch from storage, trigger download via Data URL.

**Status:**
- [x] Permissions (`downloads`) in `manifest.json`.
- [x] Types (`ExportTabsMessage`, `ExportResponse`) in `src/types.ts`.

---

### Task 1: UI Update
- [ ] Add `<button id="exportButton" class="button">Export Tabs</button>` to `public/popup.html`.
- [ ] Add CSS.

### Task 2: Background Engine
- [ ] `src/background/background.ts`: `handleExportTabs`.
- [ ] Register action in listener.

### Task 3: Popup Logic
- [ ] `src/popup/popup.ts`: wire `exportButton`.
- [ ] Success/fail feedback.
