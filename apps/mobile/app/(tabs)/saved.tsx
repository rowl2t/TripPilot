import { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Input } from '../../src/components/Input';
import { EmptyState } from '../../src/components/states/EmptyState';
import { ErrorState } from '../../src/components/states/ErrorState';
import { LoadingState } from '../../src/components/states/LoadingState';
import { toSafeErrorMessage, uxCopy } from '@trippilot/config';
import { useCreateSavedLink, useDecideSavedLinkPlace, useSavedLinkPlaces, useSavedLinks } from '../../src/hooks/use-saved-links';

const PAGE = 10;
export default function SavedScreen() {
  const [url, setUrl] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [page, setPage] = useState(1);
  const links = useSavedLinks();
  const create = useCreateSavedLink();
  const selectedLink = useMemo(() => (links.data ?? []).find((l) => String(l.id) == selectedId), [links.data, selectedId]);
  const shouldPollPlaces = Boolean(selectedId) && ['pending', 'processing'].includes(String(selectedLink?.analysis_status ?? ''));
  const places = useSavedLinkPlaces(selectedId, shouldPollPlaces);
  const decide = useDecideSavedLinkPlace(selectedId);

  const pageItems = useMemo(() => (links.data ?? []).slice(0, page * PAGE), [links.data, page]);
  if (links.isLoading) return <LoadingState />;
  if (links.isError) return <ErrorState message={toSafeErrorMessage(links.error)} onRetry={() => links.refetch()} />;

  return (
    <View style={{ padding: 16, gap: 10 }}>
      <Input placeholder="링크 붙여넣기" value={url} onChangeText={setUrl} />
      <Button label="링크 저장" onPress={() => create.mutate(url)} />

      {!links.data?.length ? <EmptyState title={uxCopy.empty.savedLinks.title} description={uxCopy.empty.savedLinks.description} ctaLabel="링크 저장 시작" onCtaPress={() => {}} /> : (
        <FlatList
          data={pageItems}
          keyExtractor={(l) => String(l.id)}
          renderItem={({ item: l }) => <Card><Text>{String(l.url)}</Text><Text>분석 상태: {String(l.analysis_status)}</Text><Button label="후보 보기" onPress={() => setSelectedId(String(l.id))} /></Card>}
          ListFooterComponent={(links.data.length > pageItems.length) ? <Button label="더 보기" variant="secondary" onPress={() => setPage((p) => p + 1)} /> : null}
        />
      )}

      {places.data?.map((p) => <Card key={String(p.id)}><Text>{String(p.candidate_name)} (신뢰도 {String(p.confidence)})</Text><View style={{ flexDirection: 'row', gap: 8 }}><Button label="확정" onPress={() => decide.mutate({ saved_link_place_id: String(p.id), decision: 'confirm' })} /><Button label="거절" onPress={() => decide.mutate({ saved_link_place_id: String(p.id), decision: 'reject' })} /></View></Card>)}
    </View>
  );
}
