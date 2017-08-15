import { app, BrowserWindow, ipcMain } from 'electron';
import { client } from 'electron-connect';
import * as path from 'path';

let applicationRef: Electron.BrowserWindow = null;

const debugMode = true;

let wpi;

const pressed = {};

const mainWindowSettings: Electron.BrowserWindowConstructorOptions = {
    width: 320,
    height: 240,
    fullscreen: true,
    frame: false,
    resizable: false,
    kiosk: true,
};

function initMainListener() {
    ipcMain.on('ELECTRON_BRIDGE_HOST', (event, msg) => {

    });
}

function createWindow() {
    if (debugMode) {
        mainWindowSettings.frame = true;
        mainWindowSettings.fullscreen = false;
    }
    applicationRef = new BrowserWindow(mainWindowSettings);
    applicationRef.loadURL(`file:///${__dirname}/index.html`);
    if (debugMode) {
        // Open the DevTools.
        applicationRef.webContents.openDevTools({ mode: 'detach' });
    }
    applicationRef.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        applicationRef = null;
    });

    initMainListener();

    client.create(applicationRef);

    setupGPIO();
}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // TODO perhaps hook this and wait for message bus before quitting?
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (applicationRef === null) {
        createWindow();
    }
});

function setupGPIO() {
    if (!debugMode) {
        wpi = require('wiring-pi');

        wpi.setup('wpi');

        wpi.pinMode(17, wpi.INPUT);
        wpi.pullUpDnControl(17, wpi.PUD_UP);
        wpi.wiringPiISR(7, wpi.INT_EDGE_FALLING, function (delta) {
            buttonDown(7);
        });
        wpi.wiringPiISR(7, wpi.INT_EDGE_RISING, function (delta) {
            buttonUp(7);
        });

        wpi.pinMode(22, wpi.INPUT);
        wpi.pullUpDnControl(22, wpi.PUD_UP);
        wpi.wiringPiISR(22, wpi.INT_EDGE_FALLING, function (delta) {
            buttonDown(22);
        });
        wpi.wiringPiISR(22, wpi.INT_EDGE_RISING, function (delta) {
            buttonUp(22);
        });

        wpi.pinMode(23, wpi.INPUT);
        wpi.pullUpDnControl(23, wpi.PUD_UP);
        wpi.wiringPiISR(23, wpi.INT_EDGE_FALLING, function (delta) {
            buttonDown(23);
        });
        wpi.wiringPiISR(23, wpi.INT_EDGE_RISING, function (delta) {
            buttonUp(23);
        });

        wpi.pinMode(27, wpi.INPUT);
        wpi.pullUpDnControl(27, wpi.PUD_UP);
        wpi.wiringPiISR(27, wpi.INT_EDGE_FALLING, function (delta) {
            buttonDown(27);
        });
        wpi.wiringPiISR(27, wpi.INT_EDGE_RISING, function (delta) {
            buttonUp(27);
        });
    }
}

function buttonDown(buttonNum) {
    console.log('Button DOWN: ' + buttonNum);
    if (pressed[buttonNum]) { return; }
    pressed[buttonNum] = new Date().getTime();
}

function buttonUp(buttonNum) {
    if (!pressed[buttonNum]) { return; }
    const duration = (new Date().getTime() - pressed[buttonNum]);

    ipcMain.emit('ELECTRON_BRIDGE_CLIENT', { buttonNum: buttonNum, duration: duration });
}
