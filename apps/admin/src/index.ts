export interface AdminGuardContext {
  isAuthenticated: boolean;
  role?: string | null;
  profileIsAdmin?: boolean;
}

export const canAccessAdmin = ({ isAuthenticated, role, profileIsAdmin }: AdminGuardContext): boolean => {
  if (!isAuthenticated) return false;
  return role === 'admin' || profileIsAdmin === true;
};
