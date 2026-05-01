import { TextInput } from 'react-native';
import { lightTokens } from '../theme/tokens';

export const Input = (props: React.ComponentProps<typeof TextInput>) => (
  <TextInput
    accessibilityLabel={props.accessibilityLabel}
    placeholderTextColor={lightTokens.color.muted}
    style={{ borderWidth: 1, borderColor: lightTokens.color.border, borderRadius: lightTokens.radius.md, padding: lightTokens.spacing.md, color: lightTokens.color.text }}
    {...props}
  />
);
