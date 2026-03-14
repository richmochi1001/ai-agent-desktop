import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'
import { setupFilesystemIPC } from './ipc/filesystem'
import { setupPermissionsIPC } from './ipc/permissions'
import { setupSkillsIPC } from './ipc/skills'
import { setupSecureSandbox } from './sandbox'
import { PermissionManager } from './permissions'

let mainWindow: BrowserWindow | null = null
const permissionManager = new PermissionManager()

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
      webSecurity: true
    },
    titleBarStyle: 'hiddenInset',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    show: false
  })

  // Setup secure sandbox
  await setupSecureSandbox(mainWindow)

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    await mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../out/index.html'))
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// Setup IPC handlers
function setupIPC() {
  setupFilesystemIPC(ipcMain, permissionManager)
  setupPermissionsIPC(ipcMain, permissionManager)
  setupSkillsIPC(ipcMain, permissionManager)
}

// App lifecycle
app.whenReady().then(async () => {
  setupIPC()
  await createWindow()

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Security: Prevent navigation to external URLs
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event) => {
    event.preventDefault()
  })
})
