import { useState } from 'react';
import { toSafeErrorMessage, uxCopy } from '@trippilot/config';
import { Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Input } from '../../src/components/Input';
import { mobileAuthClient } from '../../src/index';
import { submitTripPlanning } from '../../src/state/trip-planning-service';
import { useTripDraftStore } from '../../src/state/trip-draft-store';

export default function NewTripScreen() {
  const { draft, setField } = useTripDraftStore();
  const [message, setMessage] = useState('1분 안에 초안을 만들어요');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const submit = async () => {
    setMessage('AI planning 진행 중: 입력 검증 → 장소 후보 수집 → 일정 초안 생성');
    const result = await submitTripPlanning(mobileAuthClient, draft);
    setMessage(result.ok ? `생성 시작 완료!\n작업 ID: ${result.data.planningJobId}\n생성 중 이탈해도 홈/알림에서 확인할 수 있어요.` : toSafeErrorMessage(result.error.message));
  };

  return (
    <View style={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>첫 여행 만들기 (최소 입력)</Text>
      <Text>{message}</Text>
      <Card>
        <Input accessibilityLabel="destination" placeholder="여행지" onChangeText={(v) => setField('destination_text', v)} value={String(draft.destination_text ?? '')} />
        <Input placeholder="시작일 (YYYY-MM-DD)" onChangeText={(v) => setField('start_date', v)} value={String(draft.start_date ?? '')} />
        <Input placeholder="종료일 (YYYY-MM-DD)" onChangeText={(v) => setField('end_date', v)} value={String(draft.end_date ?? '')} />
        <Input placeholder="예산 (USD)" keyboardType="number-pad" onChangeText={(v) => setField('budget', { amount: Number(v || 0), currency: 'USD', budget_level: 'standard' })} />
        <Input placeholder="스타일 (예: food,culture)" onChangeText={(v) => setField('travel_styles', v.split(',').map((x) => x.trim()).filter(Boolean))} value={Array.isArray(draft.travel_styles) ? draft.travel_styles.join(',') : ''} />
      </Card>

      <Button label={showAdvanced ? '고급 옵션 숨기기' : '고급 옵션 보기'} variant="ghost" onPress={() => setShowAdvanced((v) => !v)} />
      {showAdvanced ? <Card>
        <Input placeholder="인원수" keyboardType="number-pad" onChangeText={(v) => setField('travelers_count', Number(v || 1))} />
        <Input placeholder="출발지" onChangeText={(v) => setField('origin_text', v)} value={String(draft.origin_text ?? '')} />
        <Input placeholder="제약 사항" onChangeText={(v) => setField('avoid_text', v)} value={String((draft as any).avoid_text ?? '')} />
      </Card> : null}

      <Button label="AI로 초안 만들기" onPress={submit} />
      <Text>{uxCopy.planning.disclaimer}</Text>
      <Text>로그인 전에도 체험 생성이 가능하며, 저장/동기화 시 로그인 안내가 표시됩니다.</Text>
    </View>
  );
}
