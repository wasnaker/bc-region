export interface ModulePermissionDefinition {
  name: string;
  description: string;
}

export interface ModuleRoleDefinition {
  key: string;
  name: string;
  description: string;
  scope: 'global' | 'customer' | 'branch';
  permissions: readonly string[];
}

export interface BackendModuleManifest {
  id: string;
  version: string;
  capabilities: readonly ('api' | 'web')[];
  permissions: readonly ModulePermissionDefinition[];
  roles?: readonly ModuleRoleDefinition[];
}

export const moduleManifest: BackendModuleManifest = {
  id: 'region',
  version: '0.4.0',
  capabilities: ['api', 'web'],
  permissions: [
    { name: 'read:region', description: 'Allows viewing Region module navigation and data' },
    { name: 'create:region', description: 'Allows creating provinces and regencies' },
    { name: 'update:region', description: 'Allows updating provinces and regencies' },
    { name: 'delete:region', description: 'Allows deleting provinces and regencies' },
  ],
  // Module-owned defaults are appended to the centrally managed Customer role
  // by the host seeder; each module grants only the access it owns.
  roles: [
    {
      key: 'customer',
      name: 'Customer',
      description: 'Standard customer staff account; read access to region reference data.',
      scope: 'branch',
      permissions: ['read:region'],
    },
  ],
};

export const regionModuleManifest = moduleManifest;
