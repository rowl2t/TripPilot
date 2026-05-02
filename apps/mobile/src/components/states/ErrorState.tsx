import { AccessibilityInfo, Text, View } from 'react-native';
import { uxCopy } from '@trippilot/config';
import { Button } from '../Button';

export const ErrorState = ({ message, onRetry }: { message?: string; onRetry?: () => void }) => {
  const msg = message ?? uxCopy.errors.generic;
  AccessibilityInfo.announceForAccessibility(msg);
  return (
    <View style={{ padding: 16, gap: 8 }} accessibilityLiveRegion="polite">
      <Text style={{ fontWeight: '700' }}>문제가 발생했어요</Text>
      <Text>{msg}</Text>
      <Text style={{ opacity: 0.8 }}>{uxCopy.common.support}</Text>
      {onRetry ? <Button label={uxCopy.common.retry} onPress={onRetry} variant="secondary" /> : null}
    </View>
  );
};
