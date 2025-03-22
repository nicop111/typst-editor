const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

const getFolderStructure = (folderPath) => {
    const items = fs.readdirSync(folderPath, { withFileTypes: true });
    return items.map(item => ({
        name: item.name,
        type: item.isDirectory() ? 'folder' : 'file',
        path: path.join(folderPath, item.name),
        children: item.isDirectory() ? getFolderStructure(path.join(folderPath, item.name)) : undefined
    }));
};

app.disableHardwareAcceleration();

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open Folder',
                    click: async () => {
                        const result = await dialog.showOpenDialog(mainWindow, {
                            properties: ['openDirectory']
                        });
                        if (!result.canceled && result.filePaths.length > 0) {
                            const folderStructure = getFolderStructure(result.filePaths[0]);
                            mainWindow.webContents.send('folder-selected', folderStructure);
                        }
                    }
                },
                { role: 'quit' }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);
});

ipcMain.handle('open-file', async (_, filePath) => {
    return fs.readFileSync(filePath, 'utf-8');
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
