import { Text, View } from 'react-native';
export const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <View accessibilityLabel="empty-state" style={{ gap: 6, padding: 16 }}><Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text><Text>{description}</Text></View>
);
