const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.disableHardwareAcceleration();

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false, 
            nodeIntegration: false // Keep disabled for security
        }
    });
    

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
