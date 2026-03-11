'use client';

import { useState } from 'react';
import { PlayerInfo, Gender, EmotionCharacter } from '@/types/game';

interface OnboardingProps {
  onComplete: (player: PlayerInfo) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [q1, setQ1] = useState<'peel' | 'want-peeled' | null>(null);
  const [q2, setQ2] = useState<'happy' | 'jealous' | null>(null);
  const [q3, setQ3] = useState<EmotionCharacter | null>(null);

  const handleNext = () => {
    if (step === 0 && name.trim()) setStep(1);
    else if (step === 1 && gender) setStep(2);
    else if (step === 2 && q1) setStep(3);
    else if (step === 3 && q2) setStep(4);
    else if (step === 4 && q3) {
      // 편 배정: q1+q2 기반
      const side = (q1 === 'want-peeled' && q2 === 'jealous') ? 'A' : 
                   (q1 === 'peel' && q2 === 'happy') ? 'B' : 
                   Math.random() > 0.5 ? 'A' : 'B';
      onComplete({
        name: name.trim(),
        gender: gender!,
        side,
        emotion: q3!,
        shrimpAnswer: q1!,
        partnerAnswer: q2!,
        reactionAnswer: q3,
      });
    }
  };

  const q3Options: { id: EmotionCharacter; emoji: string; name: string; text: string }[] = [
    { id: 'buni',   emoji: '🔥', name: '분이',  text: '"내가 화난 거 몰랐어?" 맞받아친다' },
    { id: 'seorup', emoji: '🌧', name: '서럽',  text: '서러워서 눈물이 난다' },
    { id: 'dukeun', emoji: '💛', name: '두근',  text: '지금 내게 달려와줬으면 하고 기대한다' },
    { id: 'honmi',  emoji: '🌀', name: '혼미',  text: '나도 내 감정이 뭔지 모르겠다' },
    { id: 'dodo',   emoji: '🧊', name: '도도',  text: '그냥 끊어버린다' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative z-10">
      {/* 로고 */}
      <div className="mb-10 text-center opacity-0 animate-fadeIn">
        <div className="text-4xl mb-2">💕</div>
        <h1 className="font-serif text-2xl tracking-widest" style={{ color: 'var(--text-primary)' }}>
          LOVE INSIDE
        </h1>
        <p className="text-xs mt-1 tracking-wider" style={{ color: 'var(--text-muted)' }}>
          오늘 밤 이야기를 시작하기 전에
        </p>
      </div>

      <div className="w-full max-w-sm">

        {/* STEP 0: 이름 */}
        {step === 0 && (
          <div className="opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-center mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
              당신에 대해 조금 알고 싶어요.
            </p>
            <label className="block text-xs mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
              이름이 뭐예요?
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNext()}
              placeholder="이름 또는 닉네임"
              maxLength={10}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--text-primary)',
                fontFamily: 'Noto Sans KR, sans-serif',
              }}
            />
          </div>
        )}

        {/* STEP 1: 성별 */}
        {step === 1 && (
          <div className="opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-center mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
              성별은요?
            </p>
            <div className="flex flex-col gap-3">
              {[
                { id: 'female' as Gender, label: '여자' },
                { id: 'male' as Gender, label: '남자' },
                { id: 'other' as Gender, label: '말하고 싶지 않아요' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setGender(opt.id); setTimeout(handleNext, 200); }}
                  className="choice-btn"
                  style={gender === opt.id ? {
                    background: 'rgba(255,107,107,0.12)',
                    borderColor: 'rgba(255,107,107,0.4)',
                  } : {}}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Q1 새우 */}
        {step === 2 && (
          <div className="opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-center mb-2 text-base font-serif" style={{ color: 'var(--text-primary)' }}>
              🦐 딱새우 앞에서 당신은?
            </p>
            <p className="text-center mb-6 text-xs" style={{ color: 'var(--text-muted)' }}>
              제주 1등 딱새우 맛집에 왔어요.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { id: 'peel' as const, label: '직접 까서 먹는다', sub: '손 버리는 게 대수야' },
                { id: 'want-peeled' as const, label: '누가 까줬으면 한다', sub: '그게 정이잖아' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setQ1(opt.id); setTimeout(handleNext, 200); }}
                  className="choice-btn text-left"
                >
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Q2 연인이 까줄 때 */}
        {step === 3 && (
          <div className="opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-center mb-2 text-base font-serif" style={{ color: 'var(--text-primary)' }}>
              연인이 친구들 새우를 척척 까주고 있어.
            </p>
            <p className="text-center mb-6 text-xs" style={{ color: 'var(--text-muted)' }}>
              당신은?
            </p>
            <div className="flex flex-col gap-3">
              {[
                { id: 'happy' as const, label: '흐뭇하다', sub: '저런 사람이라서 좋아했지' },
                { id: 'jealous' as const, label: '기분이 묘하다', sub: '나한테만 그래줬으면 좋겠는데' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setQ2(opt.id); setTimeout(handleNext, 200); }}
                  className="choice-btn text-left"
                >
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Q3 감정 */}
        {step === 4 && (
          <div className="opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-center mb-2 text-base font-serif" style={{ color: 'var(--text-primary)' }}>
              "어떻게 그렇게 그냥 가버릴 수가 있어."
            </p>
            <p className="text-center mb-6 text-xs" style={{ color: 'var(--text-muted)' }}>
              이 말을 듣고 나는?
            </p>
            <div className="flex flex-col gap-2">
              {q3Options.map((opt, i) => (
                <button
                  key={opt.id}
                  onClick={() => { setQ3(opt.id); setTimeout(handleNext, 300); }}
                  className="choice-btn text-left opacity-0 animate-fadeIn"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
                >
                  <span className="mr-2">{opt.emoji}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{opt.name}</span>
                  <div className="mt-1 text-sm">{opt.text}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 다음 버튼 (step 0만) */}
        {step === 0 && (
          <button
            onClick={handleNext}
            disabled={!name.trim()}
            className="mt-6 w-full py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: name.trim() ? 'rgba(255,107,107,0.2)' : 'rgba(255,255,255,0.04)',
              border: name.trim() ? '1px solid rgba(255,107,107,0.4)' : '1px solid rgba(255,255,255,0.08)',
              color: name.trim() ? 'var(--accent-warm)' : 'var(--text-muted)',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            다음
          </button>
        )}

        {/* 진행 표시 */}
        <div className="flex justify-center gap-2 mt-8">
          {[0,1,2,3,4].map(i => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i === step ? '20px' : '6px',
                height: '6px',
                background: i === step ? 'var(--accent-warm)' : 'var(--text-muted)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
