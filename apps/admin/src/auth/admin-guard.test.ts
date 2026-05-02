import { describe, expect, it } from 'vitest';
import { assertAdminAccess, canAccessAdmin } from './admin-guard';

describe('admin guard', () => {
  it('allows admin role', () => {
    expect(canAccessAdmin({ isAuthenticated: true, role: 'admin' })).toBe(true);
  });

  it('allows profile admin fallback', () => {
    expect(canAccessAdmin({ isAuthenticated: true, role: 'user', profileIsAdmin: true })).toBe(true);
  });

  it('throws for non-admin', () => {
    expect(() => assertAdminAccess({ isAuthenticated: true, role: 'user' })).toThrow('Admin role required');
  });
});
