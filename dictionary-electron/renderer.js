// DOM Elements
const wordInput = document.getElementById("word-input");
const lookupBtn = document.getElementById("lookup-btn");
const resultDiv = document.getElementById("result");
const statusDiv = document.getElementById("connection-status");

// Set up event listeners
lookupBtn.addEventListener("click", lookupWord);
const handleKeyPress = (e) => {
  if (e.key === "Enter") lookupWord();
};
wordInput.addEventListener("keypress", handleKeyPress);

// Function to lookup word
function lookupWord() {
  const word = wordInput.value.trim();
  if (word) {
    lookupBtn.disabled = true;
    wordInput.removeEventListener("keypress", handleKeyPress);
    lookupBtn.textContent = "Looking up...";
    resultDiv.textContent = "Searching...";
    window.dictionaryAPI.lookupWord(word);
  }
}

// Handle responses from the main process
window.dictionaryAPI.onResponse((response) => {
  resultDiv.textContent = response;
  lookupBtn.disabled = false;
  lookupBtn.textContent = "Lookup";
  // Add the event listener back
  wordInput.addEventListener("keypress", handleKeyPress);
});

window.dictionaryAPI.onConnectionStatus((status) => {
  statusDiv.textContent = status;
  statusDiv.className = "status connected";
  lookupBtn.disabled = false;
});

window.dictionaryAPI.onConnectionError((error) => {
  statusDiv.textContent = `Error: ${error}`;
  statusDiv.className = "status error";
  lookupBtn.disabled = true;
  // Add the event listener back
  wordInput.addEventListener("keypress", handleKeyPress);
});

window.dictionaryAPI.onConnectionClosed(() => {
  statusDiv.textContent = "Disconnected from server";
  statusDiv.className = "status error";
  lookupBtn.disabled = true;
  // Add the event listener back
  wordInput.addEventListener("keypress", handleKeyPress);
});
