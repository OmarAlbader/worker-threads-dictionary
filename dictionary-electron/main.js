const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const net = require("net");

let mainWindow;
let client;

// TODO Remove these comments

function createWindow() {
  // createWindow: Defines and opens the app window:
  mainWindow = new BrowserWindow({
    width: 800, // Size: 800x600 pixels.
    height: 600,
    icon: "./assets/icons/chat_bubble.ico",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // preload: Links to preload.js to expose APIs to the UI.
      nodeIntegration: false, // nodeIntegration: false: Prevents direct Node.js access in the UI.
      contextIsolation: true, // contextIsolation: true: Keeps the renderer process (UI) isolated from Node.js for security.
    },
  });

  mainWindow.loadFile("index.html"); // loadFile: Loads index.html as the UI.

  //* Add this line to automatically open DevTools
  //   mainWindow.webContents.openDevTools({ mode: "detach" });   //* Open in a separate window
  //   mainWindow.webContents.openDevTools({ mode: 'right' });   //* Open docked to the right
  //   mainWindow.webContents.openDevTools({ mode: 'bottom' }); //* Open docked to the bottom

  //* Handle window reload via keyboard shortcuts or menu
  //   mainWindow.on("ready-to-show", () => {
  //     mainWindow.webContents.on("devtools-reload-page", () => {
  //       console.log("DevTools triggered reload - reconnecting to server");
  //       connectToServer();
  //     });
  //   });
}

function connectToServer() {
  // Close existing connection if it exists
  if (client && !client.destroyed) {
    client.destroy();
  }

  // Create new socket
  client = new net.Socket();

  // Set up event handlers
  client.on("data", (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(
        "dictionary-response",
        data.toString().trim()
      );
    }
  });

  client.on("error", (err) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("connection-error", err.message);
    }
  });

  client.on("close", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("connection-closed");
    }
  });

  // Connect to server
  client.connect(4000, "localhost", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("connection-status", "Connected to server");
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Listen for window reload events
  mainWindow.webContents.on("did-finish-load", () => {
    console.log("Window loaded/reloaded - reconnecting to server");
    connectToServer();
  });

  // Initial connection
  connectToServer();

  // Optional: Add a menu item for manual reconnection
  const menu = Menu.buildFromTemplate([
    {
      label: "Connection",
      submenu: [
        {
          label: "Reconnect to Server",
          click: () => {
            connectToServer();
            mainWindow.webContents.send(
              "connection-status",
              "Reconnecting to server..."
            );
          },
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
});

// Handle word lookup requests from the renderer
ipcMain.on("lookup-word", (event, word) => {
  if (client && !client.destroyed) {
    client.write(word);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }

  if (client && !client.destroyed) {
    client.destroy();
    client = null;
  }
});
