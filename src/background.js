'use strict'

import { app, protocol, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import fs from 'fs'
import {
  createProtocol
  // installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import { dateUtil } from '@youngbeen/angle-util'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: { secure: true, standard: true }
  }
])

// 侦听异步消息
ipcMain.on('asynchronous-message', (event, arg) => {
  // console.log(event, arg)
  if (arg && arg.type === 'sys_export_file') {
    // 下载数据
    let filters = [{
      name: 'ray_feeds_data',
      extensions: ['json']
    }]
    dialog.showSaveDialog({
      filters,
      title: 'Export',
      defaultPath: `ray_feeds_data_${dateUtil.formatDateTime('YYYYMMDD', new Date())}`,
      buttonLabel: 'Export'
    }).then(data => {
      // console.log(data)
      if (data.filePath) {
        fs.writeFileSync(data.filePath, arg.content, 'utf8')
      }
    })
  }
  // event.reply('asynchronous-reply', 'got it')
})

// 导入数据功能
function importData () {
  dialog.showOpenDialog({
    filters: [{
      name: 'json file',
      extensions: ['json']
    }],
    properties: ['openFile'],
    buttonLabel: 'Import'
  }, (filePaths) => {
    if (filePaths && filePaths.length) {
      let content = fs.readFileSync(filePaths[0])
      // console.log(content.toString())
      win.webContents.send('sys_importdata', content.toString())
    }
  })
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 700,
    resizable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })

  const customMenu = Menu.buildFromTemplate([
    { role: 'appMenu' },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'cut' },
        { role: 'delete' }
      ]
    },
    { role: 'windowMenu' },
    {
      label: 'Data',
      submenu: [
        {
          label: 'Export Feeds Data as File',
          click: () => {
            win.webContents.send('sys_export_trigger')
          }
        },
        {
          label: 'Import Feeds Data via File',
          click: () => {
            importData()
          }
        }
      ]
    },
    {
      label: 'About',
      submenu: [
        { role: 'about' }
      ]
    }
  ])
  Menu.setApplicationMenu(customMenu)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow()
})

app.setAboutPanelOptions({
  applicationName: 'Ray',
  copyright: 'Released under ISC, all rights reversed by youngbeen 2019',
  credits: 'created by youngbeen with ❤️'
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
