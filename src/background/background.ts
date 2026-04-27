import "./hot-reload";
import TabManager from "./tab_manager";

const STORAGE_KEY = 'savedTabs';

async function handleExportTabs(sendResponse: (response: ExportResponse) => void) {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEY]);
    const tabs = result[STORAGE_KEY] as TabData[] | undefined;

    if (!tabs || tabs.length === 0) {
      sendResponse({ success: false }); 
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

// Listen for messages from popup
chrome.runtime.onMessage.addListener(
  (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    if (message.action === 'exportTabs') {
      handleExportTabs(sendResponse);
      return true;
    }

    TabManager.handleAction(message, sendResponse);

    return true
  }
);

// Log when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Manager extension installed');
});