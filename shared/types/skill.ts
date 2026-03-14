// Skill Type Definitions for AI Agent Desktop App

export type SkillCategory = "basic" | "advanced" | "professional" | "special";

export type SkillTier = "free" | "gold" | "diamond" | "vip";

export interface Permission {
  type: "filesystem" | "network" | "system" | "clipboard" | "notification";
  access: "read" | "write" | "execute" | "full";
  description: string;
}

export interface SkillExample {
  title: string;
  description: string;
  prompt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  icon: string;
  permissions: Permission[];
  tier: SkillTier;
  capabilities: string[];
  examples: SkillExample[];
  enabled: boolean;
}

export interface SkillExecutionResult {
  success: boolean;
  data?: unknown;
  error?: string;
  skillId: string;
  executedAt: Date;
}

export interface SkillRegistry {
  skills: Skill[];
  getVersion: () => string;
  getByCategory: (category: SkillCategory) => Skill[];
  getByTier: (tier: SkillTier) => Skill[];
  getEnabled: () => Skill[];
}

export interface UserSkillConfig {
  userId: string;
  activeSkills: string[];
  customSkills: Skill[];
  lastUpdated: Date;
}

// For Electron main process skills
export interface ProgressUpdate {
  status: 'started' | 'in_progress' | 'completed' | 'error';
  action?: string;
  path?: string;
  error?: string;
  url?: string;
  filePath?: string;
  progress?: number;
  message?: string;
}

export interface SkillExecutionContext {
  sendProgress: (progress: ProgressUpdate) => void;
}

export interface BasicSkill {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredPermissions: Array<{ type: string; resource: string }>;
  execute: (
    params: Record<string, unknown>,
    context: SkillExecutionContext
  ) => Promise<unknown>;
}
