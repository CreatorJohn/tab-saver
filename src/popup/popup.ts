import { sendMessage } from "../helpers";
import TabManager from "../services/tab_manager";

// DOM elements
const saveButton = document.getElementById('saveButton') as HTMLButtonElement;
const loadButton = document.getElementById('loadButton') as HTMLButtonElement;
const openButton = document.getElementById('openButton') as HTMLButtonElement;
const exportButton = document.getElementById('exportButton') as HTMLButtonElement;
const messageContainer = document.getElementById('messageContainer') as HTMLDivElement;
const tabList = document.createElement("div")

tabList.id = "tabList"

let loadedTabs: TabData[] = [];

// Show message to user
function showMessage(text: string, type: 'success' | 'error') {
  messageContainer.innerHTML = `<div class="message ${type}">${text}</div>`;
  
  setTimeout(() => {
    messageContainer.innerHTML = '';
  }, 3000);
}

// Display tabs in the UI
function displayTabs(tabs: TabData[]) {
  tabList.innerHTML = "";

  if (tabs.length === 0) {
    tabList.innerHTML = '<div class="empty-state">Your dashboard is clear</div>';
    openButton.disabled = true;
    if (!document.body.contains(tabList)) document.body.appendChild(tabList);
    return;
  }
  
  tabs.forEach(tab => {
    const item = document.createElement("div");
    item.classList.add("tab-item");

    const info = document.createElement("div");
    info.classList.add("tab-info");

    const title = document.createElement("div");
    title.classList.add("tab-title");
    title.textContent = tab.title;

    info.appendChild(title);

    const url = document.createElement("div");
    url.classList.add("tab-url");
    url.textContent = tab.url;

    info.appendChild(url);

    const delButton = document.createElement("button");
    delButton.classList.add("delButton");
    delButton.addEventListener("click", () => {
      item.style.transform = "scale(0.95)";
      item.style.opacity = "0";
      setTimeout(() => {
        if (tabList.contains(item)) tabList.removeChild(item);
        if (tabList.children.length === 0) displayTabs([]);
      }, 200);
    });

    const delIcon = document.createElement("img");
    delIcon.src = "icons/trash-icon.svg";
    delIcon.style.color = "red";
    delIcon.setAttribute("width", "16px");
    delIcon.setAttribute("height", "16px");

    delButton.appendChild(delIcon);

    item.appendChild(info);
    item.appendChild(delButton);
    tabList.appendChild(item);
  });

  document.body.appendChild(tabList);
  
  openButton.disabled = false;
}

function hideTabs() { if (document.body.contains(tabList)) document.body.removeChild(tabList) }

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Save current tabs
saveButton.addEventListener('click', async () => {
  try {
    saveButton.disabled = true;
    hideTabs();
    
    // Get all tabs in current window using TabManager
    const tabData = await TabManager.getCurrentTabs();
    
    // Send message to background script
    const response = await sendMessage<SaveTabsMessage, SaveResponse>({
      action: 'saveTabs',
      tabs: tabData
    });
    
    if (response.success) {
      showMessage(`Successfully saved ${tabData.length} tabs!`, 'success');
    } else {
      showMessage(response.message || 'Failed to save tabs', 'error');
    }
  } catch (error) {
    console.error('Error saving tabs:', error);
    showMessage('Error saving tabs', 'error');
  } finally {
    saveButton.disabled = false;
  }
});

// Load saved tabs
loadButton.addEventListener('click', async () => {
  try {
    loadButton.disabled = true;
    hideTabs();
    
    // Send message to background script
    const response = await sendMessage<LoadTabsMessage, LoadResponse>({
      action: 'loadTabs'
    });
    
    if (response.success) {
      loadedTabs = response.tabs;
      displayTabs(loadedTabs);
      showMessage(`Loaded ${loadedTabs.length} saved tabs`, 'success');
    } else {
      showMessage(response.message ?? 'Failed to load tabs', 'error');
      displayTabs([]);
    }
  } catch (error) {
    alert(`Error loading tabs: ${error}`);
    showMessage('Error loading tabs', 'error');
  } finally {
    loadButton.disabled = false;
  }
});

// Open loaded tabs
openButton.addEventListener('click', async () => {
  if (loadedTabs.length === 0) {
    showMessage('No tabs to open', 'error');
    return;
  }
  
  try {
    openButton.disabled = true;
    hideTabs();
    
    // Send message to background script
    const response = await sendMessage<OpenTabsMessage, OpenResponse>({
      action: 'openTabs',
      tabs: loadedTabs
    });
    
    if (response.success) {
      showMessage('Tabs opened successfully!', 'success');
      // Close the popup after a short delay
      setTimeout(() => window.close(), 1000);
    } else {
      showMessage(response.message || 'Failed to open tabs', 'error');
      openButton.disabled = false;
    }
  } catch (error) {
    console.error('Error opening tabs:', error);
    showMessage('Error opening tabs', 'error');
    openButton.disabled = false;
  }
});

// Export tabs
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