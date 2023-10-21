let currentURL = window.location.href;

function checkURLChange() {
  if (window.location.href !== currentURL) {
    currentURL = window.location.href;
    chrome.runtime.sendMessage({ urlChanged: true, url: currentURL });
  }
}

// Check for URL changes every second
setInterval(checkURLChange, 1000);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'processText') {
    const userInput = message.text;
    console.log('Text received in content script:', userInput);
    
    // Process the text and interact with the webpage
    const result = fillTextInPage(userInput);
    
    // Log the result
    console.log(result);

    // Respond back if necessary
    sendResponse(result);
  }
});

function fillTextInPage(text) {
  const elementSelector = 'span.nicknamevalue';
  const element = document.querySelector(elementSelector);
  if (element) {
    element.textContent = text;
    return { success: true };
  } else {
    return { success: false, error: 'Element not found' };
  }
}
