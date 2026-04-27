import "./hot-reload";
import { sendNotification } from "../helpers";

const STORAGE_KEY = 'savedTabs';

// Listen for messages from popup
chrome.runtime.onMessage.addListener(
  (
    request: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: SaveResponse | LoadResponse) => void
  ) => {
    if (request.action === 'saveTabs') {
      handleSaveTabs(request.tabs ?? [], sendResponse);
      return true; // Keep channel open for async response
    }
    
    if (request.action === 'loadTabs') {
      handleLoadTabs(sendResponse);
      return true;
    }
    
    if (request.action === 'openTabs') {
      handleOpenTabs(request.tabs ?? [], sendResponse);
      return true;
    }
    
    return false;
  }
);

// Save tabs to local storage
async function handleSaveTabs(
  tabs: TabData[],
  sendResponse: (response: SaveResponse) => void
) {
  try {
    if (!tabs || tabs.length === 0) {
      sendResponse({ success: false, message: 'No tabs to save' });
      return;
    }
    
    // Save to chrome.storage.local
    await chrome.storage.local.set({ [STORAGE_KEY]: tabs });

    await sendNotification("tabs-saved")("Tabs Saver - Tabs saved", `Saved ${tabs.length} tabs to storage`, 3000)
    
    console.log(`Saved ${tabs.length} tabs to storage`);
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error saving tabs:', error);
    sendResponse({
      success: false,
      message: `Failed to save tabs: ${(error as Error).message}`
    });
  }
}

// Load tabs from local storage
async function handleLoadTabs(
  sendResponse: (response: LoadResponse) => void
) {
  try {
    // Fetch from chrome.storage.local
    const result = await chrome.storage.local.get([STORAGE_KEY]);
    const tabs = result[STORAGE_KEY] as TabData[] | undefined;
    
    if (!tabs || tabs.length === 0) {
      sendResponse({ success: true, tabs: [] });
      return;
    }

    await sendNotification("tabs-loaded")("Tabs Saver - Tabs loaded", `Loaded ${tabs.length} tabs from storage`, 3000)
    
    console.log(`Loaded ${tabs.length} tabs from storage`);
    sendResponse({ success: true, tabs });
  } catch (error) {
    console.error('Error loading tabs:', error);
    sendResponse({
      success: false,
      message: `Failed to load tabs: ${(error as Error).message}`
    });
  }
}

// Open tabs (close current tabs and open saved ones)
async function handleOpenTabs(
  tabs: TabData[],
  sendResponse: (response: SaveResponse) => void
) {
  try {
    if (!tabs || tabs.length === 0) {
      sendResponse({ success: false, message: 'No tabs to open' });
      return;
    }
    
    // Get all tabs in current window
    const currentTabs = await chrome.tabs.query({ currentWindow: true });
    
    // Close all current tabs except the first one (we'll reuse it)
    const tabsToClose = currentTabs.filter(tab => tab.id !== undefined);
    
    // Open the first saved tab in the current tab (if exists)
    if (tabsToClose.length > 0 && tabsToClose[0].id !== undefined) {
      await chrome.tabs.update(tabsToClose[0].id, { url: tabs[0].url });
    }
    
    // Close remaining tabs
    const idsToClose = tabsToClose
      .slice(1)
      .map(tab => tab.id)
      .filter((id): id is number => id !== undefined);
    
    if (idsToClose.length > 0) {
      await chrome.tabs.remove(idsToClose);
    }
    
    // Open remaining saved tabs
    for (let i = 1; i < tabs.length; i++) {
      await chrome.tabs.create({ url: tabs[i].url });
    }

    await sendNotification("tabs-opened")("Tabs Saver - Tabs opened", `Opened ${tabs.length} tabs`, 3000)
    
    console.log(`Opened ${tabs.length} tabs`);
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error opening tabs:', error);
    sendResponse({
      success: false,
      message: `Failed to open tabs: ${(error as Error).message}`
    });
  }
}

// Log when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Manager extension installed');
});