import fs from 'fs/promises';
import { BasicSkill, SkillExecutionContext } from '../../shared/types/skill';

export const DocumentProcessorSkill: BasicSkill = {
  id: 'document-processor',
  name: 'Document Processor',
  description: 'Process and analyze documents (PDF, DOCX, TXT)',
  category: 'basic',
  requiredPermissions: [{ type: 'filesystem', resource: '*' }],

  async execute(params, context: SkillExecutionContext) {
    const { action, filePath } = params as {
      action: 'extract' | 'summarize' | 'analyze';
      filePath: string;
    };

    context.sendProgress({ status: 'started', action, filePath });

    try {
      const content = await fs.readFile(filePath, 'utf-8');

      context.sendProgress({ status: 'completed', action });

      return {
        success: true,
        data: {
          content,
          filePath,
          action,
          size: content.length
        }
      };
    } catch (error) {
      context.sendProgress({ status: 'error', error: (error as Error).message });
      throw error;
    }
  }
};
