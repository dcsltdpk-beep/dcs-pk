'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Icon from '@/components/Icon';
import {
  AdminAction,
  AdminModule,
  MODULE_DEFINITIONS,
  ALL_ACTIONS,
  ModuleDefinition,
  isSuperAdmin,
} from '@/lib/rbac';

function formatSafeDate(isoStr: string | null | undefined): string {
  if (!isoStr) return 'Never logged in';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return 'Never logged in';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch {
    return 'Never logged in';
  }
}

export interface SubAdminUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'sub_admin';
  status: 'active' | 'inactive';
  permissions: Array<{ module: string; actions: string[] }>;
  lastLogin: string | null;
  createdAt: string | null;
  isSuperAdmin: boolean;
}

interface FormState {
  _id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'super_admin' | 'sub_admin';
  status: 'active' | 'inactive';
  permissions: Record<string, AdminAction[]>;
}

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  permissions?: string;
}

export default function SubAdminsClient({
  initialUsers,
  currentAdminId,
}: {
  initialUsers: SubAdminUser[];
  currentAdminId: string;
}) {
  const [users, setUsers] = useState<SubAdminUser[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'super_admin' | 'sub_admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const modalBodyRef = useRef<HTMLDivElement>(null);

  const defaultPermissions: Record<string, AdminAction[]> = useMemo(() => {
    const res: Record<string, AdminAction[]> = {};
    for (const mod of MODULE_DEFINITIONS) {
      if (!mod.isSuperAdminOnly) {
        res[mod.id] = [];
      }
    }
    return res;
  }, []);

  const emptyForm: FormState = {
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'sub_admin',
    status: 'active',
    permissions: defaultPermissions,
  };

  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});

  // Real-time validation runner
  const validateForm = (data: FormState): FormErrors => {
    const newErrors: FormErrors = {};

    // 1. Name validation
    const trimmedName = data.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Full name and designation are required.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    }

    // 2. Username validation
    const trimmedUsername = data.username.trim().toLowerCase();
    if (!trimmedUsername) {
      newErrors.username = 'Username is required.';
    } else if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      newErrors.username = 'Username must be between 3 and 30 characters.';
    } else if (!/^[a-z0-9_\-\.]+$/.test(trimmedUsername)) {
      newErrors.username =
        'Only lowercase letters, numbers, underscores (_), dashes (-), and dots (.) are allowed.';
    } else {
      // Duplicate username check (exclude the account currently being edited)
      const conflict = users.find(
        (u) =>
          String(u._id) !== String(data._id || '') &&
          u.username.trim().toLowerCase() === trimmedUsername
      );
      if (conflict) {
        newErrors.username = `The username '${trimmedUsername}' is already taken by another account.`;
      }
    }

    // 3. Email validation
    const trimmedEmail = data.email.trim().toLowerCase();
    if (!trimmedEmail) {
      newErrors.email = 'Official work email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid corporate email format (e.g. staff@dreamcybersecurity.pk).';
    } else {
      // Duplicate email check (exclude the account currently being edited)
      const conflict = users.find(
        (u) =>
          String(u._id) !== String(data._id || '') &&
          u.email.trim().toLowerCase() === trimmedEmail
      );
      if (conflict) {
        newErrors.email = 'This email address is already assigned to another administrative account.';
      }
    }

    // 4. Password validation
    if (!data._id) {
      // Create mode: password required
      if (!data.password) {
        newErrors.password = 'Security password is required for new accounts.';
      } else if (data.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long (8+ recommended).';
      }
    } else {
      // Edit mode: password optional, but if entered must be valid
      if (data.password && data.password.length < 6) {
        newErrors.password = 'New password must be at least 6 characters long.';
      }
    }

    // 5. Permissions validation (only applies to sub_admin role)
    if (data.role === 'sub_admin') {
      const totalActions = Object.values(data.permissions).reduce(
        (acc, acts) => acc + (acts?.length || 0),
        0
      );
      if (totalActions === 0) {
        newErrors.permissions =
          'Sub-Admins must be assigned at least one module privilege to access the portal.';
      }
    }

    return newErrors;
  };

  // Run validation whenever formData changes
  useEffect(() => {
    setErrors(validateForm(formData));
  }, [formData, users]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Password Strength Calculation (0 to 3)
  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return 0;
    if (pwd.length < 6) return 1;
    let score = 1;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }, [formData.password]);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole =
        roleFilter === 'all'
          ? true
          : roleFilter === 'super_admin'
          ? u.isSuperAdmin
          : !u.isSuperAdmin;

      const matchStatus = statusFilter === 'all' ? true : u.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Metrics
  const totalCount = users.length;
  const superCount = users.filter((u) => u.isSuperAdmin).length;
  const subCount = users.filter((u) => !u.isSuperAdmin).length;
  const activeCount = users.filter((u) => u.status === 'active').length;

  // Total assigned actions count for current modal form
  const totalAssignedActions = useMemo(() => {
    return Object.values(formData.permissions).reduce(
      (acc, acts) => acc + (acts?.length || 0),
      0
    );
  }, [formData.permissions]);

  const totalAssignedModules = useMemo(() => {
    return Object.values(formData.permissions).filter((acts) => acts && acts.length > 0).length;
  }, [formData.permissions]);

  const handleOpenCreate = () => {
    setFormData(emptyForm);
    setTouched({});
    setShowPassword(false);
    setFeedback(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user: SubAdminUser) => {
    const permMap: Record<string, AdminAction[]> = {};
    for (const mod of MODULE_DEFINITIONS) {
      if (!mod.isSuperAdminOnly) {
        permMap[mod.id] = [];
      }
    }

    if (Array.isArray(user.permissions)) {
      for (const p of user.permissions) {
        if (p.module && Array.isArray(p.actions)) {
          permMap[p.module] = p.actions as AdminAction[];
        }
      }
    }

    setFormData({
      _id: user._id,
      name: user.name || '',
      username: user.username,
      email: user.email,
      password: '',
      role: user.isSuperAdmin ? 'super_admin' : 'sub_admin',
      status: user.status,
      permissions: permMap,
    });
    setTouched({});
    setShowPassword(false);
    setFeedback(null);
    setModalOpen(true);
  };

  const generatePassword = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnpqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%&*';
    let pwd = '';
    // Ensure all character sets
    pwd += upper.charAt(Math.floor(Math.random() * upper.length));
    pwd += lower.charAt(Math.floor(Math.random() * lower.length));
    pwd += numbers.charAt(Math.floor(Math.random() * numbers.length));
    pwd += symbols.charAt(Math.floor(Math.random() * symbols.length));
    const allChars = upper + lower + numbers + symbols;
    for (let i = 4; i < 14; i++) {
      pwd += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    // Shuffle
    const shuffled = pwd
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
    setFormData((prev) => ({ ...prev, password: shuffled }));
    setTouched((prev) => ({ ...prev, password: true }));
    setShowPassword(true);
  };

  const togglePermission = (moduleId: string, action: AdminAction) => {
    setFormData((prev) => {
      const currentActions = prev.permissions[moduleId] || [];
      const hasAction = currentActions.includes(action);

      let nextActions: AdminAction[];
      if (hasAction) {
        // If unchecking 'view', also remove create/edit/delete since they depend on view
        if (action === 'view') {
          nextActions = [];
        } else {
          nextActions = currentActions.filter((a) => a !== action);
        }
      } else {
        // If checking create/edit/delete, ensure 'view' is also checked
        if (action !== 'view') {
          nextActions = Array.from(new Set([...currentActions, action, 'view' as AdminAction]));
        } else {
          nextActions = [...currentActions, action];
        }
      }

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [moduleId]: nextActions,
        },
      };
    });
  };

  const toggleRowAll = (mod: ModuleDefinition) => {
    setFormData((prev) => {
      const current = prev.permissions[mod.id] || [];
      const allSelected = mod.supportedActions.every((a) => current.includes(a));
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [mod.id]: allSelected ? [] : [...mod.supportedActions],
        },
      };
    });
  };

  const selectAllPermissions = () => {
    const full: Record<string, AdminAction[]> = {};
    for (const mod of MODULE_DEFINITIONS) {
      if (!mod.isSuperAdminOnly) {
        full[mod.id] = [...mod.supportedActions];
      }
    }
    setFormData((prev) => ({ ...prev, permissions: full }));
  };

  const selectViewOnlyPermissions = () => {
    const viewOnly: Record<string, AdminAction[]> = {};
    for (const mod of MODULE_DEFINITIONS) {
      if (!mod.isSuperAdminOnly) {
        viewOnly[mod.id] = ['view'];
      }
    }
    setFormData((prev) => ({ ...prev, permissions: viewOnly }));
  };

  const clearAllPermissions = () => {
    const empty: Record<string, AdminAction[]> = {};
    for (const mod of MODULE_DEFINITIONS) {
      if (!mod.isSuperAdminOnly) {
        empty[mod.id] = [];
      }
    }
    setFormData((prev) => ({ ...prev, permissions: empty }));
  };

  const handleSave = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched to trigger visual validation
    setTouched({
      name: true,
      username: true,
      email: true,
      password: true,
      permissions: true,
    });

    const validationErrors = validateForm(formData);
    const errorEntries = Object.entries(validationErrors);
    if (errorEntries.length > 0) {
      const firstErrorMessage = errorEntries[0][1];
      setFeedback({
        type: 'error',
        message: firstErrorMessage || 'Please resolve the highlighted validation errors before saving.',
      });
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const formattedPermissions = Object.entries(formData.permissions)
        .filter(([_, actions]) => actions && actions.length > 0)
        .map(([module, actions]) => ({ module, actions }));

      const res = await fetch('/api/admin/sub-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: formData._id,
          name: formData.name.trim(),
          username: formData.username.trim().toLowerCase(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password || undefined,
          role: formData.role,
          status: formData.status,
          permissions: formattedPermissions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Failed to save account.' });
        if (modalBodyRef.current) {
          modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      setFeedback({ type: 'success', message: data.message });

      if (formData._id) {
        setUsers(users.map((u) => (u._id === data.user._id ? { ...u, ...data.user } : u)));
      } else {
        setUsers([
          {
            ...data.user,
            createdAt: data.user.createdAt || new Date().toISOString(),
            lastLogin: null,
            isSuperAdmin: isSuperAdmin(data.user.role),
          },
          ...users,
        ]);
      }

      setTimeout(() => {
        setModalOpen(false);
      }, 700);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Network exception occurred.' });
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user: SubAdminUser) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    const confirmMsg =
      nextStatus === 'inactive'
        ? `Are you sure you want to deactivate ${user.username}? They will immediately be logged out and cannot log in.`
        : `Activate ${user.username}'s administrative access?`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch('/api/admin/sub-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          status: nextStatus,
          permissions: user.permissions,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map((u) => (u._id === user._id ? { ...u, status: nextStatus } : u)));
      } else {
        alert(data.error || 'Failed to update status.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating user status.');
    }
  };

  const handleDelete = async (user: SubAdminUser) => {
    if (user._id === currentAdminId) {
      alert('You cannot delete your own active administrative account.');
      return;
    }

    if (user.username === 'admin') {
      alert('The root admin account cannot be deleted.');
      return;
    }

    const confirmMsg = `WARNING: Are you sure you want to permanently delete '${user.username}'? This action cannot be undone.`;
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/sub-admins?id=${user._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== user._id));
      } else {
        alert(data.error || 'Failed to delete account.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting admin account.');
    }
  };

  const hasFilterActive = searchTerm !== '' || roleFilter !== 'all' || statusFilter !== 'all';

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>
            Identity & Access Management (RBAC)
          </span>
          <h1 style={{ margin: 0, fontSize: '2.1rem' }}>
            Sub-Admin Accounts & <span className="text-gradient">Role Governance</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', marginTop: '0.4rem', marginBottom: 0 }}>
            Provision sub-administrators, govern fine-grained module privileges (View, Create,
            Edit, Delete), and audit operational staff access.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.4rem' }}
        >
          <Icon name="user-plus" size={18} />
          <span>+ Add New Sub-Admin</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            Total Administrators
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{totalCount}</div>
          <div style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
            Registered administrative users
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            Super Administrators
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#c084fc' }}>{superCount}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
            Full system-wide authority
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            Sub-Administrators
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {subCount}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
            Granular RBAC restricted
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            Active Accounts
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399' }}>
            {activeCount}{' '}
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              / {totalCount}
            </span>
          </div>
          <div style={{ color: '#34d399', fontSize: '0.8rem', marginTop: '0.4rem' }}>
            Authorized & operational
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: '1', minWidth: '260px' }}>
          <input
            type="text"
            className="admin-input-control"
            placeholder="Search by name, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="admin-input-control"
            value={roleFilter}
            onChange={(e: any) => setRoleFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admins Only</option>
            <option value="sub_admin">Sub-Admins Only</option>
          </select>

          <select
            className="admin-input-control"
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {hasFilterActive && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="btn btn-outline"
              style={{ padding: '0.65rem 0.9rem', fontSize: '0.8rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Administrators Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th style={{ padding: '1rem 1.25rem' }}>Administrator</th>
              <th style={{ padding: '1rem 1.25rem' }}>Role & Authority</th>
              <th style={{ padding: '1rem 1.25rem' }}>Account Status</th>
              <th style={{ padding: '1rem 1.25rem' }}>Module Permissions</th>
              <th style={{ padding: '1rem 1.25rem' }}>Last Login</th>
              <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No administrators found matching your search criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isCurrent = user._id === currentAdminId;
                const activePermCount = Array.isArray(user.permissions)
                  ? user.permissions.filter((p) => p.actions && p.actions.length > 0).length
                  : 0;

                return (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: user.isSuperAdmin
                              ? 'rgba(192, 132, 252, 0.15)'
                              : 'rgba(0, 245, 255, 0.12)',
                            border: `1px solid ${
                              user.isSuperAdmin ? '#c084fc' : 'var(--accent-cyan)'
                            }`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: user.isSuperAdmin ? '#c084fc' : 'var(--accent-cyan)',
                            fontWeight: 700,
                            fontSize: '1rem',
                            flexShrink: 0,
                          }}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{user.name || user.username}</span>
                            {isCurrent && (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(0, 245, 255, 0.2)',
                                  color: 'var(--accent-cyan)',
                                  fontWeight: 600,
                                }}
                              >
                                You
                              </span>
                            )}
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                            @{user.username} &bull; {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      {user.isSuperAdmin ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            background: 'rgba(192, 132, 252, 0.12)',
                            border: '1px solid rgba(192, 132, 252, 0.4)',
                            color: '#e9d5ff',
                          }}
                        >
                          <Icon name="shield-check" size={14} />
                          Super Admin
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            background: 'rgba(0, 245, 255, 0.08)',
                            border: '1px solid rgba(0, 245, 255, 0.3)',
                            color: 'var(--accent-cyan)',
                          }}
                        >
                          <Icon name="user" size={14} />
                          Sub-Admin
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={isCurrent}
                        title={isCurrent ? 'Cannot deactivate your own account' : 'Click to toggle status'}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: isCurrent ? 'default' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '14px',
                          backgroundColor:
                            user.status === 'active'
                              ? 'rgba(52, 211, 153, 0.12)'
                              : 'rgba(239, 68, 68, 0.12)',
                          color: user.status === 'active' ? '#34d399' : '#f87171',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: user.status === 'active' ? '#34d399' : '#f87171',
                            boxShadow: `0 0 8px ${user.status === 'active' ? '#34d399' : '#f87171'}`,
                          }}
                        />
                        <span>{user.status === 'active' ? 'Active' : 'Suspended'}</span>
                      </button>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      {user.isSuperAdmin ? (
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: '#c084fc',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Icon name="shield-check" size={14} /> All Modules (Unrestricted Full Access)
                        </span>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', maxWidth: '340px' }}>
                          {activePermCount === 0 ? (
                            <span style={{ color: '#ff7b7b', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name="alert-triangle" size={13} /> No permissions assigned
                            </span>
                          ) : (
                            user.permissions
                              .filter((p) => p.actions && p.actions.length > 0)
                              .map((p) => {
                                const modDef = MODULE_DEFINITIONS.find((m) => m.id === p.module);
                                return (
                                  <span
                                    key={p.module}
                                    style={{
                                      fontSize: '0.75rem',
                                      padding: '3px 8px',
                                      borderRadius: '4px',
                                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                      border: '1px solid var(--border-color)',
                                      color: 'var(--text-main)',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {modDef?.label || p.module} ({p.actions.length})
                                  </span>
                                );
                              })
                          )}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }} suppressHydrationWarning>
                      {formatSafeDate(user.lastLogin)}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="btn btn-outline"
                          style={{ padding: '5px 12px', fontSize: '0.82rem' }}
                          title="Edit Permissions and Credentials"
                        >
                          <Icon name="edit" size={14} />
                          <span style={{ marginLeft: '4px' }}>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={isCurrent || user.username === 'admin'}
                          className="btn btn-outline"
                          style={{
                            padding: '5px 10px',
                            fontSize: '0.82rem',
                            color: '#f87171',
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                            opacity: isCurrent || user.username === 'admin' ? 0.35 : 1,
                            cursor: isCurrent || user.username === 'admin' ? 'not-allowed' : 'pointer',
                          }}
                          title={
                            isCurrent
                              ? 'Cannot delete your own account'
                              : user.username === 'admin'
                              ? 'Cannot delete the primary root admin'
                              : 'Permanently Delete Account'
                          }
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal Dialog */}
      {modalOpen && (
        <div className="admin-subadmin-modal-overlay">
          <div className="admin-subadmin-modal-card">
            {/* Modal Header */}
            <div className="admin-subadmin-modal-header">
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: '0.35rem' }}>
                  {formData._id ? 'Identity Modification' : 'Staff Provisioning'}
                </span>
                <h2 style={{ margin: 0, fontSize: '1.45rem', color: '#fff' }}>
                  {formData._id ? `Edit Account: ${formData.username}` : 'Create New Sub-Admin Account'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.75rem',
                  cursor: 'pointer',
                  padding: '4px',
                  lineHeight: 1,
                }}
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>

            {/* Form wrapping body and sticky footer */}
            <form
              id="subadmin-form"
              onSubmit={handleSave}
              noValidate
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
              }}
            >
              {/* Modal Scrollable Body */}
              <div className="admin-subadmin-modal-body" ref={modalBodyRef}>
                {/* Feedback Alert */}
                {feedback && (
                  <div
                    style={{
                      padding: '0.85rem 1.25rem',
                      borderRadius: '8px',
                      marginBottom: '1.5rem',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor:
                        feedback.type === 'success'
                          ? 'rgba(52, 211, 153, 0.12)'
                          : 'rgba(239, 68, 68, 0.12)',
                      border: `1px solid ${
                        feedback.type === 'success' ? '#34d399' : '#ef4444'
                      }`,
                      color: feedback.type === 'success' ? '#34d399' : '#ef4444',
                    }}
                  >
                    <Icon
                      name={feedback.type === 'success' ? 'check-circle' : 'alert-triangle'}
                      size={18}
                    />
                    <span>{feedback.message}</span>
                  </div>
                )}
                {/* Section 1: Account Credentials */}
                <div
                  style={{
                    padding: '1.5rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '1.75rem',
                  }}
                >
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--accent-cyan)' }}>
                      1. Account Identity & Credentials
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                      Define user authentication details, security password, and authority level.
                    </p>
                  </div>

                  <div className="grid grid-2" style={{ gap: '1.25rem' }}>
                    {/* Full Name Field */}
                    <div className="admin-field-group">
                      <label htmlFor="input-name" className="admin-field-label">
                        <Icon name="user" size={15} style={{ color: 'var(--accent-cyan)' }} />
                        <span>Full Name & Title</span>
                        <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <p className="admin-field-hint">
                        Staff member's legal name and organizational role
                      </p>
                      <input
                        id="input-name"
                        type="text"
                        className={`admin-input-control ${
                          touched.name && errors.name ? 'is-invalid' : touched.name ? 'is-valid' : ''
                        }`}
                        placeholder="e.g. Tariq Mehmood (Senior Threat Analyst)"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onBlur={() => handleBlur('name')}
                      />
                      {touched.name && errors.name && (
                        <div className="admin-field-error">
                          <Icon name="alert-triangle" size={13} />
                          <span>{errors.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Username Field */}
                    <div className="admin-field-group">
                      <label htmlFor="input-username" className="admin-field-label">
                        <Icon name="shield" size={15} style={{ color: 'var(--accent-cyan)' }} />
                        <span>Login Username</span>
                        <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <p className="admin-field-hint">
                        Unique handle for portal login (3-30 lowercase characters)
                      </p>
                      <input
                        id="input-username"
                        type="text"
                        className={`admin-input-control ${
                          touched.username && errors.username
                            ? 'is-invalid'
                            : touched.username
                            ? 'is-valid'
                            : ''
                        }`}
                        placeholder="e.g. tariq_soc"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value.toLowerCase() })
                        }
                        onBlur={() => handleBlur('username')}
                      />
                      {touched.username && errors.username && (
                        <div className="admin-field-error">
                          <Icon name="alert-triangle" size={13} />
                          <span>{errors.username}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-2" style={{ gap: '1.25rem', marginTop: '0.5rem' }}>
                    {/* Email Field */}
                    <div className="admin-field-group">
                      <label htmlFor="input-email" className="admin-field-label">
                        <Icon name="mail" size={15} style={{ color: 'var(--accent-cyan)' }} />
                        <span>Official Work Email</span>
                        <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <p className="admin-field-hint">
                        Corporate email for security alerts, reports, and inquiries
                      </p>
                      <input
                        id="input-email"
                        type="email"
                        className={`admin-input-control ${
                          touched.email && errors.email ? 'is-invalid' : touched.email ? 'is-valid' : ''
                        }`}
                        placeholder="e.g. tariq@dreamcybersecurity.pk"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value.toLowerCase() })
                        }
                        onBlur={() => handleBlur('email')}
                      />
                      {touched.email && errors.email && (
                        <div className="admin-field-error">
                          <Icon name="alert-triangle" size={13} />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="admin-field-group">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <label htmlFor="input-password" className="admin-field-label">
                          <Icon name="key" size={15} style={{ color: 'var(--accent-cyan)' }} />
                          <span>
                            {formData._id ? 'Password (Leave blank to keep current)' : 'Password'}
                          </span>
                          {!formData._id && <span style={{ color: '#ef4444' }}>*</span>}
                        </label>
                        <button
                          type="button"
                          onClick={generatePassword}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-cyan)',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 600,
                            padding: 0,
                          }}
                        >
                          <Icon name="key" size={12} />
                          <span>Generate Secure</span>
                        </button>
                      </div>
                      <p className="admin-field-hint">
                        Minimum 6 characters (recommended 8+ with uppercase, digits, symbols)
                      </p>
                      <div style={{ position: 'relative' }}>
                        <input
                          id="input-password"
                          type={showPassword ? 'text' : 'password'}
                          className={`admin-input-control ${
                            touched.password && errors.password
                              ? 'is-invalid'
                              : touched.password && formData.password
                              ? 'is-valid'
                              : ''
                          }`}
                          placeholder={formData._id ? '•••••••••••• (Unchanged)' : 'Enter secure password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          onBlur={() => handleBlur('password')}
                          style={{ paddingRight: '2.75rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
                        </button>
                      </div>

                      {/* Password Strength Meter */}
                      {formData.password && (
                        <div style={{ marginTop: '0.4rem' }}>
                          <div style={{ display: 'flex', gap: '4px', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                            <div
                              style={{
                                flex: 1,
                                backgroundColor:
                                  passwordStrength >= 1
                                    ? passwordStrength === 1
                                      ? '#ef4444'
                                      : passwordStrength === 2
                                      ? '#f59e0b'
                                      : '#10b981'
                                    : 'rgba(255,255,255,0.1)',
                              }}
                            />
                            <div
                              style={{
                                flex: 1,
                                backgroundColor:
                                  passwordStrength >= 2
                                    ? passwordStrength === 2
                                      ? '#f59e0b'
                                      : '#10b981'
                                    : 'rgba(255,255,255,0.1)',
                              }}
                            />
                            <div
                              style={{
                                flex: 1,
                                backgroundColor: passwordStrength >= 3 ? '#10b981' : 'rgba(255,255,255,0.1)',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color:
                                passwordStrength === 1
                                  ? '#ef4444'
                                  : passwordStrength === 2
                                  ? '#f59e0b'
                                  : '#10b981',
                              marginTop: '2px',
                              display: 'inline-block',
                            }}
                          >
                            Password Strength:{' '}
                            {passwordStrength === 1 ? 'Weak' : passwordStrength === 2 ? 'Moderate' : 'Strong'}
                          </span>
                        </div>
                      )}

                      {touched.password && errors.password && (
                        <div className="admin-field-error">
                          <Icon name="alert-triangle" size={13} />
                          <span>{errors.password}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-2" style={{ gap: '1.25rem', marginTop: '0.5rem' }}>
                    {/* Role Selector */}
                    <div className="admin-field-group">
                      <label htmlFor="select-role" className="admin-field-label">
                        <Icon name="shield-check" size={15} style={{ color: 'var(--accent-cyan)' }} />
                        <span>Administrative Authority</span>
                        <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <p className="admin-field-hint">
                        Sub-Admins are limited strictly to assigned modules; Super Admins hold complete authority
                      </p>
                      <select
                        id="select-role"
                        className="admin-input-control"
                        value={formData.role}
                        disabled={formData._id === currentAdminId && formData.role === 'super_admin'}
                        onChange={(e: any) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="sub_admin">Sub-Admin (Restricted to assigned modules below)</option>
                        <option value="super_admin">
                          Super Administrator (Full unrestricted access to all modules)
                        </option>
                      </select>
                    </div>

                    {/* Status Selector */}
                    <div className="admin-field-group">
                      <label htmlFor="select-status" className="admin-field-label">
                        <Icon name="check-circle" size={15} style={{ color: 'var(--accent-cyan)' }} />
                        <span>Account Access Status</span>
                        <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <p className="admin-field-hint">
                        Active allows immediate sign-in; Inactive revokes all active and future sessions
                      </p>
                      <select
                        id="select-status"
                        className="admin-input-control"
                        value={formData.status}
                        disabled={formData._id === currentAdminId}
                        onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="active">Active (Access Allowed)</option>
                        <option value="inactive">Inactive (Access Suspended)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Module Permissions */}
                <div
                  style={{
                    padding: '1.5rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--accent-cyan)' }}>
                        2. Granular Module & Action Permissions
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                        Configure View, Create, Edit, and Delete privileges for each section of the portal.
                      </p>
                    </div>

                    {formData.role === 'sub_admin' && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={selectAllPermissions}
                          className="btn btn-outline"
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={selectViewOnlyPermissions}
                          className="btn btn-outline"
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          View Only All
                        </button>
                        <button
                          type="button"
                          onClick={clearAllPermissions}
                          className="btn btn-outline"
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          Clear All
                        </button>
                      </div>
                    )}
                  </div>

                  {formData.role === 'super_admin' ? (
                    <div
                      style={{
                        padding: '1.25rem 1.5rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(192, 132, 252, 0.08)',
                        border: '1px solid rgba(192, 132, 252, 0.35)',
                        color: '#e9d5ff',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <Icon name="shield-check" size={24} style={{ color: '#c084fc', flexShrink: 0 }} />
                      <div>
                        <strong>Super Administrator Mode Enabled:</strong> This account has automatic and
                        unrestricted full privileges across all website modules, database entries, SEO
                        configurations, and sub-admin provisioning.
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Summary Counter Banner */}
                      <div
                        style={{
                          padding: '0.65rem 1rem',
                          borderRadius: '6px',
                          backgroundColor:
                            totalAssignedActions > 0
                              ? 'rgba(0, 245, 255, 0.05)'
                              : 'rgba(239, 68, 68, 0.08)',
                          border: `1px solid ${
                            totalAssignedActions > 0
                              ? 'rgba(0, 245, 255, 0.2)'
                              : 'rgba(239, 68, 68, 0.3)'
                          }`,
                          marginBottom: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.82rem',
                          flexWrap: 'wrap',
                          gap: '6px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Icon
                            name={totalAssignedActions > 0 ? 'check-circle' : 'alert-triangle'}
                            size={16}
                            style={{ color: totalAssignedActions > 0 ? 'var(--accent-cyan)' : '#f87171' }}
                          />
                          <span>
                            {totalAssignedActions > 0 ? (
                              <>
                                <strong>{totalAssignedModules}</strong> of{' '}
                                <strong>
                                  {MODULE_DEFINITIONS.filter((m) => !m.isSuperAdminOnly).length}
                                </strong>{' '}
                                modules active &bull; <strong>{totalAssignedActions}</strong> specific
                                actions granted
                              </>
                            ) : (
                              <strong style={{ color: '#f87171' }}>
                                No permissions assigned. You must select at least 1 module for this sub-admin.
                              </strong>
                            )}
                          </span>
                        </div>
                      </div>

                      {errors.permissions && (
                        <div className="admin-field-error" style={{ marginBottom: '1rem' }}>
                          <Icon name="alert-triangle" size={14} />
                          <span>{errors.permissions}</span>
                        </div>
                      )}

                      {/* Permissions Matrix Table */}
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                              <th style={{ padding: '0.85rem 1rem' }}>Module & Route</th>
                              <th style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>View</th>
                              <th style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>Create</th>
                              <th style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>Edit</th>
                              <th style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>Delete</th>
                              <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Row Quick Select</th>
                            </tr>
                          </thead>
                          <tbody>
                            {MODULE_DEFINITIONS.filter((m) => !m.isSuperAdminOnly).map((mod) => {
                              const currentActions = formData.permissions[mod.id] || [];
                              const hasView = currentActions.includes('view');
                              const hasCreate = currentActions.includes('create');
                              const hasEdit = currentActions.includes('edit');
                              const hasDelete = currentActions.includes('delete');

                              const supportsCreate = mod.supportedActions.includes('create');
                              const supportsEdit = mod.supportedActions.includes('edit');
                              const supportsDelete = mod.supportedActions.includes('delete');

                              const isRowFull = mod.supportedActions.every((a) =>
                                currentActions.includes(a)
                              );

                              return (
                                <tr
                                  key={mod.id}
                                  style={{
                                    borderBottom: '1px solid var(--border-color)',
                                    backgroundColor:
                                      currentActions.length > 0 ? 'rgba(0, 245, 255, 0.02)' : 'transparent',
                                  }}
                                >
                                  <td style={{ padding: '0.85rem 1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <div
                                        style={{
                                          width: '32px',
                                          height: '32px',
                                          borderRadius: '6px',
                                          backgroundColor: 'rgba(0, 245, 255, 0.08)',
                                          border: '1px solid rgba(0, 245, 255, 0.25)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: 'var(--accent-cyan)',
                                          flexShrink: 0,
                                        }}
                                      >
                                        <Icon name={mod.icon} size={16} />
                                      </div>
                                      <div>
                                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>
                                          {mod.label}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                                          <code>{mod.path}</code> &bull; {mod.description}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* View */}
                                  <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                                    <input
                                      type="checkbox"
                                      className="admin-matrix-checkbox"
                                      checked={hasView}
                                      onChange={() => togglePermission(mod.id, 'view')}
                                      title={`View ${mod.label}`}
                                    />
                                  </td>

                                  {/* Create */}
                                  <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                                    {supportsCreate ? (
                                      <input
                                        type="checkbox"
                                        className="admin-matrix-checkbox"
                                        checked={hasCreate}
                                        onChange={() => togglePermission(mod.id, 'create')}
                                        title={`Create items in ${mod.label}`}
                                      />
                                    ) : (
                                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                                    )}
                                  </td>

                                  {/* Edit */}
                                  <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                                    {supportsEdit ? (
                                      <input
                                        type="checkbox"
                                        className="admin-matrix-checkbox"
                                        checked={hasEdit}
                                        onChange={() => togglePermission(mod.id, 'edit')}
                                        title={`Edit items in ${mod.label}`}
                                      />
                                    ) : (
                                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                                    )}
                                  </td>

                                  {/* Delete */}
                                  <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                                    {supportsDelete ? (
                                      <input
                                        type="checkbox"
                                        className="admin-matrix-checkbox"
                                        checked={hasDelete}
                                        onChange={() => togglePermission(mod.id, 'delete')}
                                        title={`Delete items in ${mod.label}`}
                                      />
                                    ) : (
                                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                                    )}
                                  </td>

                                  {/* Row Quick Toggle */}
                                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                    <button
                                      type="button"
                                      onClick={() => toggleRowAll(mod)}
                                      className="btn btn-outline"
                                      style={{
                                        padding: '3px 8px',
                                        fontSize: '0.72rem',
                                        color: isRowFull ? 'var(--accent-cyan)' : 'var(--text-muted)',
                                        borderColor: isRowFull ? 'var(--accent-cyan)' : 'var(--border-color)',
                                      }}
                                    >
                                      {isRowFull ? 'Deselect All' : 'Select All'}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div className="admin-subadmin-modal-footer">
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '60%' }}>
                  {feedback && feedback.type === 'error' ? (
                    <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      <Icon name="alert-triangle" size={15} />
                      <span>{feedback.message}</span>
                    </span>
                  ) : formData.role === 'super_admin' ? (
                    <span style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon name="shield-check" size={15} />
                      Full Super Administrator authority enabled
                    </span>
                  ) : totalAssignedActions > 0 ? (
                    <span style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon name="check-circle" size={15} />
                      {totalAssignedModules} module(s) enabled ({totalAssignedActions} total actions)
                    </span>
                  ) : (
                    <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon name="alert-triangle" size={15} />
                      Sub-Admins require at least 1 module assignment
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-outline"
                    disabled={saving}
                    style={{ padding: '0.7rem 1.4rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={saving}
                    style={{ minWidth: '160px', padding: '0.7rem 1.4rem' }}
                  >
                    {saving ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Icon name="refresh-cw" size={14} style={{ animation: 'radar-spin 0.85s linear infinite' }} />
                        Saving...
                      </span>
                    ) : formData._id ? (
                      'Update Account'
                    ) : (
                      'Create Sub-Admin'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
