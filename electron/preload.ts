import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Filesystem operations
  readFile: (path: string) => ipcRenderer.invoke('fs:readFile', path),
  writeFile: (path: string, content: string) => ipcRenderer.invoke('fs:writeFile', path, content),
  deleteFile: (path: string) => ipcRenderer.invoke('fs:deleteFile', path),
  listDirectory: (path: string) => ipcRenderer.invoke('fs:listDirectory', path),
  createDirectory: (path: string) => ipcRenderer.invoke('fs:createDirectory', path),

  // Permission management
  requestPermission: (type: string, resource: string) => ipcRenderer.invoke('permission:request', type, resource),
  hasPermission: (type: string, resource: string) => ipcRenderer.invoke('permission:has', type, resource),
  getGrantedPermissions: () => ipcRenderer.invoke('permission:getGranted'),

  // Skills execution
  executeSkill: (skillId: string, params: Record<string, unknown>) => ipcRenderer.invoke('skill:execute', skillId, params),
  getAvailableSkills: () => ipcRenderer.invoke('skill:getAvailable'),

  // Events
  onPermissionRequest: (callback: (event: unknown, data: unknown) => void) => ipcRenderer.on('permission:request-dialog', callback),
  onSkillProgress: (callback: (event: unknown, data: unknown) => void) => ipcRenderer.on('skill:progress', callback)
})

// Type definition for the exposed API
export interface ElectronAPI {
  readFile: (path: string) => Promise<{ success: boolean; data?: string; error?: string }>
  writeFile: (path: string, content: string) => Promise<{ success: boolean; error?: string }>
  deleteFile: (path: string) => Promise<{ success: boolean; error?: string }>
  listDirectory: (path: string) => Promise<{ success: boolean; entries?: string[]; error?: string }>
  createDirectory: (path: string) => Promise<{ success: boolean; error?: string }>
  requestPermission: (type: string, resource: string) => Promise<{ granted: boolean }>
  hasPermission: (type: string, resource: string) => Promise<boolean>
  getGrantedPermissions: () => Promise<Array<{ type: string; resource: string }>>
  executeSkill: (skillId: string, params: Record<string, unknown>) => Promise<unknown>
  getAvailableSkills: () => Promise<Array<{ id: string; name: string; description: string }>>
  onPermissionRequest: (callback: (event: unknown, data: unknown) => void) => void
  onSkillProgress: (callback: (event: unknown, data: unknown) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
