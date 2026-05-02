import { Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { mockTrips } from '../../src/mocks/data';

export default function TripsScreen() {
  return <View style={{ padding: 16, gap: 12 }}>{mockTrips.map((t) => <Card key={t.id}><Text style={{ fontWeight: '700' }}>{t.title}</Text><Text>{t.period}</Text></Card>)}</View>;
}
