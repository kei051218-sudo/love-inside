'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlayerInfo, Gender, EmotionCharacter } from '@/types/game';

interface OnboardingProps {
  onComplete: (player: PlayerInfo) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0); // 0=시작화면, 1=이름, 2=연인유무, 3=연인이름, 4=성별, 5=Q1, 6=Q2, 7=Q3
  const [name, setName] = useState('');
  const [hasPartner, setHasPartner] = useState<boolean | null>(null);
  const [partnerName, setPartnerName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [q1, setQ1] = useState<'peel' | 'want-peeled' | null>(null);
  const [q2, setQ2] = useState<'happy' | 'jealous' | null>(null);

  const getAutoPartnerName = (g: Gender) => g === 'male' ? '수지' : g === 'female' ? '태현' : '연인';

  const handleGender = (value: Gender) => {
    setGender(value);
    setStep(5);
  };

  const handleQ1 = (value: 'peel' | 'want-peeled') => {
    setQ1(value);
    setStep(6);
  };

  const handleQ2 = (value: 'happy' | 'jealous') => {
    setQ2(value);
    setStep(7);
  };

  const handleQ3 = (value: EmotionCharacter) => {
    const g = gender!;
    const finalPartnerName = hasPartner ? partnerName.trim() : getAutoPartnerName(g);
    const side = (q1 === 'want-peeled' && q2 === 'jealous') ? 'A' :
                 (q1 === 'peel' && q2 === 'happy') ? 'B' :
                 Math.random() > 0.5 ? 'A' : 'B';
    onComplete({
      name: name.trim(),
      partnerName: finalPartnerName,
      gender: g,
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
    background: 'rgba(255,255,255,0.85)',
    border: '1px solid rgba(201,96,122,0.2)',
    color: '#2C1810',
    fontFamily: 'Noto Sans KR, sans-serif',
    borderRadius: '14px',
    padding: '16px 18px',
    width: '100%',
    fontSize: '15px',
    outline: 'none',
    boxShadow: '0 2px 12px rgba(201,96,122,0.08)',
  };

  const choiceBtn: React.CSSProperties = {
    background: 'rgba(255,255,255,0.85)',
    border: '1px solid rgba(201,96,122,0.2)',
    borderRadius: '14px',
    padding: '18px 20px',
    width: '100%',
    textAlign: 'left' as const,
    cursor: 'pointer',
    color: '#2C1810',
    fontFamily: 'Noto Sans KR, sans-serif',
    fontSize: '15px',
    boxShadow: '0 2px 12px rgba(201,96,122,0.08)',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(8px)',
  };

  // 총 단계 수 (시작화면 제외)
  const totalSteps = hasPartner ? 7 : 6;
  const currentProgress = step;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 이미지 - next/image */}
      <Image
        src="/bg-title.png"
        alt="Love Inside background"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center top' }}
        priority
      />
      {/* 오버레이 */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(253,240,235,0.55)', zIndex: 1 }}
      />

      {/* 콘텐츠 */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-8 py-16" style={{ zIndex: 2 }}>

        {/* STEP 0: 시작 화면 */}
        {step === 0 && (
          <div className="text-center opacity-0 animate-fadeIn" style={{ animationFillMode: 'forwards' }}>
            <div className="mb-12">
              {/* 이미지에 이미 Love Inside 타이틀이 있으므로 간결하게 */}
              <p className="text-sm tracking-widest mb-2" style={{ color: 'rgba(180,100,120,0.8)' }}>
                오늘 밤 12시, 제주
              </p>
              <p className="font-serif text-base" style={{ color: '#8B5A6A' }}>
                감정들과 함께하는 연애 이야기
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="px-10 py-4 rounded-2xl font-serif text-base tracking-wider transition-all"
              style={{
                background: 'rgba(201,96,122,0.15)',
                border: '1px solid rgba(201,96,122,0.35)',
                color: '#C9607A',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(201,96,122,0.15)',
              }}
            >
              시작하기 →
            </button>
          </div>
        )}

        {/* STEP 1: 내 이름 */}
        {step === 1 && (
          <div className="w-full max-w-sm opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="font-serif text-xl text-center mb-2" style={{ color: '#8B5A6A' }}>
              반가워요 😊
            </p>
            <p className="text-sm text-center mb-10" style={{ color: '#B08090' }}>
              당신의 이름을 알려주세요.
            </p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
              placeholder="이름 또는 닉네임"
              maxLength={10}
              style={inputStyle}
            />
            <button
              onClick={() => name.trim() && setStep(2)}
              disabled={!name.trim()}
              className="mt-5 w-full py-4 rounded-2xl text-sm font-medium transition-all"
              style={{
                background: name.trim() ? 'rgba(201,96,122,0.15)' : 'rgba(180,120,140,0.07)',
                border: name.trim() ? '1px solid rgba(201,96,122,0.35)' : '1px solid rgba(180,120,140,0.15)',
                color: name.trim() ? '#C9607A' : '#B08090',
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                backdropFilter: 'blur(8px)',
              }}
            >
              다음
            </button>
          </div>
        )}

        {/* STEP 2: 연인 유무 */}
        {step === 2 && (
          <div className="w-full max-w-sm opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="font-serif text-xl text-center mb-2" style={{ color: '#8B5A6A' }}>
              {name}님, 현재
            </p>
            <p className="font-serif text-xl text-center mb-10" style={{ color: '#8B5A6A' }}>
              만나고 있는 연인이 있나요?
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => { setHasPartner(true); setStep(3); }}
                style={choiceBtn}
              >
                <div className="font-medium">💑 네, 있어요</div>
              </button>
              <button
                onClick={() => { setHasPartner(false); setStep(4); }}
                style={choiceBtn}
              >
                <div className="font-medium">🌙 지금은 없어요</div>
                <div className="text-xs mt-1" style={{ color: '#B08090' }}>가상의 연인과 함께해요</div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: 연인 이름 (있을 때만) */}
        {step === 3 && (
          <div className="w-full max-w-sm opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="font-serif text-xl text-center mb-2" style={{ color: '#8B5A6A' }}>
              연인의 이름은요?
            </p>
            <p className="text-sm text-center mb-10" style={{ color: '#B08090' }}>
              이야기 속에서 함께할 거예요.
            </p>
            <input
              type="text"
              value={partnerName}
              onChange={e => setPartnerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && partnerName.trim() && setStep(4)}
              placeholder="연인의 이름 또는 닉네임"
              maxLength={10}
              style={inputStyle}
            />
            <button
              onClick={() => partnerName.trim() && setStep(4)}
              disabled={!partnerName.trim()}
              className="mt-5 w-full py-4 rounded-2xl text-sm font-medium transition-all"
              style={{
                background: partnerName.trim() ? 'rgba(201,96,122,0.15)' : 'rgba(180,120,140,0.07)',
                border: partnerName.trim() ? '1px solid rgba(201,96,122,0.35)' : '1px solid rgba(180,120,140,0.15)',
                color: partnerName.trim() ? '#C9607A' : '#B08090',
                cursor: partnerName.trim() ? 'pointer' : 'not-allowed',
                backdropFilter: 'blur(8px)',
              }}
            >
              다음
            </button>
          </div>
        )}

        {/* STEP 4: 성별 */}
        {step === 4 && (
          <div className="w-full max-w-sm opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="font-serif text-xl text-center mb-10" style={{ color: '#8B5A6A' }}>
              성별은요?
            </p>
            <div className="flex flex-col gap-4">
              {[
                { id: 'female' as Gender, label: '여자' },
                { id: 'male' as Gender, label: '남자' },
                { id: 'other' as Gender, label: '말하고 싶지 않아요' },
              ].map(opt => (
                <button key={opt.id} onClick={() => handleGender(opt.id)} style={choiceBtn} className="text-center">
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Q1 새우 */}
        {step === 5 && (
          <div className="w-full max-w-sm opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="font-serif text-xl text-center mb-2" style={{ color: '#8B5A6A' }}>
              🦐 딱새우 앞에서 나는?
            </p>
            <p className="text-sm text-center mb-10" style={{ color: '#B08090' }}>
              제주 1등 딱새우 맛집에 왔어요.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { id: 'peel' as const, label: '직접 까서 먹는다', sub: '손 버리는 게 대수야' },
                { id: 'want-peeled' as const, label: '누가 까줬으면 한다', sub: '그게 정이잖아' },
              ].map(opt => (
                <button key={opt.id} onClick={() => handleQ1(opt.id)} style={choiceBtn}>
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs mt-1" style={{ color: '#B08090' }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Q2 연인이 까줄 때 */}
        {step === 6 && (
          <div className="w-full max-w-sm opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="font-serif text-base text-center mb-2" style={{ color: '#8B5A6A' }}>
              연인이 친구들 새우를 척척 까주고 있어.
            </p>
            <p className="font-serif text-xl text-center mb-10" style={{ color: '#8B5A6A' }}>
              나는?
            </p>
            <div className="flex flex-col gap-4">
              {[
                { id: 'happy' as const, label: '흐뭇하다', sub: '저런 사람이라서 좋아했지' },
                { id: 'jealous' as const, label: '기분이 묘하다', sub: '나한테만 그래줬으면 좋겠는데' },
              ].map(opt => (
                <button key={opt.id} onClick={() => handleQ2(opt.id)} style={choiceBtn}>
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs mt-1" style={{ color: '#B08090' }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: Q3 다툴 때 */}
        {step === 7 && (
          <div className="w-full max-w-sm opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="font-serif text-base text-center mb-2" style={{ color: '#8B5A6A' }}>
              연인과 다툴 때 나의 모습은?
            </p>
            <p className="text-sm text-center mb-8" style={{ color: '#B08090' }}>
              가장 가까운 것을 골라줘요.
            </p>
            <div className="flex flex-col gap-3">
              {q3Options.map((opt, i) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ3(opt.id)}
                  className="opacity-0 animate-fadeIn"
                  style={{
                    ...choiceBtn,
                    animationDelay: `${i * 60}ms`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <span className="mr-2 text-base">{opt.emoji}</span>
                  <span className="text-sm">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 진행 표시 (step 1부터) */}
        {step >= 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all"
                style={{
                  width: i + 1 === currentProgress ? '20px' : '6px',
                  height: '6px',
                  background: i + 1 <= currentProgress
                    ? 'rgba(201,96,122,0.6)'
                    : 'rgba(201,96,122,0.2)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
