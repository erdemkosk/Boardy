// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow
} = require('electron');
const clipboardWatcher = require('electron-clipboard-watcher');
const clipboardTextData = require('./models/clipboardTextData');
const dataController = require('./controllers/dataController');
const {Menu} = require('electron');
const {appMenu} = require('electron-util');
const util= require('electron-util');
const clipboardy = require('clipboardy');
var totalNotificaitonCount=0;
var AutoLaunch = require('auto-launch');
 
var boardyAutoLauncher = new AutoLaunch({
    name: 'Boardy',
    path: '/Applications/boardy.app',
});


var path = require('path')
var clipboards;



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, './static/boardy-c.png'),
    
  })
  function setMacOSBadge(totalNotificaitonCount){
    if(util.is.macos==true){
      app.setBadgeCount(totalNotificaitonCount);

    }
  }
  //mainWindow.setMaximizable(false);
 // mainWindow.setResizable(false);
  

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  //dataController.saveDataToClipboards('test');
  //Read all data
  

  //dataController.deleteSingleClipboard('erdem');
  // console.log(dataController.getAllDataToClipboards());
  //dataController.saveData("foo: bar");

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()


  mainWindow.webContents.on('did-finish-load', () => {
   
  
    for (variable in clipboards) {
     //console.log(clipboards[variable]);
     if(clipboards[variable].toString()!="[object Object]"){
      mainWindow.webContents.send('addClipboard', clipboards[variable].toString());
      totalNotificaitonCount++;
     }
      
    }
    setMacOSBadge(totalNotificaitonCount);
    //boardyAutoLauncher.enable();
  })


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  clipboards = dataController.getAllDataToClipboards();

}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  const watcher = clipboardWatcher();
  watcher.stop()
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
    //mainwindow.webContents.send('foo', 'do something for me');

  }

})



const {
  ipcMain
} = require('electron');

ipcMain.on('copy', (event, arg) => {

  clipboardy.writeSync(arg);
})
ipcMain.on('clearAll', (event, arg) => {
  dataController.deleteAllClipboard();
  totalNotificaitonCount=0;
  app.setBadgeCount(totalNotificaitonCount);


})
ipcMain.on('delete', (event, arg) => {
 
  dataController.deleteSingleClipboard(arg);
  totalNotificaitonCount--;
  app.setBadgeCount(totalNotificaitonCount);
})


clipboardWatcher({
  // (optional) delay in ms between polls
  watchDelay: 1000,

  // handler for when image data is copied into the clipboard
  onImageChange: function (nativeImage) {

  },

  // handler for when text data is copied into the clipboard
  onTextChange: function (text) {
    if (mainWindow != null) {
      var data = new clipboardTextData(text);
       //console.log(data.text);
      mainWindow.webContents.send('addClipboard', data.text);
      //Save Disk
      dataController.addDataToClipboards(data.text);
      //dataController.deleteAllClipboard();
      totalNotificaitonCount++;
      app.setBadgeCount(totalNotificaitonCount);
    }

  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.