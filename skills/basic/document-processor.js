"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessorSkill = void 0;
exports.DocumentProcessorSkill = {
    id: 'document-processor',
    name: 'Document Processor',
    description: 'Process and analyze documents (PDF, DOCX, TXT)',
    category: 'basic',
    requiredPermissions: [{ type: 'filesystem', resource: '*' }],
    async execute(params, context) {
        const { action, filePath } = params;
        context.sendProgress({ status: 'started', action, filePath });
        // Read file
        const result = await window.electronAPI.readFile(filePath);
        context.sendProgress({ status: 'completed', action });
        return result;
    }
};
//# sourceMappingURL=document-processor.js.map