'use client';

import { useState, useEffect } from 'react';
import { PlayerInfo } from '@/types/game';

interface PrologueProps {
  player: PlayerInfo;
  onComplete: () => void;
}

const PROLOGUE_LINES = [
  '제주에서의 저녁이었어.',
  '',
  '딱새우 1등 맛집, 시끌벅적한 테이블.',
  '딱새우 까는 소리, 웃음소리, 한라봉 향기.',
  '',
  '그리고 그 사람.',
  '',
  '오늘따라 유독 눈에 띄는 옷차림으로 나타난',
  '연인의 친구.',
  '',
  '나는 봤어.',
  '내 사람이 그 사람의 새우를 까주는 걸.',
  '그리고 한라봉까지.',
  '',
  '눈이 마주쳤는데.',
  '그냥 웃더라.',
  '',
  '나는 아무 말 없이 자리를 떴어.',
];

export default function Prologue({ player, onComplete }: PrologueProps) {
  const [shownLines, setShownLines] = useState(0);
  const [showCall, setShowCall] = useState(false);
  const [callStep, setCallStep] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // 한 줄씩 순차 표시
    if (shownLines < PROLOGUE_LINES.length) {
      const t = setTimeout(() => setShownLines(s => s + 1), 220);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowCall(true), 600);
      return () => clearTimeout(t);
    }
  }, [shownLines]);

  useEffect(() => {
    if (!showCall) return;
    if (callStep < 3) {
      const t = setTimeout(() => setCallStep(s => s + 1), 900);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowButton(true), 600);
      return () => clearTimeout(t);
    }
  }, [showCall, callStep]);

  const callLines = [
    { speaker: 'incoming', text: `${player.partnerName}` },
    { speaker: 'B', text: '지금 어디야?' },
    { speaker: 'A', text: '집.' },
    { speaker: 'B', text: '아니, 어떻게 그렇게 그냥 가버릴 수가 있어.' },
  ];

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 relative z-10 max-w-sm mx-auto">
      {/* 시간 */}
      <div className="text-center mb-8 opacity-0 animate-fadeIn" style={{ animationFillMode: 'forwards' }}>
        <p className="text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>🌙 밤 12:00 · 제주</p>
      </div>

      {/* 프롤로그 텍스트 - 한줄씩 */}
      <div className="mb-8 flex-1">
        {PROLOGUE_LINES.slice(0, shownLines).map((line, i) => (
          <p
            key={i}
            className="font-serif text-sm leading-loose"
            style={{
              color: line === '' ? 'transparent' : 'var(--text-secondary)',
              minHeight: line === '' ? '10px' : 'auto',
            }}
          >
            {line || '\u00A0'}
          </p>
        ))}
      </div>

      {/* 전화 씬 */}
      {showCall && (
        <div className="card-soft p-4 mb-6">
          {/* 수신 전화 표시 */}
          {callStep >= 0 && (
            <div className="text-center mb-4 py-2 rounded-xl"
              style={{ background: 'rgba(201,96,122,0.08)', border: '1px solid rgba(201,96,122,0.15)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>📱 수신 전화</p>
              <p className="font-serif text-lg mt-1" style={{ color: 'var(--accent-warm)' }}>
                {player.partnerName}
              </p>
            </div>
          )}
          {/* 대화 */}
          {callLines.slice(1, callStep + 1).map((line, i) => (
            <div key={i} className={`flex mb-2 ${line.speaker === 'A' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="px-4 py-2 rounded-2xl text-sm max-w-xs"
                style={{
                  background: line.speaker === 'A'
                    ? 'rgba(201,96,122,0.12)'
                    : 'rgba(180,120,140,0.08)',
                  border: line.speaker === 'A'
                    ? '1px solid rgba(201,96,122,0.25)'
                    : '1px solid var(--border-subtle)',
                  borderRadius: line.speaker === 'A' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  color: 'var(--text-primary)',
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
          <p className="text-center text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            뭐라고 해야 내 마음을 알아줄까?
          </p>
          <button
            onClick={onComplete}
            className="w-full py-4 rounded-xl font-serif text-sm tracking-wider transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(201,96,122,0.15), rgba(242,196,206,0.2))',
              border: '1px solid rgba(201,96,122,0.3)',
              color: 'var(--accent-warm)',
              boxShadow: '0 2px 16px rgba(201,96,122,0.1)',
            }}
          >
            감정들과 함께 시작하기 →
          </button>
        </div>
      )}
    </div>
  );
}
