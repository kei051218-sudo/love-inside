'use client';

import { useState } from 'react';
import { PlayerInfo } from '@/types/game';
import Onboarding from '@/components/Onboarding';
import Prologue from '@/components/Prologue';
import EmotionReveal from '@/components/EmotionReveal';
import GameScene from '@/components/GameScene';
import EndingScreen from '@/components/EndingScreen';

type AppPhase = 'onboarding' | 'prologue' | 'reveal' | 'game' | 'ending';

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>('onboarding');
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [endingType, setEndingType] = useState<'happy' | 'breakup' | 'undecided' | null>(null);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-deep)', position: 'relative' }}>
      {phase === 'onboarding' && (
        <Onboarding onComplete={(p) => { setPlayer(p); setPhase('prologue'); }} />
      )}
      {phase === 'prologue' && player && (
        <Prologue player={player} onComplete={() => setPhase('reveal')} />
      )}
      {phase === 'reveal' && player && (
        <EmotionReveal player={player} onComplete={() => setPhase('game')} />
      )}
      {phase === 'game' && player && (
        <GameScene player={player} onEnding={(type) => { setEndingType(type); setPhase('ending'); }} />
      )}
      {phase === 'ending' && endingType && (
        <EndingScreen type={endingType} onRestart={() => { setPlayer(null); setEndingType(null); setPhase('onboarding'); }} />
      )}
    </main>
  );
}
