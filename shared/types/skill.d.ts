export interface Permission {
    type: string;
    resource: string;
}
export interface SkillExecutionContext {
    sendProgress: (progress: ProgressUpdate) => void;
}
export interface ProgressUpdate {
    status: 'started' | 'in_progress' | 'completed' | 'error';
    action?: string;
    path?: string;
    error?: string;
}
export interface Skill {
    id: string;
    name: string;
    description: string;
    category: string;
    requiredPermissions: Permission[];
    execute: (params: Record<string, unknown>, context: SkillExecutionContext) => Promise<unknown>;
}
//# sourceMappingURL=skill.d.ts.map