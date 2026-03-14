import { IpcMain } from 'electron'
import { PermissionManager } from '../permissions'
import { SkillRegistry } from '../skills/registry'

export function setupSkillsIPC(
  ipcMain: IpcMain,
  permissionManager: PermissionManager
) {
  const skillRegistry = new SkillRegistry()

  // Execute a skill
  ipcMain.handle('skill:execute', async (event, skillId: string, params: Record<string, unknown>) => {
    try {
      const skill = skillRegistry.getSkill(skillId)
      if (!skill) {
        return { success: false, error: `Skill not found: ${skillId}` }
      }

      // Check permissions
      for (const permission of skill.requiredPermissions) {
        const hasPermission = await permissionManager.hasPermission(
          permission.type,
          permission.resource
        )
        if (!hasPermission) {
          return {
            success: false,
            error: `Missing required permission: ${permission.type}:${permission.resource}`
          }
        }
      }

      // Execute skill
      const result = await skill.execute(params, {
        sendProgress: (progress) => {
          event.sender.send('skill:progress', progress)
        }
      })

      return { success: true, result }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // Get available skills
  ipcMain.handle('skill:getAvailable', async () => {
    return skillRegistry.getAllSkills().map(skill => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      category: skill.category
    }))
  })
}
