const section = { padding: '56px 20px', maxWidth: 1080, margin: '0 auto' } as const;

export default function HomePage() {
  return (
    <main id="main-content">
      <section style={{ ...section, textAlign: 'center' }}>
        <h1>TripPilot</h1><p>여행 초보도 3분 안에 전체 여행 계획 완성.</p>
        <nav aria-label="주요 이동"><a href="/pricing">가격 보기</a> · <a href="#waitlist">대기자 등록</a></nav>
      </section>
      <section style={section}><h2>문제</h2><p>여행 정보가 흩어져 있고 예약/준비가 복잡합니다.</p></section>
      <section style={section}><h2>해결</h2><ul><li>AI 일정 생성 + 장소 검증</li><li>SNS 링크 장소 저장/분석</li><li>예약 체크리스트 자동 정리</li><li>캘린더/오프라인 여행팩</li></ul></section>
      <section style={section}><h2>핵심 기능</h2><p>Saved Links · Booking Checklist · Calendar · Collaboration · Offline Pack</p></section>
      <section style={section}><h2>가격</h2><p>Free / Pro / Trip Pack</p><a href="/pricing">플랜 상세 보기</a></section>
      <section style={section}><h2>FAQ</h2><p>Q. AI 결과를 그대로 믿어도 되나요? A. 최종 확인이 필요합니다.</p></section>
      <section id="waitlist" style={section}><h2>앱 다운로드 & 대기자</h2><p>출시 알림을 받고 가장 먼저 사용해보세요.</p><button aria-label="대기자 등록">Waitlist Join</button></section>
    </main>
  );
}
