export default class TabManager {
  // Get all tabs in the current window
  static async getCurrentTabs(): Promise<TabData[]> {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    return tabs
      .filter((tab) => tab.id !== undefined && tab.url && tab.title)
      .map((tab) => ({
        id: tab.id!,
        title: tab.title!,
        url: tab.url!,
      }));
  }

  // Open tabs (close current tabs and open saved ones)
  static async handleOpenTabs(
    tabs: TabData[],
    sendResponse: (response: OpenResponse) => void
  ) {
    try {
      if (!tabs || tabs.length === 0) {
        sendResponse({ success: false, message: 'No tabs to open' });
        return;
      }

      // Get all tabs in current window
      const currentTabs = await chrome.tabs.query({ currentWindow: true });

      // Close all current tabs except the first one (we'll reuse it)
      const tabsToClose = currentTabs.filter((tab) => tab.id !== undefined);

      // Open the first saved tab in the current tab (if exists)
      if (tabsToClose.length > 0 && tabsToClose[0].id !== undefined) {
        await chrome.tabs.update(tabsToClose[0].id, { url: tabs[0].url });
      }

      // Close remaining tabs
      const idsToClose = tabsToClose
        .slice(1)
        .map((tab) => tab.id)
        .filter((id): id is number => id !== undefined);

      if (idsToClose.length > 0) {
        await chrome.tabs.remove(idsToClose);
      }

      // Open remaining saved tabs
      for (let i = 1; i < tabs.length; i++) {
        await chrome.tabs.create({ url: tabs[i].url });
      }

      console.log(`Opened ${tabs.length} tabs`);
      sendResponse({ success: true });
    } catch (error) {
      console.error('Error opening tabs:', error);
      sendResponse({
        success: false,
        message: `Failed to open tabs: ${(error as Error).message}`,
      });
    }
  }
}
