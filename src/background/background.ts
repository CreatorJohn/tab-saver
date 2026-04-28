import "./hot-reload";
import TabManager from "../services/tab_manager";
import StorageManager from "../services/storage_manager";

// Listen for messages from popup
chrome.runtime.onMessage.addListener(
  (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    switch (message.action) {
      case 'saveTabs':
        StorageManager.handleSaveTabs(message.tabs, sendResponse);
        break;
      case 'loadTabs':
        StorageManager.handleLoadTabs(sendResponse);
        break;
      case 'exportTabs':
        StorageManager.handleExportTabs(sendResponse);
        break;
      case 'openTabs':
        TabManager.handleOpenTabs(message.tabs, sendResponse);
        break;
      default:
        return false;
    }

    return true; // Keep channel open for async response
  }
);

// Log when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Manager extension installed');
});
