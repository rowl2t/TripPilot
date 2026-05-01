export const lightTokens = {
  color: {
    bg: '#F4F8FB',
    surface: '#FFFFFF',
    text: '#0C1B2A',
    muted: '#5C6B7B',
    primary: '#0B3A66',
    accent: '#2ED3C6',
    border: '#D9E2EC',
    danger: '#C0392B'
  },
  radius: { sm: 10, md: 14, lg: 20 },
  spacing: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 }
};

export const darkTokens = {
  ...lightTokens,
  color: {
    bg: '#08111A',
    surface: '#102131',
    text: '#E6F0FA',
    muted: '#98A9BA',
    primary: '#2A78C2',
    accent: '#36E2D3',
    border: '#274057',
    danger: '#FF7667'
  }
};

export type ThemeTokens = typeof lightTokens;
