import { Skill } from '../../shared/types/skill'

export const DocumentProcessorSkill: Skill = {
  id: 'document-processor',
  name: 'Document Processor',
  description: 'Process and analyze documents (PDF, DOCX, TXT)',
  category: 'basic',
  requiredPermissions: [{ type: 'filesystem', resource: '*' }],

  async execute(params, context) {
    const { action, filePath } = params as {
      action: 'extract' | 'summarize' | 'analyze'
      filePath: string
    }

    context.sendProgress({ status: 'started', action, filePath })

    // Read file
    const result = await window.electronAPI.readFile(filePath)

    context.sendProgress({ status: 'completed', action })

    return result
  }
}
