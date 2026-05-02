import { Text, TextInput, View } from 'react-native';
import { tokens } from '../theme/tokens';

export const Input = ({ label, ...props }: React.ComponentProps<typeof TextInput> & { label?: string }) => (
  <View style={{ gap: 6 }}>
    {label ? <Text style={{ color: tokens.color.textSecondary, fontSize: tokens.typography.caption.fontSize }}>{label}</Text> : null}
    <TextInput
      accessibilityLabel={props.accessibilityLabel ?? label}
      placeholderTextColor={tokens.color.textSecondary}
      style={{ borderWidth: 1, borderColor: tokens.color.border, borderRadius: tokens.radius.md, padding: tokens.spacing.md, color: tokens.color.textPrimary, minHeight: 44 }}
      {...props}
    />
  </View>
);
