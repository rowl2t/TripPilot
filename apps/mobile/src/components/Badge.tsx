import { Text, View } from 'react-native';

import { tokens } from '../theme/tokens';

export const Badge = ({ label, tone = 'default' }: { label: string; tone?: 'default' | 'success' | 'warning' | 'danger' }) => {
  const toneColor = tone === 'success' ? tokens.color.success : tone === 'warning' ? tokens.color.warning : tone === 'danger' ? tokens.color.danger : tokens.color.brand;
  return (
    <View style={{ alignSelf: 'flex-start', borderRadius: tokens.radius.pill, paddingHorizontal: tokens.spacing.sm, paddingVertical: tokens.spacing.xs, backgroundColor: `${toneColor}22`, borderWidth: 1, borderColor: `${toneColor}66` }}>
      <Text style={{ color: toneColor, fontSize: tokens.typography.caption.fontSize }}>{label}</Text>
    </View>
  );
};
