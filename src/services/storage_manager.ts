export default class StorageManager {
  private static STORAGE_KEY = 'savedTabs';

  // Save tabs to local storage
  static async handleSaveTabs(
    tabs: TabData[],
    sendResponse: (response: SaveResponse) => void
  ) {
    try {
      if (!tabs || tabs.length === 0) {
        sendResponse({ success: false, message: 'No tabs to save' });
        return;
      }

      await chrome.storage.local.set({ [this.STORAGE_KEY]: tabs });
      console.log(`Saved ${tabs.length} tabs to storage`);
      sendResponse({ success: true });
    } catch (error) {
      console.error('Error saving tabs:', error);
      sendResponse({
        success: false,
        message: `Failed to save tabs: ${(error as Error).message}`,
      });
    }
  }

  // Load tabs from local storage
  static async handleLoadTabs(
    sendResponse: (response: LoadResponse) => void
  ) {
    try {
      const result = await chrome.storage.local.get([this.STORAGE_KEY]);
      const tabs = result[this.STORAGE_KEY] as TabData[] | undefined;

      if (!tabs || tabs.length === 0) {
        sendResponse({ success: true, tabs: [] });
        return;
      }

      console.log(`Loaded ${tabs.length} tabs from storage`);
      sendResponse({ success: true, tabs });
    } catch (error) {
      console.error('Error loading tabs:', error);
      sendResponse({
        success: false,
        message: `Failed to load tabs: ${(error as Error).message}`,
      });
    }
  }

  // Export tabs into .json file
  static async handleExportTabs(
    sendResponse: (response: ExportResponse) => void
  ) {
    try {
      const result = await chrome.storage.local.get([this.STORAGE_KEY]);
      const tabs = result[this.STORAGE_KEY] as TabData[] | undefined;

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

  // Placeholder for import logic
  static async handleImportTabs(
    _tabs: TabData[],
    sendResponse: (response: SaveResponse) => void
  ) {
    // To be implemented
    sendResponse({ success: false, message: 'Import not yet implemented' });
  }
}
