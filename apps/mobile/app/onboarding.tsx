import { Text, View } from 'react-native';
import { Button } from '../src/components/Button';

export default function OnboardingScreen() {
  return <View style={{ padding: 16, gap: 10 }}><Text style={{ fontWeight: '700', fontSize: 22 }}>TripPilot 온보딩</Text><Text>여행 스타일과 예산을 설정하면 더 정확한 일정을 생성합니다.</Text><Button label="시작하기" /></View>;
}
