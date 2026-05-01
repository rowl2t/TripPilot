import { Text, View } from 'react-native';
export const ErrorState = ({ message }: { message: string }) => <View accessibilityLabel="error-state" style={{ padding: 16 }}><Text>{message}</Text></View>;
