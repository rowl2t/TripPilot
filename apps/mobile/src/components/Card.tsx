import type { ReactNode } from 'react';
import { View } from 'react-native';
import { lightTokens } from '../theme/tokens';

export const Card = ({ children }: { children: ReactNode }) => (
  <View style={{ backgroundColor: lightTokens.color.surface, borderRadius: lightTokens.radius.lg, padding: lightTokens.spacing.md, borderWidth: 1, borderColor: lightTokens.color.border }}>{children}</View>
);
