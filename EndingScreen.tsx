'use client';

import { useState, useEffect } from 'react';
import { ENDINGS } from '@/lib/storyData';
import EmotionBubble from './EmotionBubble';

interface EndingScreenProps {
  type: 'happy' | 'breakup' | 'undecided';
  onRestart: () => void;
}

export default function EndingScreen({ type, onRestart }: EndingScreenProps) {
  const [step, setStep] = useState(0);
  const ending = ENDINGS[type];

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 2000);
    const t3 = setTimeout(() => setStep(3), 4000);
    const t4 = setTimeout(() => setStep(4), 5500);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, []);

  const shareText = `나의 Love Inside 엔딩은 "${ending.title}" 💕 #LoveInside #나의엔딩은`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('클립보드에 복사됐어요!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 relative z-10 max-w-sm mx-auto">
      {/* 엔딩 이모지 */}
      {step >= 1 && (
        <div className="text-center mb-6 opacity-0 animate-fadeIn" style={{ animationFillMode: 'forwards' }}>
          <div className="text-5xl mb-3">{ending.emoji}</div>
          <h2 className="font-serif text-xl" style={{ color: 'var(--text-primary)' }}>
            {ending.title}
          </h2>
        </div>
      )}

      {/* 씬 텍스트 */}
      {step >= 2 && (
        <div className="card-glass p-5 mb-6 opacity-0 animate-fadeIn" style={{ animationFillMode: 'forwards' }}>
          {ending.scene.split('\n').map((line, i) => (
            <p key={i} className="font-serif text-sm leading-loose"
              style={{ color: line === '' ? 'transparent' : 'var(--text-secondary)', minHeight: line === '' ? '8px' : 'auto' }}>
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      )}

      {/* 감정들 마지막 한마디 */}
      {step >= 3 && (
        <div className="mb-6">
          {ending.emotionLines.map((e, i) => (
            <EmotionBubble
              key={i}
              character={e.character}
              text={e.text}
              delay={i * 400}
            />
          ))}
        </div>
      )}

      {/* 엔딩 카드 */}
      {step >= 4 && (
        <div
          className="card-glass p-6 mb-8 text-center opacity-0 animate-fadeIn"
          style={{ animationFillMode: 'forwards' }}
        >
          {ending.card.split('\n').map((line, i) => (
            <p key={i} className="font-serif text-sm leading-loose"
              style={{
                color: line === '' ? 'transparent' : i === ending.card.split('\n').length - 1 ? 'var(--accent-warm)' : 'var(--text-secondary)',
                minHeight: line === '' ? '8px' : 'auto',
                fontWeight: i === ending.card.split('\n').length - 1 ? 400 : 300,
              }}>
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      )}

      {/* 공유 + 다시하기 */}
      {step >= 4 && (
        <div className="space-y-3 opacity-0 animate-slideUp delay-300" style={{ animationFillMode: 'forwards' }}>
          {/* 공연 안내 */}
          <div className="card-glass p-4 text-center">
            <p className="text-xs leading-loose" style={{ color: 'var(--text-secondary)' }}>
              🎭 관객들이 주인공의 감정이 되어<br />
              처음부터 끝까지 모든 과정을 함께 하는<br />
              참여형 연극 <span style={{ color: 'var(--accent-warm)' }}>Love Inside</span>
            </p>
            <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
              함께 하고 싶으시다면 →
            </p>
            <a
              href="#"
              className="inline-block mt-2 text-xs px-4 py-2 rounded-lg transition-all"
              style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', color: 'var(--accent-warm)' }}
            >
              공연 바로가기
            </a>
          </div>

          <button onClick={handleShare} className="choice-btn text-center">
            💬 내 엔딩 공유하기
          </button>

          <button onClick={onRestart}
            className="w-full py-3 rounded-xl text-sm transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
            다시 시작하기
          </button>
        </div>
      )}
    </div>
  );
}
