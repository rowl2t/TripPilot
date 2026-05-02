import { Text, View } from 'react-native';

import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';
import { EmptyState } from './states/EmptyState';

export const ComponentsPreview = () => (
  <View style={{ padding: 16, gap: 12 }}>
    <Badge label="Pro" />
    <Card><Text>Premium Card</Text></Card>
    <Input placeholder="Search destination" accessibilityLabel="preview-input" />
    <Button label="Continue" />
    <EmptyState title="No trips" description="Create your first trip." />
  </View>
);
