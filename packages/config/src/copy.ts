export const uxCopy = {
  common: {
    retry: '다시 시도',
    goHome: '홈으로 이동',
    support: '문제가 계속되면 고객지원에 문의해 주세요.'
  },
  errors: {
    generic: '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.',
    network: '네트워크 연결을 확인한 뒤 다시 시도해 주세요.',
    planningFailed: '여행 계획을 완성하지 못했어요. 입력 정보를 조금 단순하게 바꾸면 성공 확률이 올라가요.'
  },
  empty: {
    trips: { title: '아직 만든 여행이 없어요', description: '첫 여행을 만들어 AI 일정 추천을 받아보세요.' },
    savedLinks: { title: '저장된 링크가 없어요', description: 'SNS나 블로그 링크를 저장하면 장소 후보를 자동으로 정리해드려요.' },
    calendar: { title: '연동된 일정이 없어요', description: '여행 일정 생성 후 캘린더 동기화를 켜면 한눈에 볼 수 있어요.' }
  },
  planning: {
    loadingTitle: '여행 계획을 준비하고 있어요',
    loadingDescription: '동선, 식사, 휴식, 예산 균형을 함께 고려하는 중이에요. 10~30초 정도 걸릴 수 있어요.',
    disclaimer: '예약 가능 여부, 가격, 영업시간은 실제 예약 시점에 변동될 수 있어요.'
  },
  usage: {
    softLimit: '무료 사용량이 거의 소진되었어요. 잠시 후 다시 시도하거나 플랜을 업그레이드해 보세요.'
  }
} as const;

export const toSafeErrorMessage = (error: unknown): string => {
  const raw = error instanceof Error ? error.message : '';
  if (!raw) return uxCopy.errors.generic;
  const lowered = raw.toLowerCase();
  if (lowered.includes('network') || lowered.includes('fetch')) return uxCopy.errors.network;
  if (lowered.includes('planning')) return uxCopy.errors.planningFailed;
  return uxCopy.errors.generic;
};
