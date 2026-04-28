# Neumorphic Popup Redesign Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Popup to Neumorphic interface.

**Architecture:**
- CSS vars for shadows/colors.
- 3D effect buttons/cards.
- Transitions for "pressing" feedback.
- Update `popup.ts` UI logic.

**Tech Stack:** HTML, CSS, TypeScript.

---

### Task 1: CSS Foundations

**Files:**
- Modify: `public/popup.html`

- [ ] **Step 1: Define Variables**

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

- [ ] **Step 2: Update Body**

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

- [ ] **Step 3: Commit**

```bash
git add public/popup.html
git commit -m "style: define neumorphic variables and base body styles"
```

### Task 2: Neumorphic Components

**Files:**
- Modify: `public/popup.html`

- [ ] **Step 1: Buttons**

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
  box-shadow: none;
}
#saveButton { color: var(--accent); }
#loadButton { color: #10b981; }
#openButton { color: #f59e0b; }
#exportButton { color: #6366f1; }
```

- [ ] **Step 2: Cards**

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
  transition: var(--transition);
}
.tab-title { font-weight: 600; margin-bottom: 2px; }
.tab-url { font-size: 11px; color: var(--text-secondary); }
.delButton {
  background: none; border: none; padding: 8px; border-radius: 50%;
  box-shadow: 4px 4px 8px var(--dark-shadow), -4px -4px 8px var(--light-shadow);
}
.delButton:active { box-shadow: inset 2px 2px 4px var(--dark-shadow); }
```

- [ ] **Step 3: List & Empty State**

```css
#tabList {
  margin-top: 24px; max-height: 350px; overflow-y: auto; padding: 4px;
}
#tabList::-webkit-scrollbar { width: 4px; }
#tabList::-webkit-scrollbar-thumb { background: var(--dark-shadow); border-radius: 10px; }
.empty-state {
  margin-top: 24px; padding: 32px; text-align: center;
  box-shadow: var(--shadow-inset); border-radius: var(--radius-main);
}
```

- [ ] **Step 4: Commit**

```bash
git add public/popup.html
git commit -m "style: implement neumorphic components"
```

### Task 3: Logic

**Files:**
- Modify: `src/popup/popup.ts`

- [ ] **Step 1: Delete Animation**

```typescript
delButton.addEventListener("click", () => {
  item.style.transform = "scale(0.95)";
  item.style.opacity = "0";
  setTimeout(() => {
    if (tabList.contains(item)) tabList.removeChild(item);
    if (tabList.children.length === 0) displayTabs([]);
  }, 200);
});
```

- [ ] **Step 2: Empty State**

```typescript
function displayTabs(tabs: TabData[]) {
  tabList.innerHTML = "";
  if (tabs.length === 0) {
    tabList.innerHTML = '<div class="empty-state">Your dashboard is clear</div>';
    openButton.disabled = true;
    if (!document.body.contains(tabList)) document.body.appendChild(tabList);
    return;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/popup/popup.ts
git commit -m "feat: logic for neumorphic animations"
```
