document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
      submitButton.addEventListener('click', processText);
    } else {
      console.error('Submit button not found!');
    }
  });
  
  function processText() {
    const userInput = document.getElementById('userInput').value;
    const output = document.getElementById('output');
  
    output.textContent = 'Status: Processing...';
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: fillTextInPage,
        args: [userInput],
      }, (results) => {
        if (chrome.runtime.lastError || !results || results[0].result.success === false) {
          output.textContent = 'Status: Failed to update text on the page.';
          console.error('Error:', chrome.runtime.lastError || results[0].result.error);
        } else {
          output.textContent = 'Status: Text updated successfully!';
        }
      });
    });
  }
  
  function fillTextInPage(text) {
    function parseUserInput(text) {
      // Extract the level from the text, default to 100 if not present
      const levelMatch = text.match(/Level:\s*(\d+)/i);
      const level = levelMatch ? levelMatch[1] : '100';
  
      // Extract the nickname from the text, if present
      const nicknameMatch = text.match(/^(.*?)\s*\(/);
      const nickname = nicknameMatch ? nicknameMatch[1] : null;
  
      return { level, nickname };
    }
  
    try {
      const { level, nickname } = parseUserInput(text);
      const levelElement = document.querySelector('span.statvalue');
      const nicknameElement = document.querySelector('span.nicknamevalue');
  
      if (levelElement) {
        levelElement.textContent = level;
      } else {
        return { success: false, error: 'Level element not found' };
      }
  
      if (nickname && nicknameElement) {
        nicknameElement.textContent = nickname;
      }
  
      return { success: true };
    } catch (error) {
      console.error('Error in fillTextInPage:', error);
      return { success: false, error: error.message };
    }
  }
  
  