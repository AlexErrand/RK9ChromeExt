const muteCheckbox = document.getElementById('muteAudio');

chrome.storage.local.get('muteAudio', (result) => {
    muteCheckbox.checked = !!result.muteAudio;
});

muteCheckbox.addEventListener('change', (event) => {
    const isMuted = event.target.checked;
    chrome.storage.local.set({ muteAudio: isMuted });
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
                type: 'MUTE_CHANGED',
                isMuted
            }).catch(() => {
                // Silently catch errors from tabs that don't have the content script
            });
        });
    });
});
