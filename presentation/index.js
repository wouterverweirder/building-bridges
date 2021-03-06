'use strict';

const path = require('path');

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

/*const tty = require('tty.js');

let ttyServer = tty.createServer({
  shell: 'bash',
  port: 3000,
  localOnly: true,
  static: path.join(__dirname, 'tty'),
  cwd: path.join(__dirname)
});

ttyServer.listen();*/

let mainWindow;

global.__dirname = __dirname;

function createWindow () {
  mainWindow = new BrowserWindow({
    "width": 1280,
    "height": 700,
    "fullscreen": true,
    "kiosk": true,
    "autoHideMenuBar": true
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  //mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') {
    app.quit();
  // }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
