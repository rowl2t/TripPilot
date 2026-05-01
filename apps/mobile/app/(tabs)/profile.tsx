import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { useEntitlement, usePaywallActions, useUsage, useUsageGate } from '../../src/hooks/use-monetization';

export default function ProfileScreen() {
  const ent = useEntitlement();
  const usage = useUsage();
  const gate = useUsageGate();
  const paywall = usePaywallActions();
  const [message, setMessage] = useState('');

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 20 }}>Profile & Subscription</Text>
      <Card>
        <Text>현재 플랜: {String(ent.data?.plan ?? 'free')}</Text>
        <Text>AI 사용량: {String(usage.data?.ai_runs_this_month ?? 0)} / {String(ent.data?.ai_generation_limit ?? 2)}</Text>
        <Button label="AI 생성 가능 여부 확인" onPress={async () => {
          const result = await gate.mutateAsync('ai_generation');
          setMessage(result.ok ? (result.data.allowed ? '사용 가능' : `제한: ${result.data.reason}`) : '확인 실패');
        }} />
        <Text>{message}</Text>
      </Card>
      <Card>
        <Button label="Pro 업그레이드" onPress={async () => setMessage(JSON.stringify(await paywall.offerings()))} />
        <Button label="구매 복원" onPress={async () => setMessage(JSON.stringify(await paywall.restore()))} />
      </Card>
    </View>
  );
}
