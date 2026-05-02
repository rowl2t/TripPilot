import { useLocalSearchParams } from 'expo-router';
import { Linking, Text, View } from 'react-native';

import { Button } from '../../../../src/components/Button';
import { Card } from '../../../../src/components/Card';
import { EmptyState } from '../../../../src/components/states/EmptyState';
import { ErrorState } from '../../../../src/components/states/ErrorState';
import { LoadingState } from '../../../../src/components/states/LoadingState';
import { useBookingTaskPatch, useBookingTasks } from '../../../../src/hooks/use-booking-tasks';
import { buildBookingLink, buildOutboundClickEvent } from '@trippilot/api-client';

export default function BookingChecklistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useBookingTasks(id ?? '');
  const patch = useBookingTaskPatch(id ?? '');

  if (q.isLoading) return <LoadingState />;
  if (q.isError) return <ErrorState message={(q.error as Error).message} />;
  if (!q.data?.length) return <EmptyState title="예약 항목 없음" description="AI 일정 생성 후 자동 생성됩니다." />;

  return (
    <View style={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>예약 체크리스트</Text>
      <Text>가격/재고는 실시간 변동될 수 있으며 최종 예약은 제휴사 사이트에서 진행됩니다.</Text>
      {q.data.map((task) => (
        <Card key={String(task.id)}>
          <Text style={{ fontWeight: '700' }}>{String(task.title)}</Text>
          <Text>권장 시점: {String(task.recommended_booking_window ?? '-')}</Text>
          <Text>상태: {String(task.status)}</Text>
          <Text>제공사: {String(task.affiliate_provider ?? 'auto')}</Text>
          <Text>가격/재고는 변동될 수 있으며 최종 조건은 외부 사이트에서 확인하세요.</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button label="완료" onPress={() => patch.mutate({ taskId: String(task.id), patch: { status: 'done' } })} />
            <Button label="스킵" onPress={() => patch.mutate({ taskId: String(task.id), patch: { status: 'skipped' } })} />
            <Button label="다시 열기" onPress={() => patch.mutate({ taskId: String(task.id), patch: { status: 'todo' } })} />

            <Button label="예약 링크 열기" variant="secondary" onPress={() => {
              const link = buildBookingLink({
                taskType: String(task.task_type ?? 'activity') as any,
                destination: String(task.destination_text ?? 'travel'),
                startDate: String(task.start_date ?? ''),
                endDate: String(task.end_date ?? ''),
                travelers: Number(task.travelers_count ?? 1),
                currency: String(task.currency ?? 'USD'),
                tripId: id
              }, { provider: (task.affiliate_provider as any) ?? undefined, providerAvailable: Boolean(task.provider_available ?? true) });
              patch.mutate({ taskId: String(task.id), patch: { affiliate_url: link.url, outbound_click_event: buildOutboundClickEvent({ provider: link.provider as any, taskType: String(task.task_type ?? 'activity') as any, tripId: id, taskId: String(task.id) }) } });
              void Linking.openURL(link.url);
            }} />
            <Button label="링크 오류 신고" variant="ghost" onPress={() => patch.mutate({ taskId: String(task.id), patch: { link_issue_reported_at: new Date().toISOString() } })} />

          </View>
        </Card>
      ))}
    </View>
  );
}
