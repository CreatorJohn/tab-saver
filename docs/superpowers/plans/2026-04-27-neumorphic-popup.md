# Neumorphic Popup Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the extension popup into a modern Neumorphic interface.

**Architecture:**
- Use CSS variables for consistent neumorphic shadows and colors.
- Replace current flat buttons and cards with 3D-effect components.
- Implement CSS transitions for tactile "pressing" feedback.
- Update `popup.ts` to support the new UI structure and animations.

**Tech Stack:** HTML, CSS, TypeScript, Chrome Extensions API.

---

### Task 1: CSS Foundations & Global Styles

**Files:**
- Modify: `public/popup.html`

- [ ] **Step 1: Define Neumorphic Variables**
Update the `<style>` block in `public/popup.html` to include the design tokens.

```css
:root {
  --bg: #e0e0e0;
  --light-shadow: #ffffff;
  --dark-shadow: #bebebe;
  --accent: #3b82f6;
  --text-primary: #333333;
  --text-secondary: #666666;
  --radius-main: 16px;
  --radius-card: 12px;
  --shadow-flat: 8px 8px 16px var(--dark-shadow), -8px -8px 16px var(--light-shadow);
  --shadow-inset: inset 6px 6px 12px var(--dark-shadow), inset -6px -6px 12px var(--light-shadow);
  --shadow-pressed: inset 4px 4px 8px var(--dark-shadow), inset -4px -4px 8px var(--light-shadow);
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 2: Update Base Body Styles**
Update the `body` style in `public/popup.html`.

```css
body {
  width: 350px;
  padding: 24px;
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
}
```

- [ ] **Step 3: Commit Foundations**

```bash
git add public/popup.html
git commit -m "style: define neumorphic variables and base body styles"
```

### Task 2: Neumorphic UI Components

**Files:**
- Modify: `public/popup.html`

- [ ] **Step 1: Redesign Buttons**
Replace current button styles in `public/popup.html` with neumorphic ones.

```css
button.button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: var(--radius-main);
  background-color: var(--bg);
  box-shadow: var(--shadow-flat);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
  outline: none;
}

button.button:active {
  box-shadow: var(--shadow-pressed);
  transform: scale(0.98);
}

button.button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

#saveButton { color: var(--accent); }
#loadButton { color: #10b981; }
#openButton { color: #f59e0b; }
#exportButton { color: #6366f1; }
```

- [ ] **Step 2: Redesign Tab Cards**
Update the tab item styles in `public/popup.html`.

```css
.tab-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin-top: 16px;
  background-color: var(--bg);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-flat);
  border: none;
  transition: var(--transition);
}

.tab-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.tab-url {
  font-size: 11px;
  color: var(--text-secondary);
}

.delButton {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  box-shadow: 4px 4px 8px var(--dark-shadow), -4px -4px 8px var(--light-shadow);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
}

.delButton:active {
  box-shadow: inset 2px 2px 4px var(--dark-shadow), inset -2px -2px 4px var(--light-shadow);
}
```

- [ ] **Step 3: Update Scrollbar & Empty State**
Add styles for custom scrollbar and empty state in `public/popup.html`.

```css
#tabList {
  margin-top: 24px;
  max-height: 350px;
  overflow-y: auto;
  padding: 4px;
}

#tabList::-webkit-scrollbar {
  width: 4px;
}

#tabList::-webkit-scrollbar-thumb {
  background: var(--dark-shadow);
  border-radius: 10px;
}

.empty-state {
  margin-top: 24px;
  padding: 32px;
  text-align: center;
  color: var(--text-secondary);
  box-shadow: var(--shadow-inset);
  border-radius: var(--radius-main);
  font-size: 13px;
}
```

- [ ] **Step 4: Commit Component Styles**

```bash
git add public/popup.html
git commit -m "style: implement neumorphic buttons, cards, and list components"
```

### Task 3: Logic & Animation Integration

**Files:**
- Modify: `src/popup/popup.ts`

- [ ] **Step 1: Implement Delete Animation**
Update `displayTabs` function in `src/popup/popup.ts` to add a "sink" effect when deleting.

```typescript
// Replace part of displayTabs where delButton is created
delButton.addEventListener("click", () => {
  item.style.transform = "scale(0.95)";
  item.style.opacity = "0";
  setTimeout(() => {
    if (tabList.contains(item)) tabList.removeChild(item);
    if (tabList.children.length === 0) displayTabs([]);
  }, 200);
});
```

- [ ] **Step 2: Update UI Logic for Empty State**
Ensure `displayTabs` uses the new `empty-state` class correctly.

```typescript
function displayTabs(tabs: TabData[]) {
  tabList.innerHTML = "";
  if (tabs.length === 0) {
    tabList.innerHTML = '<div class="empty-state">Your dashboard is clear</div>';
    openButton.disabled = true;
    if (!document.body.contains(tabList)) document.body.appendChild(tabList);
    return;
  }
  // ... rest of implementation (rebuilding list)
}
```

- [ ] **Step 3: Verify Build**
Run: `bun run build`
Expected: Success.

- [ ] **Step 4: Commit Logic Changes**

```bash
git add src/popup/popup.ts
git commit -m "feat: integrate neumorphic animations and update UI logic"
```
