import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';

export default function HomeScreen() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Badge label="AI Concierge" />
      <Card>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>첫 여행을 1분 안에 시작해보세요</Text>
        <Text>아직 생성된 여행이 없어요. 최소 정보만 입력하면 AI 초안이 바로 만들어집니다.</Text>
        <Button label="첫 여행 만들기" onPress={() => router.push('/trips/new')} />
      </Card>
      <Card>
        <Text style={{ fontWeight: '700' }}>예시 여행 카드</Text>
        <Text>도쿄 3박4일 · 먹거리+문화 · 예산 2,000 USD</Text>
      </Card>
      <Card>
        <Text style={{ fontWeight: '700' }}>저장한 SNS 링크 반영</Text>
        <Text>인스타/유튜브/블로그 링크를 저장하면 장소 후보에 자동 반영됩니다.</Text>
        <Button label="저장 링크 추가" variant="secondary" onPress={() => router.push('/(tabs)/saved')} />
      </Card>
    </View>
  );
}
