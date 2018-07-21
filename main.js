const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");

function createMainWindow() {
    let win = null;
    let windowOptions = {
        width: 800,
        height: 600
    };
    win = new BrowserWindow(windowOptions);
    win.loadURL(path.join('file://', __dirname, 'main.html'));
    win.on('close', () => {
        win = null;
    });
    win.webContents.openDevTools();

}
app.on("ready", createMainWindow);
app.on("window-all-closed", () => {
    app.quit;
});