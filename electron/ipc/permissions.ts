import { IpcMain } from 'electron'
import { PermissionManager } from '../permissions'

export function setupPermissionsIPC(
  ipcMain: IpcMain,
  permissionManager: PermissionManager
) {
  // Request permission
  ipcMain.handle('permission:request', async (_event, type: string, resource: string) => {
    const granted = permissionManager.grantPermission(type, resource)
    return { granted }
  })

  // Check permission
  ipcMain.handle('permission:has', async (_event, type: string, resource: string) => {
    return permissionManager.hasPermission(type, resource)
  })

  // Get all granted permissions
  ipcMain.handle('permission:getGranted', async () => {
    return permissionManager.getGrantedPermissions()
  })
}
