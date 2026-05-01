import { Text, View } from 'react-native';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';

export default function HomeScreen() {
  return <View style={{ padding: 16, gap: 12 }}><Badge label="AI Concierge" /><Card><Text style={{ fontSize: 22, fontWeight: '700' }}>Welcome to TripPilot</Text><Text>다음 여행을 3분 안에 만들어보세요.</Text></Card><Button label="새 여행 만들기" /></View>;
}
