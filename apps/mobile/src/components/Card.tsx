import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

import { tokens } from '../theme/tokens';

export const Card = ({ children }: PropsWithChildren) => (
  <View style={{ backgroundColor: tokens.color.surface, borderRadius: tokens.radius.lg, padding: tokens.spacing.lg, borderWidth: 1, borderColor: tokens.color.border, ...tokens.shadow.card }}>{children}</View>
);
