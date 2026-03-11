export type Gender = 'female' | 'male' | 'other';
export type Side = 'A' | 'B'; // A: 화난 쪽, B: 새우 까준 쪽
export type EmotionCharacter = 'buni' | 'seorup' | 'dukeun' | 'honmi' | 'dodo';
export type EndingType = 'happy' | 'breakup' | 'undecided';
export type PhaseType = 'onboarding' | 'prologue' | 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'ending';

export interface PlayerInfo {
  name: string;
  gender: Gender;
  side: Side;
  emotion: EmotionCharacter;
  // 온보딩 답변
  shrimpAnswer: 'peel' | 'want-peeled'; // Q1
  partnerAnswer: 'happy' | 'jealous';   // Q2
  reactionAnswer: EmotionCharacter;      // Q3
}

export interface EmotionMessage {
  character: EmotionCharacter;
  message: string;
  isPlayer?: boolean;
}

export interface GameState {
  player: PlayerInfo | null;
  currentPhase: PhaseType;
  currentStep: number;
  messages: EmotionMessage[];
  choices: Record<string, string>; // 분기별 선택 저장
  ending: EndingType | null;
}

export const EMOTION_CONFIG: Record<EmotionCharacter, { name: string; emoji: string; color: string }> = {
  buni:   { name: '분이',  emoji: '🔥', color: '#FF4B4B' },
  seorup: { name: '서럽',  emoji: '🌧', color: '#6B9FD4' },
  dukeun: { name: '두근',  emoji: '💛', color: '#FFD93D' },
  honmi:  { name: '혼미',  emoji: '🌀', color: '#B39DDB' },
  dodo:   { name: '도도',  emoji: '🧊', color: '#80CBC4' },
};
