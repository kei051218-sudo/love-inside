'use client';

import { useEffect, useState } from 'react';
import { PlayerInfo, EMOTION_CONFIG } from '@/types/game';

interface EmotionRevealProps {
  player: PlayerInfo;
  onComplete: () => void;
}

export default function EmotionReveal({ player, onComplete }: EmotionRevealProps) {
  const [step, setStep] = useState(0);
  const config = EMOTION_CONFIG[player.emotion];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => setStep(3), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">
      {step >= 1 && (
        <div className="text-center opacity-0 animate-fadeIn" style={{ animationFillMode: 'forwards' }}>
          <p className="text-xs tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
            {player.name}님의 감정은
          </p>
        </div>
      )}

      {step >= 2 && (
        <div
          className="opacity-0 animate-fadeIn text-center p-8 rounded-3xl"
          style={{
            animationFillMode: 'forwards',
            background: `linear-gradient(135deg, rgba(${hexToRgb(config.color)}, 0.15), rgba(${hexToRgb(config.color)}, 0.05))`,
            border: `1px solid rgba(${hexToRgb(config.color)}, 0.3)`,
          }}
        >
          <div className="text-6xl mb-4 animate-heartbeat">{config.emoji}</div>
          <h2
            className="font-serif text-3xl mb-2"
            style={{ color: config.color }}
          >
            {config.name}
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {getEmotionDesc(player.emotion)}
          </p>
        </div>
      )}

      {step >= 3 && (
        <button
          onClick={onComplete}
          className="opacity-0 animate-slideUp mt-10 px-8 py-3 rounded-xl text-sm transition-all"
          style={{
            animationFillMode: 'forwards',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--text-primary)',
          }}
        >
          감정들과 함께하기 →
        </button>
      )}
    </div>
  );
}

function getEmotionDesc(emotion: string): string {
  const descs: Record<string, string> = {
    buni:   '억울하고 화나. 지지 않아.',
    seorup: '슬프고 상처받았어. 눈물 한 방울 차이.',
    dukeun: '그래도 좋아해. 설레는 마음이 남아있어.',
    honmi:  '모르겠어. 내 감정이 뭔지 헷갈려.',
    dodo:   '차갑게 기다려. 네가 먼저 와야지.',
  };
  return descs[emotion] || '';
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
