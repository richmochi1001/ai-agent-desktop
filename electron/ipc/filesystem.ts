import { IpcMain, dialog, BrowserWindow } from 'electron'
import fs from 'fs/promises'
import path from 'path'
import { PermissionManager } from '../permissions'

export function setupFilesystemIPC(
  ipcMain: IpcMain,
  permissionManager: PermissionManager
) {
  // Read file
  ipcMain.handle('fs:readFile', async (event, filePath: string) => {
    try {
      const hasPermission = await permissionManager.hasPermission(
        'filesystem',
        filePath
      )

      if (!hasPermission) {
        const granted = await requestFilePermission(
          BrowserWindow.fromWebContents(event.sender)!,
          'read',
          filePath
        )
        if (!granted) {
          return { success: false, error: 'Permission denied' }
        }
        permissionManager.grantPermission('filesystem', filePath)
      }

      const content = await fs.readFile(filePath, 'utf-8')
      return { success: true, data: content }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // Write file
  ipcMain.handle('fs:writeFile', async (event, filePath: string, content: string) => {
    try {
      const hasPermission = await permissionManager.hasPermission(
        'filesystem',
        filePath
      )

      if (!hasPermission) {
        const granted = await requestFilePermission(
          BrowserWindow.fromWebContents(event.sender)!,
          'write',
          filePath
        )
        if (!granted) {
          return { success: false, error: 'Permission denied' }
        }
        permissionManager.grantPermission('filesystem', filePath)
      }

      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, content, 'utf-8')
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // Delete file
  ipcMain.handle('fs:deleteFile', async (event, filePath: string) => {
    try {
      const hasPermission = await permissionManager.hasPermission(
        'filesystem',
        filePath
      )

      if (!hasPermission) {
        const granted = await requestFilePermission(
          BrowserWindow.fromWebContents(event.sender)!,
          'delete',
          filePath
        )
        if (!granted) {
          return { success: false, error: 'Permission denied' }
        }
      }

      await fs.unlink(filePath)
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // List directory
  ipcMain.handle('fs:listDirectory', async (event, dirPath: string) => {
    try {
      const hasPermission = await permissionManager.hasPermission(
        'filesystem',
        dirPath
      )

      if (!hasPermission) {
        const granted = await requestFilePermission(
          BrowserWindow.fromWebContents(event.sender)!,
          'read',
          dirPath
        )
        if (!granted) {
          return { success: false, error: 'Permission denied' }
        }
        permissionManager.grantPermission('filesystem', dirPath)
      }

      const entries = await fs.readdir(dirPath)
      return { success: true, entries }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // Create directory
  ipcMain.handle('fs:createDirectory', async (event, dirPath: string) => {
    try {
      const hasPermission = await permissionManager.hasPermission(
        'filesystem',
        dirPath
      )

      if (!hasPermission) {
        const granted = await requestFilePermission(
          BrowserWindow.fromWebContents(event.sender)!,
          'write',
          dirPath
        )
        if (!granted) {
          return { success: false, error: 'Permission denied' }
        }
        permissionManager.grantPermission('filesystem', dirPath)
      }

      await fs.mkdir(dirPath, { recursive: true })
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })
}

async function requestFilePermission(
  window: BrowserWindow,
  operation: 'read' | 'write' | 'delete',
  path: string
): Promise<boolean> {
  const result = await dialog.showMessageBox(window, {
    type: 'question',
    buttons: ['Allow', 'Deny'],
    defaultId: 0,
    cancelId: 1,
    title: 'File Access Permission',
    message: `Allow ${operation} access to:`,
    detail: path
  })

  return result.response === 0
}
