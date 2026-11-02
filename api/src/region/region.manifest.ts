export interface ModulePermissionDefinition {
  name: string;
  description: string;
}

export interface BackendModuleManifest {
  id: string;
  version: string;
  capabilities: readonly ('api' | 'web')[];
  permissions: readonly ModulePermissionDefinition[];
}

export const regionModuleManifest: BackendModuleManifest = {
  id: 'region',
  version: '0.2.0',
  capabilities: ['api', 'web'],
  permissions: [
    {
      name: 'read:region',
      description: 'Allows viewing Region module navigation and data',
    },
  ],
};
