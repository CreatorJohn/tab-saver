# Export Tabs Implementation Plan

**Goal:** Allow users to download their saved tabs as a JSON file for backup.

**Architecture:**
1.  **UI:** Add an "Export" button to `popup.html`.
2.  **Popup Logic:** In `popup.ts`, send an `exportTabs` message to the background.
3.  **Background Engine:** In `background.ts`, fetch from `chrome.storage.local` and trigger a download using a Data URL.

**Status:**
- [x] Permissions (`downloads`) already in `manifest.json`.
- [x] Types (`ExportTabsMessage`, `ExportResponse`) already in `src/types.ts`.

---

### Task 1: UI Update
- [ ] Add `<button id="exportButton" class="button">Export Tabs</button>` to `public/popup.html`.
- [ ] Add CSS for the new button.

### Task 2: Background Engine
- [ ] In `src/background/background.ts`, implement `handleExportTabs`.
- [ ] Register the action in the message listener.

### Task 3: Popup Logic
- [ ] In `src/popup/popup.ts`, wire up the `exportButton` to send the message.
- [ ] Show feedback on success/failure.
