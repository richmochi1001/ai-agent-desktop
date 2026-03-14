"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebBrowserSkill = void 0;
exports.WebBrowserSkill = {
    id: 'web-browser',
    name: 'Web Browser',
    description: 'Browse the web and extract content',
    category: 'basic',
    requiredPermissions: [{ type: 'network', resource: '*' }],
    async execute(params, context) {
        const { action, url } = params;
        context.sendProgress({ status: 'started', action, url });
        try {
            const response = await fetch(url);
            const content = await response.text();
            context.sendProgress({ status: 'completed', action });
            return { content, url };
        }
        catch (error) {
            context.sendProgress({ status: 'error', error: error.message });
            throw error;
        }
    }
};
//# sourceMappingURL=web-browser.js.map