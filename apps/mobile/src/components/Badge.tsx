import { Text, View } from 'react-native';
import { lightTokens } from '../theme/tokens';

export const Badge = ({ label }: { label: string }) => (
  <View style={{ alignSelf: 'flex-start', backgroundColor: lightTokens.color.accent, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
    <Text style={{ color: '#032127', fontWeight: '700', fontSize: 12 }}>{label}</Text>
  </View>
);
