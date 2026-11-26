'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { AdminAction, AdminModule, AuthenticatedAdmin, hasPermission } from '@/lib/rbac';

export interface ModulePermissionsState {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isSuperAdmin: boolean;
  hasAction: (action: AdminAction) => boolean;
}

const AdminContext = createContext<AuthenticatedAdmin | null>(null);

export function AdminProvider({
  admin,
  children,
}: {
  admin: AuthenticatedAdmin | null;
  children: React.ReactNode;
}) {
  return <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AuthenticatedAdmin | null {
  return useContext(AdminContext);
}

export function usePermissions(module: AdminModule): ModulePermissionsState {
  const admin = useContext(AdminContext);

  return useMemo(() => {
    if (!admin) {
      return {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        isSuperAdmin: false,
        hasAction: () => false,
      };
    }

    if (admin.isSuperAdmin) {
      return {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        isSuperAdmin: true,
        hasAction: () => true,
      };
    }

    const canView = hasPermission(admin, module, 'view');
    const canCreate = hasPermission(admin, module, 'create');
    const canEdit = hasPermission(admin, module, 'edit');
    const canDelete = hasPermission(admin, module, 'delete');

    return {
      canView,
      canCreate,
      canEdit,
      canDelete,
      isSuperAdmin: false,
      hasAction: (action: AdminAction) => hasPermission(admin, module, action),
    };
  }, [admin, module]);
}
