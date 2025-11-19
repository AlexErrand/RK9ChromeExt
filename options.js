document.getElementById("saveBtn").addEventListener("click", function () {
  const url = document.getElementById("sheetUrl").value;
  chrome.storage.sync.set({ replaySheetUrl: url }, function () {
    document.getElementById("status").textContent = "Sheet URL saved successfully!";
  });
});
