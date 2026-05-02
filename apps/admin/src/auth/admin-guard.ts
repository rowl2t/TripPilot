export interface AdminGuardContext {
  isAuthenticated: boolean;
  role?: string | null;
  profileIsAdmin?: boolean;
}

export class AdminAccessError extends Error {
  constructor(message = 'Admin role required') {
    super(message);
    this.name = 'AdminAccessError';
  }
}

export const canAccessAdmin = ({ isAuthenticated, role, profileIsAdmin }: AdminGuardContext): boolean => {
  if (!isAuthenticated) return false;

  const normalizedRole = role?.trim().toLowerCase();
  return normalizedRole === 'admin' || profileIsAdmin === true;
};

export const assertAdminAccess = (ctx: AdminGuardContext): void => {
  if (!canAccessAdmin(ctx)) {
    throw new AdminAccessError();
  }
};
