const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    onFolderSelected: (callback) => ipcRenderer.on('folder-selected', (_, folderStructure) => callback(folderStructure)),
    openFile: (filePath) => ipcRenderer.invoke('open-file', filePath)
});
