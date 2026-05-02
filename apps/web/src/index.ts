export const PUBLIC_ROUTES = ['/', '/pricing', '/about', '/auth/callback'];

export const isProtectedRoute = (pathname: string): boolean => pathname.startsWith('/account');

export const resolveWebRoute = (pathname: string, isAuthenticated: boolean): string => {
  if (isProtectedRoute(pathname) && !isAuthenticated) return '/';
  return pathname;
};

export const parseAuthCallback = (hash: string): Record<string, string> =>
  Object.fromEntries(new URLSearchParams(hash.replace(/^#/, '')));
