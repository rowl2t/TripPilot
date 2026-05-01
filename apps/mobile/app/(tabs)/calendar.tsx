import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/states/EmptyState';
import { ErrorState } from '../../src/components/states/ErrorState';
import { LoadingState } from '../../src/components/states/LoadingState';
import { exportIcsText, useCalendarEvents, useMaterializeCalendarEvents } from '../../src/hooks/use-calendar-events';

const DEMO_TRIP_ID = '11111111-1111-1111-1111-111111111111';
const DEMO_USER_ID = '11111111-1111-1111-1111-111111111111';

export default function CalendarScreen() {
  const [icsPreview, setIcsPreview] = useState('');
  const q = useCalendarEvents(DEMO_TRIP_ID);
  const mat = useMaterializeCalendarEvents(DEMO_TRIP_ID, DEMO_USER_ID);

  if (q.isLoading) return <LoadingState />;
  if (q.isError) return <ErrorState message={(q.error as Error).message} />;
  if (!q.data?.length) return <View style={{ padding: 16, gap: 8 }}><EmptyState title="이벤트 없음" description="일정/예약에서 캘린더 이벤트를 생성하세요." /><Button label="이벤트 생성" onPress={() => mat.mutate()} /></View>;

  return (
    <View style={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Calendar List View</Text>
      {q.data.map((ev) => (
        <Card key={String(ev.id)}>
          <Text>{String(ev.title)}</Text>
          <Text>{String(ev.start_at)} ~ {String(ev.end_at)}</Text>
        </Card>
      ))}
      <Button label="ICS Export" onPress={() => setIcsPreview(exportIcsText(q.data as Array<{ title: string; start_at: string; end_at: string }>))} />
      {icsPreview ? <Card><Text selectable>{icsPreview.slice(0, 300)}...</Text></Card> : null}
    </View>
  );
}
