export interface ModulePermissionDefinition { name: string; description: string; }
export interface ModuleRoleGrantDefinition {
  targetRole: { moduleId: string; key: string };
  permissions: readonly string[];
}
export interface BackendModuleManifest {
  id: string; version: string; capabilities: readonly ('api' | 'web')[];
  permissions: readonly ModulePermissionDefinition[];
  roleGrants?: readonly ModuleRoleGrantDefinition[];
  authorizationRequires?: readonly string[];
}
export const moduleManifest: BackendModuleManifest = {
  id: 'region', version: '0.4.1', capabilities: ['api', 'web'],
  // Region continues to be a runtime dependency of Customer, but its
  // authorization contribution targets Customer-owned Roles independently.
  authorizationRequires: ['customer'],
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
export const regionModuleManifest = moduleManifest;
