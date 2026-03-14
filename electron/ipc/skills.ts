cat > electron/ipc/skills.ts << 'EOF'
import { ipcMain } from 'electron'
import { FileManagerSkill } from '../../skills/basic/file-manager'
import { DocumentProcessorSkill } from '../../skills/basic/document-processor'
import { WebBrowserSkill } from '../../skills/basic/web-browser'

const allSkills = [
  { id: FileManagerSkill.id, name: FileManagerSkill.name, description: FileManagerSkill.description, category: FileManagerSkill.category },
  { id: DocumentProcessorSkill.id, name: DocumentProcessorSkill.name, description: DocumentProcessorSkill.description, category: DocumentProcessorSkill.category },
  { id: WebBrowserSkill.id, name: WebBrowserSkill.name, description: WebBrowserSkill.description, category: WebBrowserSkill.category },
]

export function registerSkillsHandlers(): void {
  ipcMain.handle('skills:getAll', async () => ({ success: true, data: allSkills }))
  ipcMain.handle('skills:getById', async (_, id: string) => {
    const skill = allSkills.find(s => s.id === id)
    return skill ? { success: true, data: skill } : { success: false, error: 'Not found' }
  })
}
EOF
