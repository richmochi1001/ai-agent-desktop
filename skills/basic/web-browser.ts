import { Skill } from '../../shared/types/skill'

export const WebBrowserSkill: Skill = {
  id: 'web-browser',
  name: 'Web Browser',
  description: 'Browse the web and extract content',
  category: 'basic',
  requiredPermissions: [{ type: 'network', resource: '*' }],

  async execute(params, context) {
    const { action, url } = params as {
      action: 'fetch' | 'screenshot' | 'extract'
      url: string
    }

    context.sendProgress({ status: 'started', action, url })

    try {
      const response = await fetch(url)
      const content = await response.text()

      context.sendProgress({ status: 'completed', action })

      return { content, url }
    } catch (error) {
      context.sendProgress({ status: 'error', error: (error as Error).message })
      throw error
    }
  }
}
