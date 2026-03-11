'use client';

import { useState, useEffect, useRef } from 'react';
import { PlayerInfo, EmotionCharacter, EMOTION_CONFIG } from '@/types/game';
import EmotionBubble from './EmotionBubble';
import {
  WAKEUP_EMOTIONS_A_FEMALE, BUNI_CALLOUT_1,
  PHASE1_CHOICES,
  PHASE2_EMOTIONS_A_FEMALE, BUNI_CALLOUT_2, PHASE2_CHOICES,
  B_CONFESSION, PHASE2_CONFESSION_CHOICES, CONFESSION_EMOTION_REACTIONS,
  PHASE3_B_OPENERS, PHASE3_EMOTIONS_A_FEMALE, BUNI_CALLOUT_3, PHASE3_CHOICES,
  PHASE4_ARRIVAL, PHASE4_STEP1_EMOTIONS, BUNI_CALLOUT_4A, PHASE4_STEP1_CHOICES,
  PHASE4_STEP2_EMOTIONS, BUNI_CALLOUT_4B, PHASE4_STEP2_CHOICES,
  ENDINGS,
  EmotionLine,
} from '@/lib/storyData';

type SceneState =
  | 'phase1-emotions' | 'phase1-callout' | 'phase1-choices' | 'phase1-reactions'
  | 'phase2-emotions' | 'phase2-callout' | 'phase2-choices' | 'phase2-reactions'
  | 'phase2-confession' | 'phase2-confession-choices' | 'phase2-confession-reactions'
  | 'phase3-b-opener' | 'phase3-emotions' | 'phase3-callout' | 'phase3-choices' | 'phase3-reactions'
  | 'phase4-arrival' | 'phase4-step1-emotions' | 'phase4-step1-callout' | 'phase4-step1-choices' | 'phase4-step1-reactions'
  | 'phase4-step2-emotions' | 'phase4-step2-callout' | 'phase4-step2-choices'
  | 'ending';

interface GameSceneProps {
  player: PlayerInfo;
  onEnding: (type: 'happy' | 'breakup' | 'undecided') => void;
}

