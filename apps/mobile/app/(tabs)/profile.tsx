import { useState } from 'react';
import { Text, View } from 'react-native';
import { useUiStore } from '../../src/state/ui-store';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { useEntitlement, usePaywallActions, useUsage, useUsageGate } from '../../src/hooks/use-monetization';

export default function ProfileScreen() {
  const ui = useUiStore();
  const ent = useEntitlement();
  const usage = useUsage();
  const gate = useUsageGate();
  const paywall = usePaywallActions();
  const [message, setMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

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
    

      <Card>
        <Text style={{ fontWeight: '700' }}>Privacy</Text>
        <Button label="데이터 내보내기(JSON)" variant="secondary" onPress={async () => {
          setMessage('데이터 내보내기 요청은 로그인 후 서버 연결 환경에서 가능합니다.');
        }} />
        <Button label={deleteConfirm ? '계정 삭제 요청 확인(DELETE)' : '계정 삭제 요청'} variant="danger" onPress={async () => {
          if (!deleteConfirm) return setDeleteConfirm(true);
          setMessage('계정 삭제 요청은 로그인 후 서버 연결 환경에서 가능합니다.');
          setDeleteConfirm(false);
        }} />
      </Card>


      <Card>
        <Text style={{ fontWeight: '700' }}>Support & Feedback</Text>
        <Button label="문의 등록 (AI 일정 품질)" variant="secondary" onPress={async () => {
          setMessage('문의 제출은 로그인 후 서버 연결 환경에서 가능합니다.');
        }} />
        <Button label="AI 피드백 제출" variant="secondary" onPress={async () => {
          setMessage('피드백 제출은 로그인 후 서버 연결 환경에서 가능합니다.');
        }} />
      </Card>

      <View style={{ marginTop: 16, gap: 8 }}>
        <Text style={{ fontWeight: '700' }}>알림 설정</Text>
        <Button label={`알림 전체: ${ui.notificationEnabled ? 'ON' : 'OFF'}`} onPress={() => ui.setNotificationSettings({ notificationEnabled: !ui.notificationEnabled })} variant="secondary" />
        <Button label={`예약 알림: ${ui.bookingReminders ? 'ON' : 'OFF'}`} onPress={() => ui.setNotificationSettings({ bookingReminders: !ui.bookingReminders })} variant="secondary" />
        <Button label={`여행 알림: ${ui.tripReminders ? 'ON' : 'OFF'}`} onPress={() => ui.setNotificationSettings({ tripReminders: !ui.tripReminders })} variant="secondary" />
        <Button label={`마케팅 알림: ${ui.marketingReminders ? 'ON' : 'OFF'}`} onPress={() => ui.setNotificationSettings({ marketingReminders: !ui.marketingReminders })} variant="secondary" />
      </View>

    </View>
  );
}
