# Import Tabs Spec

**Date:** 2026-04-27
**Status:** Approved
**Topic:** JSON import + merge/overwrite options.

## 1. Overview
Upload `.json` file to restore/combine tabs. UI toggle for "Merge" vs "Overwrite".

## 2. UI Components
### Merge Toggle
- **Style:** Neumorphic inset switch.
- **Location:** Above buttons.
- **Label:** "Merge with existing".
- **Default:** OFF (Overwrite).

### Import Button
- **Style:** Raised neumorphic button.
- **Trigger:** `<input type="file" accept=".json">`.

## 3. Logic & Data Flow
### Popup
1. Select file.
2. `FileReader` read text.
3. JSON parse + `TabData` validation.
4. Send `importTabs` msg: `{ tabs, mode }`.

### Background (`StorageManager`)
- **Action:** `importTabs`.
- **Merge Strategy:** 
  - `merge`: combine lists, `url` = unique key, new data wins.
  - `overwrite`: replace storage.

## 4. Technical Integration
### Types
- `src/types.ts`: `ImportTabsMessage`, `ImportResponse`.

### Services
- `StorageManager.handleImportTabs`.
- `Background.ts` route.

## 5. Success Criteria
1. Import valid JSON.
2. Overwrite replaces all.
3. Merge combines, new wins on collide.
4. Success/error feedback.
