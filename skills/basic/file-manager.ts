import fs from 'fs/promises';
import path from 'path';
import { BasicSkill, SkillExecutionContext } from '../../shared/types/skill';

export const FileManagerSkill: BasicSkill = {
  id: 'file-manager',
  name: 'File Manager',
  description: 'Manage files and directories on the local filesystem',
  category: 'basic',
  requiredPermissions: [{ type: 'filesystem', resource: '*' }],

  async execute(params, context: SkillExecutionContext) {
    const { action, path: filePath, content } = params as {
      action: 'read' | 'write' | 'delete' | 'list';
      path: string;
      content?: string;
    };

    context.sendProgress({ status: 'started', action, path: filePath });

    try {
      switch (action) {
        case 'read':
          const fileContent = await fs.readFile(filePath, 'utf-8');
          context.sendProgress({ status: 'completed', action });
          return { success: true, data: fileContent };

        case 'write':
          await fs.mkdir(path.dirname(filePath), { recursive: true });
          await fs.writeFile(filePath, content || '', 'utf-8');
          context.sendProgress({ status: 'completed', action });
          return { success: true };

        case 'delete':
          await fs.unlink(filePath);
          context.sendProgress({ status: 'completed', action });
          return { success: true };

        case 'list':
          const entries = await fs.readdir(filePath);
          context.sendProgress({ status: 'completed', action });
          return { success: true, data: entries };

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      context.sendProgress({ status: 'error', error: (error as Error).message });
      throw error;
    }
  }
};
