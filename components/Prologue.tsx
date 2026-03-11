'use client';

import { useState, useEffect } from 'react';
import { PlayerInfo } from '@/types/game';
import { PROLOGUE_A_FEMALE, OPENING_CALL } from '@/lib/storyData';

interface PrologueProps {
  player: PlayerInfo;
  onComplete: () => void;
}

export default function Prologue({ player, onComplete }: PrologueProps) {
  const [showPrologue, setShowPrologue] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [callStep, setCallStep] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowPrologue(true), 500);
    const t2 = setTimeout(() => setShowCall(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!showCall) return;
    if (callStep < OPENING_CALL.length) {
      const t = setTimeout(() => setCallStep(s => s + 1), 900);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowButton(true), 800);
      return () => clearTimeout(t);
    }
  }, [showCall, callStep]);

  const prologueLines = PROLOGUE_A_FEMALE.split('\n');

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 relative z-10 max-w-sm mx-auto">
      {/* 시간 표시 */}
      <div className="text-center mb-8 opacity-0 animate-fadeIn" style={{ animationFillMode: 'forwards' }}>
        <p className="text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>
          🌙 밤 12:00
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          제주
        </p>
      </div>

      {/* 프롤로그 텍스트 */}
      {showPrologue && (
        <div className="mb-8">
          {prologueLines.map((line, i) => (
            <p
              key={i}
              className="opacity-0 animate-fadeIn font-serif text-sm leading-loose mb-1"
              style={{
                animationDelay: `${i * 120}ms`,
                animationFillMode: 'forwards',
                color: line === '' ? 'transparent' : 'var(--text-secondary)',
                minHeight: line === '' ? '8px' : 'auto',
              }}
            >
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      )}

      {/* 전화 울림 */}
      {showCall && (
        <div
          className="opacity-0 animate-fadeIn card-glass p-4 mb-6"
          style={{ animationFillMode: 'forwards' }}
        >
          <p className="text-xs mb-3 text-center" style={{ color: 'var(--text-muted)' }}>
            📱 전화가 울린다
          </p>
          {OPENING_CALL.slice(0, callStep).map((line, i) => (
            <div
              key={i}
              className={`flex mb-2 ${line.speaker === 'A' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="px-4 py-2 rounded-2xl text-sm max-w-xs"
                style={{
                  background: line.speaker === 'A'
                    ? 'rgba(255,107,107,0.15)'
                    : 'rgba(255,255,255,0.06)',
                  border: line.speaker === 'A'
                    ? '1px solid rgba(255,107,107,0.3)'
                    : '1px solid rgba(255,255,255,0.1)',
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
        <div
          className="opacity-0 animate-slideUp mt-auto"
          style={{ animationFillMode: 'forwards' }}
        >
          <p className="text-center text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            뭐라고 해야 내 마음을 알아줄까?
          </p>
          <button
            onClick={onComplete}
            className="w-full py-4 rounded-xl font-serif text-sm tracking-wider transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,107,0.2), rgba(255,179,179,0.1))',
              border: '1px solid rgba(255,107,107,0.3)',
              color: 'var(--accent-warm)',
            }}
          >
            감정들과 함께 시작하기
          </button>
        </div>
      )}
    </div>
  );
}
