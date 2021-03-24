import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import IpcEvents from '../../common/ipc-events';
import DataProcessStatus from '../../common/data-process-status'
import path from 'path';
import { URL } from 'url';
import executeProcess from '../../process.js';

const isDevelopment = process.env['MODE'] === 'development';

let mainWindow: BrowserWindow;

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '../../preload/dist/index.cjs'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    const pageUrl = isDevelopment ? process.env['VITE_DEV_SERVER_URL'] : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

    window.loadURL(pageUrl || '');
    window.setMenuBarVisibility(false);
    if (isDevelopment) {
        window.webContents.openDevTools()
    }

    return window;
}

app.whenReady().then(() => {
    mainWindow = createWindow();

    app.on('activate', () => {
        if(mainWindow == null) {
            mainWindow = createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on(IpcEvents.REQUEST_SHOW_OPEN_DIALOG, (event) => {
    dialog.showOpenDialog({ properties: ['openFile']}).then(file => {
        event.sender.send(IpcEvents.RESPONSE_SHOW_OPEN_DIALOG, file);
    });
});

ipcMain.on(IpcEvents.REQUEST_PATH_BASENAME, (event, args) => {
    event.sender.send(IpcEvents.RESPONSE_PATH_BASENAME, path.basename(args));
});

ipcMain.once(IpcEvents.REQUEST_START_DATA_PROCESSING, async (event, args) => {
    try {
        await executeProcess(args);
        event.sender.send(IpcEvents.RESPONSE_FINISHED_DATA_PROCESSING, { status: DataProcessStatus.Ok });
    } catch (e) {
        console.log(e);
        event.sender.send(IpcEvents.RESPONSE_FINISHED_DATA_PROCESSING, { status: DataProcessStatus.Error, error: e});
    }
});