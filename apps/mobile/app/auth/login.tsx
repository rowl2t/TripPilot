import { Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';

export default function LoginScreen() {
  return <View style={{ padding: 16, gap: 10 }}><Text style={{ fontSize: 22, fontWeight: '700' }}>로그인</Text><Input accessibilityLabel="email-input" placeholder="Email" /><Input accessibilityLabel="password-input" placeholder="Password" secureTextEntry /><Button label="로그인" /></View>;
}
