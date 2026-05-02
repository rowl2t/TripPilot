import { useState } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';

const slides = [
  { title: 'AI가 전체 일정 설계', desc: '여행지/날짜/예산/스타일만 입력하면 1분 안에 초안을 만듭니다.' },
  { title: '예약 체크리스트 자동 정리', desc: '항공·숙소·교통·액티비티 예약 순서와 링크를 자동으로 준비합니다.' },
  { title: 'SNS 장소 저장 후 반영', desc: '저장한 링크의 장소를 일정 후보에 반영해 취향을 더 잘 맞춥니다.' }
] as const;

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 22 }}>TripPilot 시작하기</Text>
      <Text>{index + 1} / {slides.length}</Text>
      <Card>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>{slides[index].title}</Text>
        <Text>{slides[index].desc}</Text>
      </Card>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {index > 0 ? <Button label="이전" variant="secondary" onPress={() => setIndex((v) => v - 1)} /> : null}
        {!isLast ? <Button label="다음" onPress={() => setIndex((v) => v + 1)} /> : <Button label="첫 여행 만들기" onPress={() => router.push('/trips/new')} />}
      </View>
    </View>
  );
}
