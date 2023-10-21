const rk9PagePrefix = "https://rk9.gg/teamlist/editor/";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  updateBadge(tab);
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  updateBadge(tab);
});

chrome.runtime.onInstalled.addListener(() => {
  updateBadgeForCurrentTab();
});

chrome.runtime.onStartup.addListener(() => {
  updateBadgeForCurrentTab();
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.urlChanged) {
    updateBadge({id: sender.tab.id, url: message.url});
  }
});

async function updateBadgeForCurrentTab() {
  const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  updateBadge(currentTab);
}

function updateBadge(tab) {
  if (tab && tab.url && tab.url.startsWith(rk9PagePrefix)) {
    chrome.action.setBadgeText({ text: 'ON', tabId: tab.id });
    chrome.action.enable(tab.id);
  } else {
    chrome.action.setBadgeText({ text: 'OFF', tabId: tab.id });
    chrome.action.disable(tab.id);
  }
}
