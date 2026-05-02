import { Text, View } from 'react-native';

import { tokens } from '../../theme/tokens';
import { Button } from '../Button';

export const EmptyState = ({ title, description, ctaLabel, onCtaPress }: { title: string; description?: string; ctaLabel?: string; onCtaPress?: () => void }) => (
  <View style={{ padding: tokens.spacing.xl, alignItems: 'center', gap: tokens.spacing.sm }}>
    <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: tokens.color.surfaceElevated }} />
    <Text style={{ color: tokens.color.textPrimary, fontSize: tokens.typography.h2.fontSize, fontWeight: tokens.typography.h2.fontWeight }}>{title}</Text>
    {description ? <Text style={{ color: tokens.color.textSecondary, textAlign: 'center' }}>{description}</Text> : null}
    {ctaLabel && onCtaPress ? <Button label={ctaLabel} onPress={onCtaPress} /> : null}
  </View>
);
