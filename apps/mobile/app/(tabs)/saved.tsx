import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Input } from '../../src/components/Input';
import { EmptyState } from '../../src/components/states/EmptyState';
import { ErrorState } from '../../src/components/states/ErrorState';
import { LoadingState } from '../../src/components/states/LoadingState';
import { useCreateSavedLink, useDecideSavedLinkPlace, useSavedLinkPlaces, useSavedLinks } from '../../src/hooks/use-saved-links';

export default function SavedScreen() {
  const [url, setUrl] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const links = useSavedLinks();
  const create = useCreateSavedLink();
  const places = useSavedLinkPlaces(selectedId);
  const decide = useDecideSavedLinkPlace();

  if (links.isLoading) return <LoadingState />;
  if (links.isError) return <ErrorState message={(links.error as Error).message} />;

  return (
    <View style={{ padding: 16, gap: 10 }}>
      <Input placeholder="링크 붙여넣기" value={url} onChangeText={setUrl} />
      <Button label="링크 저장" onPress={() => create.mutate(url)} />

      {!links.data?.length ? <EmptyState title="저장된 링크 없음" description="공개 링크를 저장해 장소 후보를 분석하세요." /> : links.data.map((l) => (
        <Card key={String(l.id)}>
          <Text>{String(l.url)}</Text>
          <Text>분석 상태: {String(l.analysis_status)}</Text>
          <Button label="후보 보기" onPress={() => setSelectedId(String(l.id))} />
        </Card>
      ))}

      {places.data?.map((p) => (
        <Card key={String(p.id)}>
          <Text>{String(p.candidate_name)} (신뢰도 {String(p.confidence)})</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button label="확정" onPress={() => decide.mutate({ saved_link_place_id: String(p.id), decision: 'confirm' })} />
            <Button label="거절" onPress={() => decide.mutate({ saved_link_place_id: String(p.id), decision: 'reject' })} />
          </View>
        </Card>
      ))}
    </View>
  );
}
