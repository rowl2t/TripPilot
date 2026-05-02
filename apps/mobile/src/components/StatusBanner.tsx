import { Text, View } from 'react-native';

const flags = [
  process.env.EXPO_PUBLIC_OPENAI_DEGRADED === '1' ? 'AI 생성 지연: 기존 일정 조회는 가능하며 새 생성은 대기/재시도됩니다.' : null,
  process.env.EXPO_PUBLIC_PLACES_DEGRADED === '1' ? '장소 검증 지연: AI 후보는 표시되며 검증 필요 배지가 붙습니다.' : null,
  process.env.EXPO_PUBLIC_REVENUECAT_DEGRADED === '1' ? '구독 상태 확인 지연: 최근 entitlement cache를 사용합니다.' : null,
  process.env.EXPO_PUBLIC_WORKER_DEGRADED === '1' ? '작업 큐 지연: pending 유지, 재시도 버튼을 사용하세요.' : null,
  process.env.EXPO_PUBLIC_SUPABASE_DEGRADED === '1' ? '일시적 서버 오류: 잠시 후 다시 시도해 주세요.' : null
].filter(Boolean) as string[];

export const StatusBanner = () => {
  if (!flags.length) return null;
  return (
    <View style={{ backgroundColor: '#40311A', padding: 10, gap: 4 }}>
      {flags.map((m) => <Text key={m} style={{ color: '#FFD8A8', fontSize: 12 }}>{m}</Text>)}
    </View>
  );
};
