const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dictionaryAPI", {
  lookupWord: (word) => ipcRenderer.send("lookup-word", word),
  onResponse: (callback) =>
    ipcRenderer.on("dictionary-response", (event, response) =>
      callback(response)
    ),
  onConnectionStatus: (callback) =>
    ipcRenderer.on("connection-status", (event, status) => callback(status)),
  onConnectionError: (callback) =>
    ipcRenderer.on("connection-error", (event, error) => callback(error)),
  onConnectionClosed: (callback) =>
    ipcRenderer.on("connection-closed", (event) => callback()),
});
