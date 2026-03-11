'use client';

import { useState } from 'react';
import { PlayerInfo, Gender, EmotionCharacter } from '@/types/game';

interface OnboardingProps {
  onComplete: (player: PlayerInfo) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [q1, setQ1] = useState<'peel' | 'want-peeled' | null>(null);
  const [q2, setQ2] = useState<'happy' | 'jealous' | null>(null);

  // 각 선택지에서 값을 직접 받아 즉시 step 이동 (setTimeout 제거)
  const handleGender = (value: Gender) => {
    setGender(value);
    setStep(2);
  };

  const handleQ1 = (value: 'peel' | 'want-peeled') => {
    setQ1(value);
    setStep(3);
  };

  const handleQ2 = (value: 'happy' | 'jealous') => {
    setQ2(value);
    setStep(4);
  };

  const handleQ3 = (value: EmotionCharacter) => {
    const side = (q1 === 'want-peeled' && q2 === 'jealous') ? 'A' :
                 (q1 === 'peel' && q2 === 'happy') ? 'B' :
                 Math.random() > 0.5 ? 'A' : 'B';
    onComplete({
      name: name.trim(),
      partnerName: partnerName.trim(),
      gender: gender!,
      side,
      emotion: value,
      shrimpAnswer: q1!,
      partnerAnswer: q2!,
      reactionAnswer: value,
    });
  };

  const q3Options: { id: EmotionCharacter; emoji: string; text: string }[] = [
    { id: 'buni',   emoji: '🔥', text: '"내가 화난 거 몰랐어?" 바로 맞받아친다' },
    { id: 'seorup', emoji: '🌧', text: '서러워서 눈물이 난다' },
    { id: 'dukeun', emoji: '💛', text: '지금 당장 달려와줬으면 하고 기대한다' },
    { id: 'honmi',  emoji: '🌀', text: '내 감정이 뭔지 모르겠다' },
    { id: 'dodo',   emoji: '🧊', text: '그냥 전화를 끊어버린다' },
  ];

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    fontFamily: 'Noto Sans KR, sans-serif',
    borderRadius: '12px',
    padding: '12px 16px',
    width: '100%',
    fontSize: '14px',
    outline: 'none',
    boxShadow: '0 1px 8px rgba(180,120,140,0.08)',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative z-10">
      {/* 로고 */}
      <div className="mb-10 text-center opacity-0 animate-fadeIn" style={{ animationFillMode: 'forwards' }}>
        <div className="text-5xl mb-3 animate-float">💕</div>
        <h1 className="font-serif text-3xl tracking-widest" style={{ color: 'var(--accent-warm)' }}>
          LOVE INSIDE
        </h1>
        <p className="text-xs mt-2 tracking-wider" style={{ color: 'var(--text-muted)' }}>
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
            <label className="block text-xs mb-1 tracking-wide" style={{ color: 'var(--text-muted)' }}>
              이름이 뭐예요?
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="이름 또는 닉네임"
              maxLength={10}
              style={inputStyle}
              className="mb-4"
            />
            <label className="block text-xs mb-1 tracking-wide" style={{ color: 'var(--text-muted)' }}>
              연인의 이름은요?
            </label>
            <input
              type="text"
              value={partnerName}
              onChange={e => setPartnerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && name.trim() && partnerName.trim() && setStep(1)}
              placeholder="연인의 이름 또는 닉네임"
              maxLength={10}
              style={inputStyle}
            />
            <button
              onClick={() => name.trim() && partnerName.trim() && setStep(1)}
              disabled={!name.trim() || !partnerName.trim()}
              className="mt-5 w-full py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: (name.trim() && partnerName.trim()) ? 'rgba(201,96,122,0.15)' : 'rgba(180,120,140,0.07)',
                border: (name.trim() && partnerName.trim()) ? '1px solid rgba(201,96,122,0.35)' : '1px solid var(--border-subtle)',
                color: (name.trim() && partnerName.trim()) ? 'var(--accent-warm)' : 'var(--text-muted)',
                cursor: (name.trim() && partnerName.trim()) ? 'pointer' : 'not-allowed',
              }}
            >
              다음
            </button>
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
                  onClick={() => handleGender(opt.id)}
                  className="choice-btn text-center"
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
            <p className="text-center mb-2 font-serif text-lg" style={{ color: 'var(--text-primary)' }}>
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
                  onClick={() => handleQ1(opt.id)}
                  className="choice-btn"
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
            <p className="text-center mb-2 font-serif text-base" style={{ color: 'var(--text-primary)' }}>
              연인이 친구들 새우를 척척 까주고 있어.
            </p>
            <p className="text-center mb-6 text-xs" style={{ color: 'var(--text-muted)' }}>
              나는?
            </p>
            <div className="flex flex-col gap-3">
              {[
                { id: 'happy' as const, label: '흐뭇하다', sub: '저런 사람이라서 좋아했지' },
                { id: 'jealous' as const, label: '기분이 묘하다', sub: '나한테만 그래줬으면 좋겠는데' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleQ2(opt.id)}
                  className="choice-btn"
                >
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Q3 연인과 다툴 때 */}
        {step === 4 && (
          <div className="opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-center mb-2 font-serif text-base" style={{ color: 'var(--text-primary)' }}>
              연인과 다툴 때 나의 모습은?
            </p>
            <p className="text-center mb-5 text-xs" style={{ color: 'var(--text-muted)' }}>
              가장 가까운 것을 골라줘요.
            </p>
            <div className="flex flex-col gap-2">
              {q3Options.map((opt, i) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ3(opt.id)}
                  className="choice-btn opacity-0 animate-fadeIn"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
                >
                  <span className="mr-2 text-base">{opt.emoji}</span>
                  <span className="text-sm">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
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
                background: i === step ? 'var(--accent-warm)' : 'var(--border-subtle)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
