import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

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
import { getMockMapData, hasMapProvider, isLongRouteLeg, type MapPin } from '../../../src/maps/provider';

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
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const mapData = useMemo(() => getMockMapData(), []);
  const filteredPins = mapData.pins.filter((p) => p.day === selectedDay);

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
        {items.length === 0 ? <EmptyState title="일정 없음" description="AI 생성 후 일정이 표시됩니다." /> : <FlatList data={items} keyExtractor={(item) => String(item.id)} initialNumToRender={8} windowSize={7} removeClippedSubviews renderItem={({ item }) => <View style={{ marginTop: 8 }}><Text>{String(item.title)} · {String(item.item_type)}</Text><Button label="+30분" onPress={() => edit.mutate({ itemId: String(item.id), patch: { note: 'User adjusted time' } })} /></View>} />}
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>동행자</Text>
        <Input accessibilityLabel="invite-email" placeholder="invite@email.com" onChangeText={setInviteEmail} value={inviteEmail} />
        <Button label="동행자 초대" onPress={() => invite.mutate(inviteEmail)} />
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
        <Text style={{ fontWeight: '700' }}>Trip Map {hasMapProvider() ? '(Provider 연결됨)' : '(Mock 모드)'}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          {[1, 2, 3, 4].map((d) => <Button key={String(d)} label={`Day ${d}`} variant={selectedDay === d ? 'primary' : 'secondary'} onPress={() => setSelectedDay(d)} />)}
        </View>
        {filteredPins.map((pin) => (
          <View key={pin.id} style={{ marginTop: 8 }}>
            <Text>{pin.order}. {pin.name} · {pin.type}</Text>
            <Button label="상세 보기" variant="ghost" onPress={() => setSelectedPin(pin)} />
          </View>
        ))}
        <Text style={{ marginTop: 10, fontWeight: '700' }}>Route Summary</Text>
        {mapData.legs.map((leg) => (
          <Text key={`${leg.fromId}-${leg.toId}`} style={{ color: isLongRouteLeg(leg) ? '#EF4444' : '#A9B4C7' }}>
            {leg.mode} · {leg.durationMinutes}분 {isLongRouteLeg(leg) ? '⚠ 이동시간 김' : ''}
          </Text>
        ))}
        {selectedPin ? (
          <View style={{ marginTop: 12, padding: 10, borderWidth: 1, borderColor: '#2B3958', borderRadius: 12 }}>
            <Text style={{ fontWeight: '700' }}>{selectedPin.name}</Text>
            <Text>주소: {selectedPin.address}</Text>
            <Text>카테고리: {selectedPin.category} · 평점 {selectedPin.rating}</Text>
            <Text>예상 체류: {selectedPin.stayMinutes}분</Text>
            <Text>선택 이유: {selectedPin.reason}</Text>
            <Text>대체 후보: {selectedPin.alternatives.join(', ')}</Text>
          </View>
        ) : null}
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Offline Pack</Text>
        <Button label="오프라인 여행팩 만들기" onPress={() => genOffline.mutate()} />
        <Button label="HTML Export" onPress={() => offline.data && expOffline.mutate(offline.data as Record<string, unknown>)} />
        <Text>마지막 생성: {String((offline.data as Record<string, unknown>)?.generated_at ?? '-')}</Text>
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
