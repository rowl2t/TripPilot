import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Badge } from '../../../src/components/Badge';
import { Button } from '../../../src/components/Button';
import { Card } from '../../../src/components/Card';
import { EmptyState } from '../../../src/components/states/EmptyState';
import { ErrorState } from '../../../src/components/states/ErrorState';
import { LoadingState } from '../../../src/components/states/LoadingState';
import { useRegenerate, useSelectOption, useTripDetail, useUpdateItem } from '../../../src/hooks/use-trip-detail';
import { useInviteMember, useTripMembers, useVoteOnOption } from '../../../src/hooks/use-collaboration';
import { Input } from '../../../src/components/Input';
import { useGenerateOfflinePack, useOfflinePack, useOfflinePackExport } from '../../../src/hooks/use-offline-pack';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useTripDetail(id ?? '');
  const edit = useUpdateItem(id ?? '');
  const select = useSelectOption(id ?? '');
  const regen = useRegenerate(id ?? '');
  const members = useTripMembers(id ?? '');
  const invite = useInviteMember(id ?? '');
  const vote = useVoteOnOption(id ?? '');
  const offline = useOfflinePack(id ?? '');
  const genOffline = useGenerateOfflinePack(id ?? '');
  const expOffline = useOfflinePackExport();

  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState message={(query.error as Error).message} />;
  if (!query.data) return <EmptyState title="여행 없음" description="여행 정보를 찾을 수 없습니다." />;

  const { trip, items, placeOptions, bookingTasks } = query.data;

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Card>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>{String(trip.title ?? 'Trip Overview')}</Text>
        <Text>{String(trip.start_date ?? '')} - {String(trip.end_date ?? '')}</Text>
        <Badge label={`Status: ${String(trip.status ?? 'planning')}`} />
        <Text>예약 task: {bookingTasks.length}</Text>
        <Button label="동행자 초대" />
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Day Timeline</Text>
        {items.length === 0 ? <EmptyState title="일정 없음" description="AI 생성 후 일정이 표시됩니다." /> : items.map((item) => (
          <View key={String(item.id)} style={{ marginTop: 8 }}>
            <Text>{String(item.title)} · {String(item.item_type)}</Text>
            <Button label="+30분" onPress={() => edit.mutate({ itemId: String(item.id), patch: { note: 'User adjusted time' } })} />
          </View>
        ))}
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>동행자</Text>
        <Input placeholder="invite@email.com" onChangeText={(v) => (globalThis.__inviteEmail = v)} />
        <Button label="동행자 초대" onPress={() => invite.mutate((globalThis.__inviteEmail as string) ?? '')} />
        {members.data?.map((m) => <Text key={String(m.user_id ?? m.invite_email)}>{String(m.invite_email ?? m.user_id)} · {String(m.role)} · {String(m.invite_status)}</Text>)}
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Place Options</Text>
        {placeOptions.map((opt) => (
          <View key={String(opt.id)} style={{ marginTop: 8 }}>
            <Text>{String(opt.option_group)} / fit {String(opt.fit_score)}</Text>
            <Button label="이 후보 선택" onPress={() => select.mutate({ optionId: String(opt.id), itemId: String(items[0]?.id ?? '') })} />
            <View style={{ flexDirection: 'row', gap: 6 }}><Button label="Must" onPress={() => vote.mutate({ place_option_id: String(opt.id), vote: 'must' })} /><Button label="Like" onPress={() => vote.mutate({ place_option_id: String(opt.id), vote: 'like' })} /><Button label="Dislike" onPress={() => vote.mutate({ place_option_id: String(opt.id), vote: 'dislike' })} /></View>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Offline Pack</Text>
        <Button label="오프라인 여행팩 만들기" onPress={() => genOffline.mutate()} />
        <Button label="HTML Export" onPress={() => offline.data && expOffline.mutate(offline.data as any)} />
        <Text>마지막 생성: {String((offline.data as any)?.generated_at ?? '-')}</Text>
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Regenerate</Text>
        <Button label="전체 재생성" onPress={() => regen.mutate({ scope: 'full', data: { reason: 'user_request' } })} />
        <Button label="하루만 재생성" onPress={() => regen.mutate({ scope: 'day', data: { day: 2 } })} />
        <Button label="쇼핑 줄이고 맛집 늘리기" onPress={() => regen.mutate({ scope: 'constraint', data: { prompt: 'less shopping, more food' } })} />
      </Card>
    </View>
  );
}
