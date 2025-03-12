//THIS IS NO LONGER USED, USE content.js as its embedded into the website



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

    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
  
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
          sendDataToServer(userInput);
        }
      });
    });

    sendDataToServer(userInput, id);
  }
  


  //When a space on the webpage gets called, 
  //BNkUdtpEkPz79bYTvck8-pokemon
  //is what is used when clicking on a pokemon, this request has to be sent before 
  
  function sendDataToServer(userInput) {
    const url = 'https://rk9.gg/teamlist/update';
    const data = {
      id: id,
      value: userInput  // Replace with the actual value you want to send
    };
  
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    // Add any other necessary headers here
  
    // Convert the data object to URL-encoded string
    const formData = new URLSearchParams(data).toString();
  
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData,
      credentials: 'include'  // Include cookies in the request
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.text();  // or response.json() if the server responds with JSON
    })
    .then(data => {
      console.log('Server Response:', data);
    })
    .catch((error) => {
      console.error('Error sending data to server:', error);
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
  
    function triggerClickAndFocusOut(element, textContent) {
      element.click();
      element.textContent = textContent;
      element.dispatchEvent(new Event('focusout'));
    }
  
    try {
      const { level, nickname } = parseUserInput(text);
      const levelElement = document.querySelector('span.statvalue');
      const nicknameElement = document.querySelector('span.nicknamevalue');
  
      if (levelElement) {
        triggerClickAndFocusOut(levelElement, level);
      } else {
        return { success: false, error: 'Level element not found' };
      }
  
      if (nickname && nicknameElement) {
        triggerClickAndFocusOut(nicknameElement, nickname);
      }
  
      return { success: true };
    } catch (error) {
      console.error('Error in fillTextInPage:', error);
      return { success: false, error: error.message };
    }
  }
  
  function sendDataToServer(userInput, id) {
    const url = 'https://rk9.gg/teamlist/update';
    const data = {
      id: id,
      value: userInput  // Replace with the actual value you want to send
    };
  
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    // Add any other necessary headers here
  
    // Convert the data object to URL-encoded string
    const formData = new URLSearchParams(data).toString();
  
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData,
      credentials: 'include'  // Include cookies in the request
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.text();  // or response.json() if the server responds with JSON
    })
    .then(data => {
      console.log('Server Response:', data);
    })
    .catch((error) => {
      console.error('Error sending data to server:', error);
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
  
    function triggerClickAndFocusOut(element, textContent) {
      element.click();
      element.textContent = textContent;
      element.dispatchEvent(new Event('focusout'));
    }
  
    try {
      const { level, nickname } = parseUserInput(text);
      const levelElement = document.querySelector('span.statvalue');
      const nicknameElement = document.querySelector('span.nicknamevalue');
  
      if (levelElement) {
        triggerClickAndFocusOut(levelElement, level);
      } else {
        return { success: false, error: 'Level element not found' };
      }
  
      if (nickname && nicknameElement) {
        triggerClickAndFocusOut(nicknameElement, nickname);
      }
  
      return { success: true };
    } catch (error) {
      console.error('Error in fillTextInPage:', error);
      return { success: false, error: error.message };
    }
  }
  