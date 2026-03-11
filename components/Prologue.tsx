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
  '하아,',
  '뭐라고 해야 내 마음을 알아줄까?',
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

  useEffect(() => {
    if (shownLines < lines.length) {
      const delay = lines[shownLines] === '' ? 120 : 200;
      const t = setTimeout(() => setShownLines(s => s + 1), delay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowCall(true), 500);
      return () => clearTimeout(t);
    }
  }, [shownLines]);

  useEffect(() => {
    if (!showCall) return;
    // A편: B가 전화, B편: B가 전화
    const callLines = player.side === 'A' ? 3 : 2;
    if (callStep < callLines) {
      const t = setTimeout(() => setCallStep(s => s + 1), 900);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowButton(true), 500);
      return () => clearTimeout(t);
    }
  }, [showCall, callStep]);

  // A편 전화: B가 먼저 전화
  const callLinesA = [
    { speaker: 'B', text: '지금 어디야?' },
    { speaker: 'A', text: '집.' },
    { speaker: 'B', text: '아니, 어떻게 그렇게 그냥 가버릴 수가 있어.' },
  ];

  // B편 전화: B가 먼저 전화
  const callLinesB = [
    { speaker: 'B', text: `${player.name}아, 지금 어디야?` },
    { speaker: 'B', text: '우리 얘기 좀 할 수 있어?' },
  ];

  const activeCalls = player.side === 'A' ? callLinesA : callLinesB;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 배경 */}
      <Image
        src="/bg-title.png"
        alt="background"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center top', zIndex: 0 }}
        priority
      />
      <div className="absolute inset-0" style={{ background: 'rgba(253,240,235,0.7)', zIndex: 1 }} />

      <div className="relative px-7 py-10 max-w-sm mx-auto w-full flex flex-col min-h-screen" style={{ zIndex: 2 }}>
        {/* 시간 */}
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest" style={{ color: '#B08090' }}>🌙 밤 12:00 · 제주</p>
        </div>

        {/* 프롤로그 — 한 줄씩 */}
        <div className="flex-1 mb-6">
          {lines.slice(0, shownLines).map((line, i) => (
            <p
              key={i}
              className="font-serif text-sm leading-loose"
              style={{
                color: line === '' ? 'transparent' : '#6B4C55',
                minHeight: line === '' ? '12px' : 'auto',
              }}
            >
              {line || '\u00A0'}
            </p>
          ))}
        </div>

        {/* 전화 */}
        {showCall && (
          <div
            className="rounded-2xl p-4 mb-6 opacity-0 animate-fadeIn"
            style={{
              animationFillMode: 'forwards',
              background: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(201,96,122,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* 수신 전화 표시 */}
            <div className="text-center mb-3 py-2 rounded-xl"
              style={{ background: 'rgba(201,96,122,0.08)' }}>
              <p className="text-xs" style={{ color: '#B08090' }}>📱 수신 전화</p>
              <p className="font-serif text-lg mt-0.5" style={{ color: '#C9607A' }}>
                {player.partnerName}
              </p>
            </div>

            {/* 대화 */}
            {activeCalls.slice(0, callStep).map((line, i) => (
              <div key={i} className={`flex mb-2 ${line.speaker === 'A' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="px-4 py-2 rounded-2xl text-sm max-w-xs"
                  style={{
                    background: line.speaker === 'A' ? 'rgba(201,96,122,0.12)' : 'rgba(180,120,140,0.08)',
                    border: line.speaker === 'A' ? '1px solid rgba(201,96,122,0.25)' : '1px solid rgba(180,120,140,0.15)',
                    borderRadius: line.speaker === 'A' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    color: '#2C1810',
                    fontWeight: 300,
                  }}
                >
                  {line.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 시작 버튼 */}
        {showButton && (
          <div className="opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <button
              onClick={onComplete}
              className="w-full py-4 rounded-2xl font-serif text-sm tracking-wider transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(201,96,122,0.2), rgba(242,196,206,0.25))',
                border: '1px solid rgba(201,96,122,0.3)',
                color: '#C9607A',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(201,96,122,0.12)',
              }}
            >
              감정들과 함께 시작하기 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
