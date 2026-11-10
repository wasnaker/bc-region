"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionModuleManifest = exports.moduleManifest = void 0;
exports.moduleManifest = {
    id: 'region', version: '0.4.2', capabilities: ['api', 'web'],
    // Region continues to be a runtime dependency of Customer, but its
    // authorization contribution targets Customer-owned Roles independently.
    authorizationRequires: ['customer'],
    requiresServices: [{
            providerModuleId: 'core',
            contractId: 'core.authorization.registry',
            version: '^1.0.0',
        }],
    permissions: [
        { name: 'read:region', description: 'Allows viewing Region module navigation and data' },
        { name: 'create:region', description: 'Allows creating provinces and regencies' },
        { name: 'update:region', description: 'Allows updating provinces and regencies' },
        { name: 'delete:region', description: 'Allows deleting provinces and regencies' },
    ],
    roleGrants: [
        { targetRole: { moduleId: 'customer', key: 'customer' }, permissions: ['read:region'] },
        { targetRole: { moduleId: 'customer', key: 'customer-branch-admin' }, permissions: ['read:region'] },
    ],
};
exports.regionModuleManifest = exports.moduleManifest;
