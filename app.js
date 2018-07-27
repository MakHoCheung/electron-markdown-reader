const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
let win = null;
function createMainWindow() {
    let windowOptions = {
        width: 1100,
        height: 800
    };
    win = new BrowserWindow(windowOptions);
    win.loadURL(path.join('file://', __dirname, 'main.html'));
    win.on('close', () => {
        win = null;
    });
    win.webContents.openDevTools();
    win.setTitle('Laurel MarkDown Reader');
    win.setMenu(null);

}
app.on("ready", createMainWindow);
app.on("window-all-closed", () => {
    app.quit();
});