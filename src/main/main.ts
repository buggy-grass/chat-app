import { app, BrowserWindow, ipcMain, Menu } from "electron";
import * as path from "path";
import * as url from "url";
import { enable, initialize } from "@electron/remote/main";

initialize();
let mainWindow: Electron.BrowserWindow | null;

if (process.env.NODE_ENV === "development") {
  // Menu.setApplicationMenu(menu);
} else {
  const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] =
    [];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 700,
    frame: false,
    backgroundColor: "#f2f2f2",
    icon: path.join(__dirname, "..", "src", "assets", "images", "favicon.ico"),
    title: "Mecord",
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      devTools: process.env.NODE_ENV !== "production",
      webSecurity: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:4000");
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "renderer/index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow?.webContents.send(
      "getAppPath",
      app.getAppPath(),
      app.getPath("userData")
    );
    if (mainWindow?.webContents) {
      enable(mainWindow.webContents);
    }
  });

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow?.webContents.send("app-close");
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.commandLine.appendSwitch("force_high_performance_gpu");
app.commandLine.appendSwitch("js-flags", "--max-old-space-size=24096");

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("toggle-fullscreen", () => {
  if (mainWindow) {
    const isFullScreen = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFullScreen);
  }
});

ipcMain.on("window-title-bar-controller", (event, data) => {
  switch (data) {
    case "minimize":
      mainWindow?.minimize();
      break;
    case "maximize":
      mainWindow?.maximize();
      break;
    case "exit":
      app.exit();
      break;
  }
});
