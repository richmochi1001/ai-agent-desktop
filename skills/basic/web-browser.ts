cat > skills/basic/web-browser.ts << 'EOF'
import { BasicSkill } from '../../shared/types/skill'

export const WebBrowserSkill: BasicSkill = {
  id: 'web-browser',
  name: 'Web Browser',
  description: 'Browse the web',
  category: 'basic',
  requiredPermissions: [{ type: 'network', resource: '*' }],
  async execute(params, ctx) {
    const { url } = params as { url: string }
    ctx.sendProgress({ status: 'started' })
    const res = await fetch(url)
    return { success: true, data: { content: await res.text(), status: res.status } }
  }
}
EOF