export default function GameScene({ player, onEnding }: GameSceneProps) {
  const [scene, setScene] = useState<SceneState>('phase1-emotions');
  const [visibleEmotions, setVisibleEmotions] = useState<EmotionLine[]>([]);
  const [playerInput, setPlayerInput] = useState('');
  const [reactions, setReactions] = useState<EmotionLine[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [phase1Choice, setPhase1Choice] = useState<string>('');
  const [phase2Choice, setPhase2Choice] = useState<string>('');
  const [phase3Choice, setPhase3Choice] = useState<string>('');
  const [bResponse, setBResponse] = useState('');
  const [confessionReactionType, setConfessionReactionType] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const name = player.name;

  const replaceName = (text: string) => text.replace('@NAME@', name);

  // 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scene, visibleEmotions, reactions]);

  // 씬 전환 시 감정 순차 표시
  useEffect(() => {
    let emotions: EmotionLine[] = [];
    if (scene === 'phase1-emotions') emotions = WAKEUP_EMOTIONS_A_FEMALE;
    else if (scene === 'phase2-emotions') emotions = PHASE2_EMOTIONS_A_FEMALE;
    else if (scene === 'phase3-emotions') emotions = PHASE3_EMOTIONS_A_FEMALE;
    else if (scene === 'phase4-step1-emotions') emotions = PHASE4_STEP1_EMOTIONS;
    else if (scene === 'phase4-step2-emotions') emotions = PHASE4_STEP2_EMOTIONS;
    if (!emotions.length) return;

    setVisibleEmotions([]);
    emotions.forEach((e, i) => {
      setTimeout(() => {
        setVisibleEmotions(prev => [...prev, e]);
        if (i === emotions.length - 1) {
          setTimeout(() => {
            setScene(prev => {
              if (prev === 'phase1-emotions') return 'phase1-callout';
              if (prev === 'phase2-emotions') return 'phase2-callout';
              if (prev === 'phase3-emotions') return 'phase3-callout';
              if (prev === 'phase4-step1-emotions') return 'phase4-step1-callout';
              if (prev === 'phase4-step2-emotions') return 'phase4-step2-callout';
              return prev;
            });
          }, 600);
        }
      }, i * 700);
    });
  }, [scene === 'phase1-emotions', scene === 'phase2-emotions', scene === 'phase3-emotions',
      scene === 'phase4-step1-emotions', scene === 'phase4-step2-emotions']);

  const handlePhase1Choice = (choiceId: string) => {
    const choice = PHASE1_CHOICES.find(c => c.id === choiceId)!;
    setPhase1Choice(choiceId);
    setBResponse(choice.bResponse);
    setReactions(Object.entries(choice.emotionReactions).map(([char, text]) => ({
      character: char as EmotionCharacter,
      text,
    })));
    setScene('phase1-reactions');
    setTimeout(() => setScene('phase2-emotions'), reactions.length * 600 + 2000);
  };

  const handlePhase2Choice = (choiceId: string) => {
    setPhase2Choice(choiceId);
    const choice = PHASE2_CHOICES.find(c => c.id === choiceId)!;
    setBResponse(choice.bResponse);

    if (choiceId === 'ask-direct') {
      setScene('phase2-confession');
      return;
    }
    if (choiceId === 'no-meet' || choiceId === 'give-up-today') {
      // 미결 엔딩으로
      setTimeout(() => onEnding('undecided'), 2000);
      return;
    }

    setReactions(Object.entries(choice.emotionReactions).map(([char, text]) => ({
      character: char as EmotionCharacter, text,
    })));
    setScene('phase2-reactions');
    setTimeout(() => {
      const opener = PHASE3_B_OPENERS[choiceId] || PHASE3_B_OPENERS['default'];
      setBResponse(opener);
      setScene('phase3-b-opener');
      setTimeout(() => setScene('phase3-emotions'), 1500);
    }, reactions.length * 600 + 2000);
  };

  const handleConfessionChoice = (choiceId: string) => {
    setConfessionReactionType(choiceId);
    const choice = PHASE2_CONFESSION_CHOICES.find(c => c.id === choiceId)!;
    setBResponse(choice.bResponse);
    setReactions(Object.entries(CONFESSION_EMOTION_REACTIONS[choiceId]).map(([char, text]) => ({
      character: char as EmotionCharacter, text,
    })));
    setScene('phase2-confession-reactions');
    setTimeout(() => {
      const opener = PHASE3_B_OPENERS[choiceId] || PHASE3_B_OPENERS['default'];
      setBResponse(opener);
      setScene('phase3-b-opener');
      setTimeout(() => setScene('phase3-emotions'), 1500);
    }, reactions.length * 600 + 2000);
  };

  const handlePhase3Choice = (choiceId: string) => {
    setPhase3Choice(choiceId);
    const choice = PHASE3_CHOICES.find(c => c.id === choiceId)!;
    setBResponse(choice.bResponse);

    if (choiceId === 'no-meet') {
      setReactions(Object.entries(choice.emotionReactions!).map(([char, text]) => ({
        character: char as EmotionCharacter, text,
      })));
      setScene('phase3-reactions');
      setTimeout(() => onEnding('undecided'), reactions.length * 600 + 2000);
      return;
    }

    setReactions(Object.entries(choice.emotionReactions!).map(([char, text]) => ({
      character: char as EmotionCharacter, text,
    })));
    setScene('phase3-reactions');
    setTimeout(() => {
      setBResponse(PHASE4_ARRIVAL);
      setScene('phase4-arrival');
      setTimeout(() => setScene('phase4-step1-emotions'), 1500);
    }, reactions.length * 600 + 2000);
  };

  const handlePhase4Step1Choice = (choiceId: string) => {
    const choice = PHASE4_STEP1_CHOICES.find(c => c.id === choiceId)!;
    setReactions(Object.entries(choice.emotionReactions!).map(([char, text]) => ({
      character: char as EmotionCharacter, text,
    })));
    setScene('phase4-step1-reactions');
    setTimeout(() => setScene('phase4-step2-emotions'), reactions.length * 600 + 1500);
  };

  const handlePhase4Step2Choice = (choiceId: string) => {
    const choice = PHASE4_STEP2_CHOICES.find(c => c.id === choiceId)!;
    setBResponse(choice.bResponse);
    if (choice.ending) {
      setScene('ending');
      setTimeout(() => onEnding(choice.ending!), 2000);
    } else {
      // "아직 화 안 풀렸어" → breakup
      setScene('ending');
      setTimeout(() => onEnding('breakup'), 2000);
    }
  };

  const getPhaseLabel = () => {
    if (scene.startsWith('phase1')) return '1';
    if (scene.startsWith('phase2')) return '2';
    if (scene.startsWith('phase3')) return '3';
    if (scene.startsWith('phase4')) return '4';
    return '';
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* 헤더 */}
      <div className="sticky top-0 z-20 px-6 py-3 flex items-center justify-between"
        style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <p className="text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>LOVE INSIDE</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {player.side === 'A' ? 'A편' : 'B편'} · {EMOTION_CONFIG[player.emotion].emoji} {EMOTION_CONFIG[player.emotion].name}
          </p>
        </div>
        <div className="flex gap-1">
          {['1','2','3','4'].map(n => (
            <div key={n} className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{
                background: n === getPhaseLabel() ? 'rgba(255,107,107,0.2)' : 'rgba(255,255,255,0.05)',
                border: n === getPhaseLabel() ? '1px solid rgba(255,107,107,0.4)' : '1px solid rgba(255,255,255,0.08)',
                color: n === getPhaseLabel() ? 'var(--accent-warm)' : 'var(--text-muted)',
              }}>
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-4 py-6 max-w-sm mx-auto w-full overflow-y-auto">

        {/* 감정들 와글와글 */}
        {visibleEmotions.map((e, i) => (
          <EmotionBubble
            key={`${scene}-${i}`}
            character={e.character}
            text={e.text}
            delay={0}
          />
        ))}

        {/* 분이의 callout */}
        {(scene === 'phase1-callout' || scene === 'phase1-choices') && (
          <EmotionBubble
            character="buni"
            text={replaceName(BUNI_CALLOUT_1)}
            delay={0}
            className="border-2"
          />
        )}
        {(scene === 'phase2-callout' || scene === 'phase2-choices') && (
          <EmotionBubble character="buni" text={replaceName(BUNI_CALLOUT_2)} delay={0} />
        )}
        {(scene === 'phase3-callout' || scene === 'phase3-choices') && (
          <EmotionBubble character="buni" text={replaceName(BUNI_CALLOUT_3)} delay={0} />
        )}
        {(scene === 'phase4-step1-callout' || scene === 'phase4-step1-choices') && (
          <EmotionBubble character="buni" text={replaceName(BUNI_CALLOUT_4A)} delay={0} />
        )}
        {(scene === 'phase4-step2-callout' || scene === 'phase4-step2-choices') && (
          <EmotionBubble character="buni" text={replaceName(BUNI_CALLOUT_4B)} delay={0} />
        )}

        {/* B의 반응 */}
        {bResponse && (scene === 'phase1-reactions' || scene === 'phase2-reactions' ||
          scene === 'phase2-confession' || scene === 'phase2-confession-reactions' ||
          scene === 'phase3-b-opener' || scene === 'phase3-reactions' ||
          scene === 'phase4-arrival' || scene === 'phase4-step1-reactions' ||
          scene === 'phase4-step2-choices' || scene === 'ending') && (
          <div className="opacity-0 animate-fadeIn my-4" style={{ animationFillMode: 'forwards' }}>
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl text-sm max-w-xs"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '18px 18px 18px 4px',
                  color: 'var(--text-primary)',
                  fontWeight: 300,
                }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>B</p>
                {bResponse}
              </div>
            </div>
          </div>
        )}

        {/* B 고백 씬 */}
        {scene === 'phase2-confession' && (
          <div className="my-4">
            <p className="text-center text-xs mb-4 animate-pulse-soft" style={{ color: 'var(--text-muted)' }}>
              {B_CONFESSION.pause}
            </p>
            <div className="flex justify-start mb-3">
              <div className="px-4 py-3 rounded-2xl text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px 18px 18px 4px', color: 'var(--text-primary)', fontWeight: 300 }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>B</p>
                {B_CONFESSION.text}
              </div>
            </div>
            <div className="flex justify-start opacity-0 animate-fadeIn delay-500"
              style={{ animationFillMode: 'forwards' }}>
              <div className="px-4 py-3 rounded-2xl text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px 18px 18px 4px', color: 'var(--text-primary)', fontWeight: 300 }}>
                {B_CONFESSION.clarify}
              </div>
            </div>
          </div>
        )}

        {/* 2턴 반응 */}
        {reactions.length > 0 && (scene === 'phase1-reactions' || scene === 'phase2-reactions' ||
          scene === 'phase2-confession-reactions' || scene === 'phase3-reactions' ||
          scene === 'phase4-step1-reactions') && (
          <div className="mt-4">
            {reactions.map((r, i) => (
              <EmotionBubble
                key={i}
                character={r.character}
                text={r.text}
                delay={i * 500}
                isPlayer={r.character === player.emotion}
              />
            ))}
          </div>
        )}

        {/* 선택지들 */}
        {scene === 'phase1-choices' && (
          <div className="mt-6 space-y-2 opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs text-center mb-3" style={{ color: 'var(--text-muted)' }}>어떻게 할까?</p>
            {PHASE1_CHOICES.map(choice => (
              <button key={choice.id} onClick={() => handlePhase1Choice(choice.id)} className="choice-btn">
                <div className="font-medium text-sm">{choice.text}</div>
                {choice.subtext && <div className="text-xs mt-1 italic" style={{ color: 'var(--text-muted)' }}>{choice.subtext}</div>}
              </button>
            ))}
          </div>
        )}

        {scene === 'phase2-choices' && (
          <div className="mt-6 space-y-2 opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs text-center mb-3" style={{ color: 'var(--text-muted)' }}>어떻게 할까?</p>
            {PHASE2_CHOICES.map(choice => (
              <button key={choice.id} onClick={() => handlePhase2Choice(choice.id)} className="choice-btn">
                <div className="font-medium text-sm">{choice.text}</div>
                {choice.subtext && <div className="text-xs mt-1 italic" style={{ color: 'var(--text-muted)' }}>{choice.subtext}</div>}
              </button>
            ))}
          </div>
        )}

        {scene === 'phase2-confession-choices' && (
          <div className="mt-6 space-y-2 opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs text-center mb-3" style={{ color: 'var(--text-muted)' }}>이 말을 듣고...</p>
            {PHASE2_CONFESSION_CHOICES.map(choice => (
              <button key={choice.id} onClick={() => handleConfessionChoice(choice.id)} className="choice-btn">
                <div className="font-medium text-sm">{choice.text}</div>
                {choice.subtext && <div className="text-xs mt-1 italic" style={{ color: 'var(--text-muted)' }}>{choice.subtext}</div>}
              </button>
            ))}
          </div>
        )}

        {scene === 'phase3-choices' && (
          <div className="mt-6 space-y-2 opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs text-center mb-3" style={{ color: 'var(--text-muted)' }}>오늘 밤, 어떻게 할까?</p>
            {PHASE3_CHOICES.map(choice => (
              <button key={choice.id} onClick={() => handlePhase3Choice(choice.id)} className="choice-btn">
                <div className="font-medium text-sm">{choice.text}</div>
                {choice.subtext && <div className="text-xs mt-1 italic" style={{ color: 'var(--text-muted)' }}>{choice.subtext}</div>}
              </button>
            ))}
          </div>
        )}

        {scene === 'phase4-step1-choices' && (
          <div className="mt-6 space-y-2 opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            {PHASE4_STEP1_CHOICES.map(choice => (
              <button key={choice.id} onClick={() => handlePhase4Step1Choice(choice.id)} className="choice-btn">
                <div className="font-medium text-sm">{choice.text}</div>
              </button>
            ))}
          </div>
        )}

        {scene === 'phase4-step2-choices' && (
          <div className="mt-6 space-y-2 opacity-0 animate-slideUp" style={{ animationFillMode: 'forwards' }}>
            <p className="text-xs text-center mb-3" style={{ color: 'var(--text-muted)' }}>뭐라고 할까?</p>
            {PHASE4_STEP2_CHOICES.map(choice => (
              <button key={choice.id} onClick={() => handlePhase4Step2Choice(choice.id)} className="choice-btn">
                <div className="font-medium text-sm">{choice.text}</div>
              </button>
            ))}
          </div>
        )}

        {/* 다음으로 버튼 (callout 상태에서) */}
        {(scene === 'phase1-callout') && (
          <button onClick={() => setScene('phase1-choices')}
            className="mt-4 w-full py-2 rounded-xl text-xs opacity-0 animate-fadeIn delay-300 transition-all"
            style={{ animationFillMode: 'forwards', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
            내 생각을 말할게 →
          </button>
        )}
        {(scene === 'phase2-callout') && (
          <button onClick={() => setScene('phase2-choices')}
            className="mt-4 w-full py-2 rounded-xl text-xs opacity-0 animate-fadeIn delay-300 transition-all"
            style={{ animationFillMode: 'forwards', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
            내 생각을 말할게 →
          </button>
        )}
        {(scene === 'phase3-callout') && (
          <button onClick={() => setScene('phase3-choices')}
            className="mt-4 w-full py-2 rounded-xl text-xs opacity-0 animate-fadeIn delay-300 transition-all"
            style={{ animationFillMode: 'forwards', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
            결정할게 →
          </button>
        )}
        {scene === 'phase2-confession' && (
          <button onClick={() => setScene('phase2-confession-choices')}
            className="mt-4 w-full py-2 rounded-xl text-xs opacity-0 animate-fadeIn delay-1000 transition-all"
            style={{ animationFillMode: 'forwards', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
            이 말을 듣고... →
          </button>
        )}
        {(scene === 'phase4-step1-callout') && (
          <button onClick={() => setScene('phase4-step1-choices')}
            className="mt-4 w-full py-2 rounded-xl text-xs opacity-0 animate-fadeIn delay-300 transition-all"
            style={{ animationFillMode: 'forwards', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
            결정할게 →
          </button>
        )}
        {(scene === 'phase4-step2-callout') && (
          <button onClick={() => setScene('phase4-step2-choices')}
            className="mt-4 w-full py-2 rounded-xl text-xs opacity-0 animate-fadeIn delay-300 transition-all"
            style={{ animationFillMode: 'forwards', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
            말할게 →
          </button>
        )}

        <div ref={bottomRef} className="h-8" />
      </div>
    </div>
  );
}
