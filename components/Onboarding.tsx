'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlayerInfo, Gender, EmotionCharacter } from '@/types/game';

interface OnboardingProps {
  onComplete: (player: PlayerInfo) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [hasPartner, setHasPartner] = useState<boolean | null>(null);
  const [partnerName, setPartnerName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [q1, setQ1] = useState<'peel' | 'want-peeled' | null>(null);
  const [q2, setQ2] = useState<'happy' | 'jealous' | null>(null);

  const getAutoPartnerName = (g: Gender) => g === 'male' ? '수지' : '태현';

  const handleGender = (value: Gender) => { setGender(value); setStep(5); };
  const handleQ1 = (value: 'peel' | 'want-peeled') => { setQ1(value); setStep(6); };
  const handleQ2 = (value: 'happy' | 'jealous') => { setQ2(value); setStep(7); };

  const handleQ3 = (value: EmotionCharacter) => {
    const g = gender!;
    const finalPartnerName = hasPartner ? partnerName.trim() : getAutoPartnerName(g);
    const side = (q1 === 'want-peeled' && q2 === 'jealous') ? 'A' :
                 (q1 === 'peel' && q2 === 'happy') ? 'B' :
                 Math.random() > 0.5 ? 'A' : 'B';
    onComplete({ name: name.trim(), partnerName: finalPartnerName, gender: g, side, emotion: value, shrimpAnswer: q1!, partnerAnswer: q2!, reactionAnswer: value });
  };

  const q3Options: { id: EmotionCharacter; emoji: string; text: string }[] = [
    { id: 'buni',   emoji: '🔥', text: '"내가 화난 거 몰랐어?" 바로 맞받아친다' },
    { id: 'seorup', emoji: '🌧', text: '서러워서 눈물이 난다' },
    { id: 'dukeun', emoji: '💛', text: '지금 당장 달려와줬으면 하고 기대한다' },
    { id: 'honmi',  emoji: '🌀', text: '내 감정이 뭔지 모르겠다' },
    { id: 'dodo',   emoji: '🧊', text: '그냥 전화를 끊어버린다' },
  ];

  const btn = (onClick: () => void, children: React.ReactNode, sub?: string) => (
    <button onClick={onClick} style={{
      background: 'rgba(255,255,255,0.82)',
      border: '1px solid rgba(201,96,122,0.25)',
      borderRadius: '16px', padding: '18px 20px', width: '100%',
      textAlign: 'left', cursor: 'pointer', backdropFilter: 'blur(10px)',
      marginBottom: '12px', display: 'block',
    }}>
      <div style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: '15px', color: '#2C1810', fontWeight: 400 }}>{children}</div>
      {sub && <div style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: '12px', color: '#B08090', marginTop: '4px' }}>{sub}</div>}
    </button>
  );

  const input = (value: string, onChange: (v: string) => void, placeholder: string, onEnter: () => void) => (
    <input type="text" value={value} onChange={e => onChange(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && onEnter()}
      placeholder={placeholder} maxLength={10}
      style={{
        background: 'rgba(255,255,255,0.82)', border: '1px solid rgba(201,96,122,0.25)',
        borderRadius: '16px', padding: '18px 20px', width: '100%', fontSize: '15px',
        color: '#2C1810', fontFamily: 'Noto Sans KR, sans-serif',
        outline: 'none', backdropFilter: 'blur(10px)', display: 'block',
      }}
    />
  );

  const nextBtn = (onClick: () => void, disabled: boolean) => (
    <button onClick={onClick} disabled={disabled} style={{
      marginTop: '16px', width: '100%', padding: '16px',
      borderRadius: '16px', fontSize: '15px', fontFamily: 'Noto Sans KR, sans-serif',
      background: disabled ? 'rgba(180,120,140,0.1)' : 'rgba(201,96,122,0.18)',
      border: disabled ? '1px solid rgba(180,120,140,0.15)' : '1px solid rgba(201,96,122,0.35)',
      color: disabled ? '#C0A0A8' : '#C9607A', cursor: disabled ? 'not-allowed' : 'pointer',
      backdropFilter: 'blur(10px)',
    }}>다음</button>
  );

  const title = (text: string) => (
    <p style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '20px', color: '#7A3D50', textAlign: 'center', marginBottom: '32px', lineHeight: 1.6 }}>{text}</p>
  );

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Image src="/bg-title.png" alt="bg" fill priority style={{ objectFit: 'cover', objectPosition: 'center top', zIndex: 0 }} />
      {/* 오버레이 — 하단은 더 불투명하게 */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(253,240,235,0.35) 0%, rgba(253,240,235,0.75) 60%, rgba(253,240,235,0.92) 100%)', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '0 32px 60px' }}>

        {/* STEP 0: 시작 */}
        {step === 0 && (
          <div style={{ textAlign: 'center', width: '100%', maxWidth: '320px' }}>
            <p style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '14px', color: '#9B6070', letterSpacing: '0.1em', marginBottom: '8px' }}>오늘 밤 12시, 제주</p>
            <p style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '15px', color: '#7A3D50', marginBottom: '36px' }}>연애세포와 함께하는 연애 이야기</p>
            <button onClick={() => setStep(1)} style={{
              padding: '16px 40px', borderRadius: '50px', fontSize: '15px',
              fontFamily: 'Noto Serif KR, serif', letterSpacing: '0.05em',
              background: 'rgba(201,96,122,0.18)', border: '1px solid rgba(201,96,122,0.4)',
              color: '#C9607A', cursor: 'pointer', backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(201,96,122,0.15)',
            }}>시작하기 →</button>
          </div>
        )}

        {/* STEP 1: 이름 */}
        {step === 1 && (
          <div style={{ width: '100%', maxWidth: '320px' }}>
            {title('반가워요 😊\n당신의 이름을 알려주세요.')}
            {input(name, setName, '이름 또는 닉네임', () => name.trim() && setStep(2))}
            {nextBtn(() => setStep(2), !name.trim())}
          </div>
        )}

        {/* STEP 2: 연인 유무 */}
        {step === 2 && (
          <div style={{ width: '100%', maxWidth: '320px' }}>
            {title(`${name}님,\n현재 만나고 있는 연인이 있나요?`)}
            {btn(() => { setHasPartner(true); setStep(3); }, '💑 네, 있어요')}
            {btn(() => { setHasPartner(false); setStep(4); }, '🌙 지금은 없어요', '가상의 연인과 함께해요')}
          </div>
        )}

        {/* STEP 3: 연인 이름 */}
        {step === 3 && (
          <div style={{ width: '100%', maxWidth: '320px' }}>
            {title('연인의 이름은요?')}
            {input(partnerName, setPartnerName, '연인의 이름 또는 닉네임', () => partnerName.trim() && setStep(4))}
            {nextBtn(() => setStep(4), !partnerName.trim())}
          </div>
        )}

        {/* STEP 4: 성별 */}
        {step === 4 && (
          <div style={{ width: '100%', maxWidth: '320px' }}>
            {title('성별은요?')}
            {btn(() => handleGender('female'), '여자')}
            {btn(() => handleGender('male'), '남자')}
          </div>
        )}

        {/* STEP 5: Q1 */}
        {step === 5 && (
          <div style={{ width: '100%', maxWidth: '320px' }}>
            {title('🦐 딱새우 앞에서 나는?')}
            {btn(() => handleQ1('peel'), '직접 까서 먹는다', '손 버리는 게 대수야')}
            {btn(() => handleQ1('want-peeled'), '누가 까줬으면 한다', '그게 정이잖아')}
          </div>
        )}

        {/* STEP 6: Q2 */}
        {step === 6 && (
          <div style={{ width: '100%', maxWidth: '320px' }}>
            {title('연인이 친구들 새우를\n척척 까주고 있어. 나는?')}
            {btn(() => handleQ2('happy'), '흐뭇하다', '저런 사람이라서 좋아했지')}
            {btn(() => handleQ2('jealous'), '기분이 묘하다', '나한테만 그래줬으면 좋겠는데')}
          </div>
        )}

        {/* STEP 7: Q3 */}
        {step === 7 && (
          <div style={{ width: '100%', maxWidth: '320px' }}>
            {title('연인과 다툴 때\n나의 모습은?')}
            {q3Options.map(opt => (
              <button key={opt.id} onClick={() => handleQ3(opt.id)} style={{
                background: 'rgba(255,255,255,0.82)', border: '1px solid rgba(201,96,122,0.25)',
                borderRadius: '16px', padding: '16px 20px', width: '100%', textAlign: 'left',
                cursor: 'pointer', backdropFilter: 'blur(10px)', marginBottom: '10px', display: 'block',
                fontFamily: 'Noto Sans KR, sans-serif', fontSize: '14px', color: '#2C1810',
              }}>
                <span style={{ marginRight: '8px' }}>{opt.emoji}</span>{opt.text}
              </button>
            ))}
          </div>
        )}

        {/* 진행 도트 */}
        {step >= 1 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'center' }}>
            {[1,2,3,4,5,6,7].filter(s => !(s === 3 && !hasPartner)).map(s => (
              <div key={s} style={{
                width: s === step ? '20px' : '6px', height: '6px', borderRadius: '3px',
                background: s <= step ? 'rgba(201,96,122,0.6)' : 'rgba(201,96,122,0.2)',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
