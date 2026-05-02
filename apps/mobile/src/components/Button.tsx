import { Pressable, Text } from 'react-native';

import { tokens } from '../theme/tokens';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  accessibilityLabel?: string;
}

const bgByVariant = {
  primary: tokens.color.brand,
  secondary: tokens.color.surfaceElevated,
  ghost: 'transparent',
  danger: tokens.color.danger
} as const;

export const Button = ({ label, onPress, disabled, loading, variant = 'primary', accessibilityLabel }: ButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel ?? label}
    disabled={disabled || loading}
    onPress={onPress}
    style={({ pressed }) => ({
      backgroundColor: pressed ? tokens.color.brandPressed : bgByVariant[variant],
      borderRadius: tokens.radius.md,
      minHeight: 44,
      justifyContent: 'center',
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg,
      borderWidth: variant === 'ghost' ? 1 : 0,
      borderColor: tokens.color.border,
      opacity: disabled ? 0.5 : 1
    })}
  >
    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>{loading ? '로딩중...' : label}</Text>
  </Pressable>
);
