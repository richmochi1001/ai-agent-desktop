import { Skill } from '../../shared/types/skill'
import { FileManagerSkill } from '../../skills/basic/file-manager'
import { DocumentProcessorSkill } from '../../skills/basic/document-processor'
import { WebBrowserSkill } from '../../skills/basic/web-browser'

export class SkillRegistry {
  private skills: Map<string, Skill> = new Map()

  constructor() {
    // Register built-in skills
    this.register(FileManagerSkill)
    this.register(DocumentProcessorSkill)
    this.register(WebBrowserSkill)
  }

  register(skill: Skill): void {
    this.skills.set(skill.id, skill)
  }

  getSkill(id: string): Skill | undefined {
    return this.skills.get(id)
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values())
  }

  getSkillsByCategory(category: string): Skill[] {
    return this.getAllSkills().filter(skill => skill.category === category)
  }
}
