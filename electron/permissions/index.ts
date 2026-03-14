export class PermissionManager {
  private permissions: Map<string, Set<string>> = new Map()

  grantPermission(type: string, resource: string): boolean {
    if (!this.permissions.has(type)) {
      this.permissions.set(type, new Set())
    }
    this.permissions.get(type)!.add(resource)
    return true
  }

  hasPermission(type: string, resource: string): boolean {
    const resources = this.permissions.get(type)
    if (!resources) return false
    
    // Check for wildcard permission
    if (resources.has('*')) return true
    
    return resources.has(resource)
  }

  revokePermission(type: string, resource: string): boolean {
    const resources = this.permissions.get(type)
    if (!resources) return false
    
    return resources.delete(resource)
  }

  getGrantedPermissions(): Array<{ type: string; resource: string }> {
    const result: Array<{ type: string; resource: string }> = []
    
    for (const [type, resources] of this.permissions) {
      for (const resource of resources) {
        result.push({ type, resource })
      }
    }
    
    return result
  }

  clearPermissions(): void {
    this.permissions.clear()
  }
}
