'use client';

import { useState } from 'react';

export default function SupportPage() {
  const [msg, setMsg] = useState('');
  return <main style={{ padding: 24 }}><h1>Support</h1><textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="문의 내용을 입력하세요" /><br /><button onClick={() => alert('문의가 접수되었습니다(mock)')}>보내기</button></main>;
}
