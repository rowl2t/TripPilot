import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { mobileAuthClient } from '../../src/index';
import { submitTripPlanning } from '../../src/state/trip-planning-service';
import { useTripDraftStore } from '../../src/state/trip-draft-store';

export default function NewTripScreen() {
  const { draft, step, setField, next, prev } = useTripDraftStore();
  const [message, setMessage] = useState('');

  const submit = async () => {
    const result = await submitTripPlanning(mobileAuthClient, draft);
    setMessage(result.ok ? `Planning started: ${result.data.planningJobId}` : result.error.message);
  };

  return (
    <View style={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>새 여행 만들기 - Step {step}/7</Text>
      {step === 1 && <Input accessibilityLabel="destination" placeholder="어디로 가나요?" onChangeText={(v) => setField('destination_text', v)} value={String(draft.destination_text ?? '')} />}
      {step === 2 && <><Input placeholder="시작일 (YYYY-MM-DD)" onChangeText={(v) => setField('start_date', v)} /><Input placeholder="종료일 (YYYY-MM-DD)" onChangeText={(v) => setField('end_date', v)} /></>}
      {step === 3 && <Input placeholder="인원수" keyboardType="number-pad" onChangeText={(v) => setField('travelers_count', Number(v || 1))} />}
      {step === 4 && <Input placeholder="예산 (USD)" keyboardType="number-pad" onChangeText={(v) => setField('budget', { amount: Number(v || 0), currency: 'USD', budget_level: 'standard' })} />}
      {step === 5 && <Input placeholder="스타일 (쉼표로 구분)" onChangeText={(v) => setField('travel_styles', v.split(',').map((x) => x.trim()).filter(Boolean))} />}
      {step === 6 && <Input placeholder="제약 사항" onChangeText={(v) => setField('avoid_text', v)} />}
      {step === 7 && <Input placeholder="출발지" onChangeText={(v) => setField('origin_text', v)} value={String(draft.origin_text ?? '')} />}

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button label="이전" onPress={prev} />
        {step < 7 ? <Button label="다음" onPress={next} /> : <Button label="생성 시작" onPress={submit} />}
      </View>
      <Text>{message}</Text>
    </View>
  );
}
