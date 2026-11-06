"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionModuleManifest = exports.moduleManifest = void 0;
exports.moduleManifest = {
    id: 'region', version: '0.4.1', capabilities: ['api', 'web'],
    permissions: [
        { name: 'read:region', description: 'Allows viewing Region module navigation and data' },
        { name: 'create:region', description: 'Allows creating provinces and regencies' },
        { name: 'update:region', description: 'Allows updating provinces and regencies' },
        { name: 'delete:region', description: 'Allows deleting provinces and regencies' },
    ],
    roles: [
        { key: 'customer', name: 'Customer', description: 'Standard customer staff account; read access to region reference data.', scope: 'branch', permissions: ['read:region'] },
        { key: 'customer-branch-admin', name: 'Customer Branch Admin', description: 'Branch administrator; read access to region reference data.', scope: 'branch', permissions: ['read:region'] },
    ],
};
exports.regionModuleManifest = exports.moduleManifest;
