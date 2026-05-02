export const tokens = {
  color: {
    bg: '#0B1020',
    surface: '#121A2B',
    surfaceElevated: '#1B2740',
    textPrimary: '#F5F7FB',
    textSecondary: '#A9B4C7',
    brand: '#4F7CFF',
    brandPressed: '#3F67D8',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    border: '#2B3958'
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radius: { sm: 8, md: 12, lg: 16, pill: 999 },
  typography: {
    h1: { fontSize: 24, fontWeight: '700' as const },
    h2: { fontSize: 20, fontWeight: '700' as const },
    body: { fontSize: 15, fontWeight: '400' as const },
    caption: { fontSize: 13, fontWeight: '500' as const }
  },
  shadow: {
    card: { shadowColor: '#000', shadowOpacity: 0.24, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 }
  },
  icon: { sm: 14, md: 18, lg: 22 }
};
