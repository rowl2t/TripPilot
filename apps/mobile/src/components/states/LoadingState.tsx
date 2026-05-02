import { Text, View } from 'react-native';
import { uxCopy } from '@trippilot/config';

export const LoadingState = () => (
  <View style={{ padding: 16, gap: 8 }}>
    <Text style={{ fontWeight: '700' }}>{uxCopy.planning.loadingTitle}</Text>
    <Text>{uxCopy.planning.loadingDescription}</Text>
    <Text style={{ opacity: 0.8 }}>{uxCopy.planning.disclaimer}</Text>
  </View>
);
