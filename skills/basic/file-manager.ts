import { Skill } from '../../shared/types/skill'

export const FileManagerSkill: Skill = {
  id: 'file-manager',
  name: 'File Manager',
  description: 'Manage files and directories on the local filesystem',
  category: 'basic',
  requiredPermissions: [{ type: 'filesystem', resource: '*' }],

  async execute(params, context) {
    const { action, path, content } = params as {
      action: 'read' | 'write' | 'delete' | 'list'
      path: string
      content?: string
    }

    context.sendProgress({ status: 'started', action, path })

    try {
      switch (action) {
        case 'read':
          const fileContent = await window.electronAPI.readFile(path)
          context.sendProgress({ status: 'completed', action })
          return fileContent

        case 'write':
          await window.electronAPI.writeFile(path, content || '')
          context.sendProgress({ status: 'completed', action })
          return { success: true }

        case 'delete':
          await window.electronAPI.deleteFile(path)
          context.sendProgress({ status: 'completed', action })
          return { success: true }

        case 'list':
          const entries = await window.electronAPI.listDirectory(path)
          context.sendProgress({ status: 'completed', action })
          return entries

        default:
          throw new Error(`Unknown action: ${action}`)
      }
    } catch (error) {
      context.sendProgress({ status: 'error', error: (error as Error).message })
      throw error
    }
  }
}
