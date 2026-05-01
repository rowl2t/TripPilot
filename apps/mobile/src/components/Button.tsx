import { Pressable, Text } from 'react-native';

import { lightTokens } from '../theme/tokens';

export const Button = ({ label, onPress, accessibilityLabel }: { label: string; onPress?: () => void; accessibilityLabel?: string }) => (
  <Pressable
    accessibilityLabel={accessibilityLabel ?? label}
    onPress={onPress}
    style={{ backgroundColor: lightTokens.color.primary, padding: lightTokens.spacing.md, borderRadius: lightTokens.radius.md }}
  >
    <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>{label}</Text>
  </Pressable>
);
