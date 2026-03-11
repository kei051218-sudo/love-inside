'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlayerInfo } from '@/types/game';

interface PrologueProps {
  player: PlayerInfo;
  onComplete: () => void;
}

const PROLOGUE_A = [
  '우린 제주도에 사는 커플이야.',
  '1주년을 맞이해서 딱새우 1등 맛집에 갔어.',
  '',
  '처음엔 너무 좋았어.',
  '사랑하는 연인과 우릴 축하해주기 위해 모인 친구들,',
  '맛있는 음식까지 완벽했지.',
  '',
  '내 연인이 내 친구에게 새우를 까주기 전까진.',
  '',
  '그날따라 유난히 더 꾸미고 온 듯한 내 친구.',
  '처음부터 마음에 들지 않았어.',
  '그런데 내 연인은 더해.',
  '어떻게 걔한테 새우를 까줄 수 있지?',
  '',
  '그게 끝이 아냐.',
  '내가 은근히 신호를 보내고 불편하다고 말을 했는데도!',
  '그걸 못 알아듣고 나중에 2차에선 한라봉까지 까주고 있더라고.',
  '',
  '화가 머리 끝까지 난 나는',
  '그냥 자리를 박차고 나와 버렸어.',
  '',
  '그리고 울리는 전화.',
];

const PROLOGUE_B = [
  '우린 제주도에 사는 커플이야.',
  '1주년을 맞이해서 딱새우 1등 맛집에 갔어.',
  '',
  '처음엔 너무 좋았어.',
  '사랑하는 연인과 우릴 축하해주기 위해 모인 친구들,',
  '맛있는 음식까지 완벽했지.',
  '',
  '내 연인이 갑자기 화를 내며 식당을 나가기 전까진.',
  '',
  '중간 중간 불편한 내색이 보이긴 했어.',
  '그런데 무엇 때문인지 알 수 없어서',
  '난 내 연인에게는 물론 그 친구들까지도',
  '더 잘 챙기면서 자리를 이어가보려 했어.',
  '',
  '하지만,',
  '나의 연인은 그런 나를 두고 그대로 떠나버렸어.',
  '',
  '이대로 오늘 밤을 마무리하기는 너무 내키지 않아서',
  '바로 전화를 했어.',
  '',
  '우리, 괜찮겠지?',
];

export default function Prologue({ player, onComplete }: PrologueProps) {
  const [shownLines, setShownLines] = useState(0);
  const [showCall, setShowCall] = useState(false);
  const [callStep, setCallStep] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const lines = player.side === 'A' ? PROLOGUE_A : PROLOGUE_B;

  // 프롤로그 줄 순차 표시
  useEffect(() => {
    if (shownLines < lines.length) {
      const delay = lines[shownLines] === '' ? 150 : 220;
      const t = setTimeout(() => setShownLines(s => s + 1), delay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowCall(true), 600);
      return () => clearTimeout(t);
    }
  }, [shownLines, lines]);

  // 전화 대화 순차 표시
  useEffect(() => {
    if (!showCall) return;
    const callLines = player.side === 'A' ? 3 : 1;
    if (callStep < callLines) {
      const t = setTimeout(() => setCallStep(s => s + 1), 1000);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowButton(true), 600);
      return () => clearTimeout(t);
    }
  }, [showCall, callStep, player.side]);

  // A편: 연인이 먼저 전화, 주인공은 A
  const callLinesA = [
    { who: 'partner', text: '지금 어디야?' },
    { who: 'me',      text: '집.' },
    { who: 'partner', text: '아니, 어떻게 그렇게 그냥 가버릴 수가 있어.' },
  ];

  // B편: B(나)가 먼저 전화
  const callLinesB = [
    { who: 'me', text: `${player.partnerName}아, 지금 얘기할 수 있어?` },
  ];

  const activeCalls = player.side === 'A' ? callLinesA : callLinesB;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* 배경 */}
      <Image
        src="/bg-title.png"
        alt="background"
        fill
        priority
        style={{ objectFit: 'cover', objectPosition: 'center top', zIndex: 0 }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(253,240,235,0.72)', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 28px 32px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>

        {/* 시간 */}
        <p style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: '12px', color: '#B08090', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '32px' }}>
          🌙 밤 12:00 · 제주
        </p>

        {/* 프롤로그 줄들 */}
        <div style={{ flex: 1 }}>
          {lines.slice(0, shownLines).map((line, i) => (
            <p key={i} style={{
              fontFamily: 'Noto Serif KR, serif',
              fontSize: '15px',
              lineHeight: 2,
              color: line === '' ? 'transparent' : '#6B4855',
              minHeight: line === '' ? '16px' : 'auto',
              margin: 0,
            }}>
              {line || '\u00A0'}
            </p>
          ))}

          {/* A편: 하아, 뭐라고 해야 */}
          {player.side === 'A' && showCall && (
            <div style={{ marginTop: '8px' }}>
              <p style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '15px', lineHeight: 2, color: '#6B4855', margin: 0 }}>하아,</p>
              <p style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '15px', lineHeight: 2, color: '#6B4855', margin: 0 }}>뭐라고 해야 내 마음을 알아줄까?</p>
            </div>
          )}
        </div>

        {/* 전화 UI */}
        {showCall && (
          <div style={{
            marginTop: '24px',
            background: 'rgba(255,255,255,0.82)',
            border: '1px solid rgba(201,96,122,0.2)',
            borderRadius: '20px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
          }}>
            {/* 수신/발신 표시 */}
            <div style={{
              textAlign: 'center', marginBottom: '16px',
              padding: '10px', borderRadius: '12px',
              background: 'rgba(201,96,122,0.07)',
            }}>
              <p style={{ fontSize: '11px', color: '#B08090', margin: 0 }}>
                {player.side === 'A' ? '📱 수신 전화' : '📱 발신 전화'}
              </p>
              <p style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '17px', color: '#C9607A', margin: '4px 0 0' }}>
                {player.partnerName}
              </p>
            </div>

            {/* 대화 */}
            {activeCalls.slice(0, callStep).map((line, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: line.who === 'me' ? 'flex-end' : 'flex-start',
                marginBottom: '8px',
              }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: line.who === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: line.who === 'me' ? 'rgba(201,96,122,0.1)' : 'rgba(180,160,170,0.1)',
                  border: line.who === 'me' ? '1px solid rgba(201,96,122,0.2)' : '1px solid rgba(180,160,170,0.2)',
                  maxWidth: '240px',
                  fontSize: '14px',
                  color: '#2C1810',
                  fontFamily: 'Noto Sans KR, sans-serif',
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}>
                  {line.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 시작 버튼 */}
        {showButton && (
          <button
            onClick={onComplete}
            style={{
              marginTop: '20px', width: '100%', padding: '18px',
              borderRadius: '16px', fontFamily: 'Noto Serif KR, serif',
              fontSize: '15px', letterSpacing: '0.05em',
              background: 'rgba(201,96,122,0.15)',
              border: '1px solid rgba(201,96,122,0.35)',
              color: '#C9607A', cursor: 'pointer',
              backdropFilter: 'blur(10px)',
            }}
          >
            감정들과 함께 시작하기 →
          </button>
        )}
      </div>
    </div>
  );
}
