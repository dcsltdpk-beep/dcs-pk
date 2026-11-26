export type AdminRole = 'super_admin' | 'admin' | 'sub_admin';

export type AdminAction = 'view' | 'create' | 'edit' | 'delete';

export type AdminModule =
  | 'dashboard'
  | 'sub-admins'
  | 'inquiries'
  | 'services'
  | 'courses'
  | 'portfolio'
  | 'videos'
  | 'posts'
  | 'team'
  | 'faqs'
  | 'landing-pages'
  | 'home-content'
  | 'settings';

export interface ModulePermission {
  module: AdminModule;
  actions: AdminAction[];
}

export interface ModuleDefinition {
  id: AdminModule;
  label: string;
  description: string;
  icon: string;
  path: string;
  supportedActions: AdminAction[];
  isSuperAdminOnly?: boolean;
}

export interface AuthenticatedAdmin {
  id: string;
  username: string;
  email: string;
  name?: string;
  role: AdminRole;
  status: 'active' | 'inactive';
  isSuperAdmin: boolean;
  permissions: Record<string, AdminAction[]>;
  lastLogin?: string | Date;
}

/**
 * All configurable modules available for sub-admin permission assignment.
 */
export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    id: 'dashboard',
    label: 'Dashboard & Metrics',
    description: 'View corporate analytics, lead metrics, and system activity overview.',
    icon: 'layout',
    path: '/admin',
    supportedActions: ['view'],
  },
  {
    id: 'inquiries',
    label: 'Inquiries & Leads',
    description: 'Corporate client inquiries, vulnerability scan leads, and academy registrations.',
    icon: 'inbox',
    path: '/admin/inquiries',
    supportedActions: ['view', 'edit', 'delete'],
  },
  {
    id: 'services',
    label: 'Core Services',
    description: 'Cybersecurity defense, software engineering, and cloud solutions catalog.',
    icon: 'shield',
    path: '/admin/services',
    supportedActions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'courses',
    label: 'Academy Courses',
    description: 'Training curricula, syllabi, fee structures, and instructor assignments.',
    icon: 'award',
    path: '/admin/courses',
    supportedActions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'portfolio',
    label: 'Portfolio Works',
    description: 'Enterprise case studies, client project showcases, and delivery metrics.',
    icon: 'briefcase',
    path: '/admin/portfolio',
    supportedActions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'videos',
    label: 'Video Gallery',
    description: 'Technical motion explainers, security walkthroughs, and studio productions.',
    icon: 'video',
    path: '/admin/videos',
    supportedActions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'posts',
    label: 'News & Advisories',
    description: 'Threat advisories, zero-day CVE breakdowns, and corporate announcements.',
    icon: 'file-text',
    path: '/admin/posts',
    supportedActions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'team',
    label: 'Team Profiles',
    description: 'Executive leadership, security researchers, and lead engineers directory.',
    icon: 'users',
    path: '/admin/team',
    supportedActions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'faqs',
    label: 'FAQ Database',
    description: 'Client frequently asked questions and knowledgebase answer bank.',
    icon: 'help-circle',
    path: '/admin/faqs',
    supportedActions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'landing-pages',
    label: 'Campaign Pages',
    description: 'Special initiative landing pages and marketing program showcases.',
    icon: 'trending-up',
    path: '/admin/landing-pages',
    supportedActions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'home-content',
    label: 'Home Page Editor',
    description: 'Homepage dynamic headlines, statistics tickers, and call-to-action blocks.',
    icon: 'layout',
    path: '/admin/home-content',
    supportedActions: ['view', 'edit'],
  },
  {
    id: 'settings',
    label: 'Global Settings & SEO',
    description: 'Site-wide configuration, WhatsApp routing, verification tokens, and social links.',
    icon: 'settings',
    path: '/admin/settings',
    supportedActions: ['view', 'edit'],
  },
  {
    id: 'sub-admins',
    label: 'Sub-Admin & RBAC',
    description: 'Manage staff accounts, assign granular role-based permissions, and revoke access.',
    icon: 'shield-check',
    path: '/admin/sub-admins',
    supportedActions: ['view', 'create', 'edit', 'delete'],
    isSuperAdminOnly: true,
  },
];

export const ALL_ACTIONS: AdminAction[] = ['view', 'create', 'edit', 'delete'];

/**
 * Checks whether an entity represents a Super Admin.
 * Supports backwards compatibility for legacy role: 'admin'.
 */
export function isSuperAdmin(roleOrUser: string | { role?: string } | null | undefined): boolean {
  if (!roleOrUser) return false;
  const role = typeof roleOrUser === 'string' ? roleOrUser : roleOrUser.role;
  return role === 'super_admin' || role === 'admin';
}

/**
 * Checks whether an admin has a specific action permission on a given module.
 */
export function hasPermission(
  admin: AuthenticatedAdmin | null | undefined,
  module: AdminModule,
  action: AdminAction
): boolean {
  if (!admin || admin.status === 'inactive') return false;

  // Super Admins have absolute full access
  if (admin.isSuperAdmin) {
    return true;
  }

  // Sub-admins can NEVER manage sub-admins
  if (module === 'sub-admins') {
    return false;
  }

  // Dashboard is viewable if user has dashboard permission or access to at least 1 module
  if (module === 'dashboard' && action === 'view') {
    if (admin.permissions['dashboard']?.includes('view')) return true;
    return Object.keys(admin.permissions).some(
      (m) => m !== 'dashboard' && (admin.permissions[m]?.length || 0) > 0
    );
  }

  const actions = admin.permissions[module] || [];

  // Direct action match
  if (actions.includes(action)) {
    return true;
  }

  // create, edit, or delete inherently implies view access
  if (action === 'view') {
    return actions.some((act) => ['view', 'create', 'edit', 'delete'].includes(act));
  }

  return false;
}

/**
 * Checks whether an admin has general access to visit/view a module.
 */
export function hasModuleAccess(
  admin: AuthenticatedAdmin | null | undefined,
  module: AdminModule
): boolean {
  return hasPermission(admin, module, 'view');
}

/**
 * Converts stored array/map permissions into a normalized Record<string, AdminAction[]>.
 */
export function normalizePermissions(raw: any): Record<string, AdminAction[]> {
  const result: Record<string, AdminAction[]> = {};

  if (!raw) return result;

  // If already an object map
  if (!Array.isArray(raw) && typeof raw === 'object') {
    for (const [mod, acts] of Object.entries(raw)) {
      if (Array.isArray(acts)) {
        result[mod] = Array.from(new Set(acts as AdminAction[]));
      }
    }
    return result;
  }

  // If array of { module, actions }
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (item && item.module && Array.isArray(item.actions)) {
        result[item.module] = Array.from(new Set(item.actions as AdminAction[]));
      }
    }
  }

  return result;
}

/**
 * Constructs a full permissions map for Super Admin users.
 */
export function getSuperAdminPermissionsMap(): Record<string, AdminAction[]> {
  const result: Record<string, AdminAction[]> = {};
  for (const mod of MODULE_DEFINITIONS) {
    result[mod.id] = [...mod.supportedActions];
  }
  return result;
}
