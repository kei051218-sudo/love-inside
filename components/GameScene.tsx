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
  EmotionLine,
} from '@/lib/storyData';

// 메시지 타입
interface Message {
  type: 'emotion' | 'buni-callout' | 'b-response' | 'player-input' | 'narrator';
  character?: EmotionCharacter;
  text: string;
  isPlayer?: boolean;
}

// 씬 단계
type TurnState =
  | 'showing-emotions-1'   // 1턴: 감정들 순차 표시 중
  | 'waiting-player-input' // 분이 callout 후 플레이어 입력 대기
  | 'showing-reactions'    // 2턴: 플레이어 입력 후 감정들 반응 표시 중
  | 'showing-choices'      // 선택지 표시
  | 'b-confession'         // B 고백 씬
  | 'b-confession-choices'
  | 'b-arrival'            // B 집 앞 도착
  | 'ending-transition';

interface GameSceneProps {
  player: PlayerInfo;
  onEnding: (type: 'happy' | 'breakup' | 'undecided') => void;
}

export default function GameScene({ player, onEnding }: GameSceneProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [turnState, setTurnState] = useState<TurnState>('showing-emotions-1');
  const [currentPhase, setCurrentPhase] = useState(1);
  const [playerInputText, setPlayerInputText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [currentChoices, setCurrentChoices] = useState<typeof PHASE1_CHOICES>([]);
  const [phase1ChoiceId, setPhase1ChoiceId] = useState('');
  const [phase2ChoiceId, setPhase2ChoiceId] = useState('');
  const [isAddingMessages, setIsAddingMessages] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const name = player.name;
  const replaceName = (t: string) => t.replace('@NAME@', name);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showInput, showChoices]);

  // 메시지 순차 추가 헬퍼
  const addMessagesSequentially = async (newMessages: Message[], delayMs = 600) => {
    setIsAddingMessages(true);
    for (const msg of newMessages) {
      await new Promise(r => setTimeout(r, delayMs));
      setMessages(prev => [...prev, msg]);
    }
    setIsAddingMessages(false);
  };

  // Phase 1 시작
  useEffect(() => {
    if (currentPhase === 1 && turnState === 'showing-emotions-1') {
      startEmotionTurn(WAKEUP_EMOTIONS_A_FEMALE, BUNI_CALLOUT_1);
    }
  }, []);

  const startEmotionTurn = async (emotions: EmotionLine[], callout: string) => {
    const msgs: Message[] = [
      ...emotions.map(e => ({ type: 'emotion' as const, character: e.character, text: e.text })),
      { type: 'buni-callout', character: 'buni' as EmotionCharacter, text: replaceName(callout) },
    ];
    await addMessagesSequentially(msgs, 700);
    setTurnState('waiting-player-input');
    setShowInput(true);
  };

  const handlePlayerSubmit = async () => {
    if (!playerInputText.trim()) return;
    const inputText = playerInputText.trim();
    setPlayerInputText('');
    setShowInput(false);

    // 플레이어 메시지 추가
    setMessages(prev => [...prev, {
      type: 'player-input',
      character: player.emotion,
      text: inputText,
      isPlayer: true,
    }]);

    setTurnState('showing-reactions');

    // 2턴: 감정들 반응 (플레이어 입력에 대한 반응)
    await new Promise(r => setTimeout(r, 400));

    // 각 phase의 감정 반응 가져오기
    let reactions: EmotionLine[] = [];
    if (currentPhase === 1) {
      reactions = getPhase1Reactions(inputText);
    } else if (currentPhase === 2) {
      reactions = getPhase2Reactions(inputText);
    } else if (currentPhase === 3) {
      reactions = getPhase3Reactions(inputText);
    } else if (currentPhase === 4) {
      reactions = getPhase4Reactions(inputText);
    }

    await addMessagesSequentially(
      reactions.map(r => ({ type: 'emotion' as const, character: r.character, text: r.text })),
      600
    );

    // 선택지 표시
    await new Promise(r => setTimeout(r, 400));
    setTurnState('showing-choices');
    setShowChoices(true);

    if (currentPhase === 1) setCurrentChoices(PHASE1_CHOICES as unknown as typeof PHASE1_CHOICES);
    else if (currentPhase === 2) setCurrentChoices(PHASE2_CHOICES as unknown as typeof PHASE1_CHOICES);
    else if (currentPhase === 3) setCurrentChoices(PHASE3_CHOICES as unknown as typeof PHASE1_CHOICES);
    else if (currentPhase === 4) setCurrentChoices(PHASE4_STEP2_CHOICES as unknown as typeof PHASE1_CHOICES);
  };

  // 플레이어 입력 기반 감정 반응 (간단 버전 - 키워드 분석)
  const getPhase1Reactions = (input: string): EmotionLine[] => {
    const isSorry = /미안|사과|잘못|그랬/.test(input);
    const isAngry = /화나|억울|왜|어떻게|그럴/.test(input);

    if (isSorry) return [
      { character: 'buni',   text: '에이, 우리가 왜 먼저 사과해.' },
      { character: 'seorup', text: '그래도... 오늘 하루 잘 마무리하고 싶어.' },
      { character: 'dukeun', text: '잘했어! 이러면 대화가 되잖아.' },
      { character: 'honmi',  text: '이게 맞는 방식인가... 그래도 얘기는 되겠다.' },
      { character: 'dodo',   text: '사과는 했으니까. 이제 할 말 해.' },
    ];
    if (isAngry) return [
      { character: 'buni',   text: '그렇지. 바로 가. 뭘 잘못했는지 스스로 말하게 해봐.' },
      { character: 'seorup', text: '근데 이러면 더 감정적으로 흘러갈 것 같은데...' },
      { character: 'dukeun', text: '조금 세게 나갔지만... 솔직한 거잖아.' },
      { character: 'honmi',  text: '이게 맞는 건지 모르겠는데 일단 말은 나왔어.' },
      { character: 'dodo',   text: '좋아. 뭘 잘못했는지 스스로 말하게 해봐.' },
    ];
    return [
      { character: 'buni',   text: '일단 들어봐. 뭐라고 하나.' },
      { character: 'seorup', text: '...' },
      { character: 'dukeun', text: '그래도 전화는 됐잖아. 긍정적으로 생각하자.' },
      { character: 'honmi',  text: '뭐가 맞는 건지 모르겠어.' },
      { character: 'dodo',   text: '잠깐 기다려봐.' },
    ];
  };

  const getPhase2Reactions = (input: string): EmotionLine[] => {
    const isVent = /쌓인|항상|매번|오늘만|나한테만/.test(input);
    const isAskEye = /예뻐|눈에|친구|차려/.test(input);

    if (isVent) return [
      { character: 'buni',   text: '드디어 말했어. 잘했어.' },
      { character: 'seorup', text: '미안하다고 했어. 근데 왜 눈물이 나려고 하지.' },
      { character: 'dukeun', text: '알아줬잖아. 이제 좀 풀릴 것 같아.' },
      { character: 'honmi',  text: '근데 다음엔 또 이럴 것 같은데... 아닌가.' },
      { character: 'dodo',   text: '말로만 미안하면 뭐해. 바뀌어야지.' },
    ];
    if (isAskEye) return [
      { character: 'buni',   text: '그래. 이건 짚고 넘어가야 해.' },
      { character: 'seorup', text: '물어보고 싶은데... 대답이 무서워.' },
      { character: 'dukeun', text: '물어봐도 돼. 근데 대답 들을 준비는 해야 해.' },
      { character: 'honmi',  text: '물어보면 해결되는 건가. 아니면 더 복잡해지는 건가.' },
      { character: 'dodo',   text: '눈 똑바로 뜨고 물어봐.' },
    ];
    return [
      { character: 'buni',   text: '오늘 다 털어내자.' },
      { character: 'seorup', text: '근데 다 얘기하면... 감당할 수 있을까.' },
      { character: 'dukeun', text: '얘기하자. 싸우려는 게 아니라 알아줬으면 해서.' },
      { character: 'honmi',  text: '너무 많이 쏟아내면 감당이 안 될 것 같기도 하고.' },
      { character: 'dodo',   text: '맞아. 오늘 확실히 해두자.' },
    ];
  };

  const getPhase3Reactions = (input: string): EmotionLine[] => {
    const wantMeet = /와|오라|보고|만나/.test(input);
    const dontMeet = /자|내일|오지마|혼자/.test(input);

    if (wantMeet) return [
      { character: 'buni',   text: '그래. 와서 직접 설명해봐.' },
      { character: 'seorup', text: '오면... 또 눈물 날 것 같아. 근데 괜찮아.' },
      { character: 'dukeun', text: '잘했어. 보면 다 풀릴 거야.' },
      { character: 'honmi',  text: '만나면 해결될까. 근데 안 보는 것보단 낫겠지.' },
      { character: 'dodo',   text: '오라고 해. 근데 기다리게 해.' },
    ];
    if (dontMeet) return [
      { character: 'buni',   text: '맞아. 오늘은 혼자 정리할 시간이 필요해.' },
      { character: 'seorup', text: '혼자 있으면 더 생각 많아질 것 같은데...' },
      { character: 'dukeun', text: '에이... 보고 싶은데.' },
      { character: 'honmi',  text: '혼자 있는 게 맞는 건지. 더 멀어지는 건 아닐지.' },
      { character: 'dodo',   text: '혼자 있어. 감정 정리하고 만나는 게 나아.' },
    ];
    return [
      { character: 'buni',   text: '결정해야 해.' },
      { character: 'seorup', text: '나도 모르겠어... 우리 어떻게 되는 걸까.' },
      { character: 'dukeun', text: '일단 목소리라도 들으면 좀 나아질 거야.' },
      { character: 'honmi',  text: '그니까. 나도 혼미야 지금.' },
      { character: 'dodo',   text: '모르면 일단 아무것도 하지 마.' },
    ];
  };

  const getPhase4Reactions = (input: string): EmotionLine[] => {
    const isSorry = /미안|잘못/.test(input);
    const isMiss = /보고싶|보고 싶/.test(input);

    if (isSorry) return [
      { character: 'buni',   text: '...뭐야. 화가 안 나네. 억울하다.' },
      { character: 'seorup', text: '눈물이 나는데 슬프지가 않아.' },
      { character: 'dukeun', text: '거봐. 괜찮을 거라고 했잖아.' },
      { character: 'honmi',  text: '이게 맞는 건지 아직도 모르겠는데... 기분은 좋아.' },
      { character: 'dodo',   text: '...잘 됐네.' },
    ];
    if (isMiss) return [
      { character: 'buni',   text: '아직 화 안 풀렸는데 보고 싶다고? 뭐야, 나도 그렇네.' },
      { character: 'seorup', text: '이 말이 제일 솔직한 말이야.' },
      { character: 'dukeun', text: '맞아맞아. 이게 진심이잖아.' },
      { character: 'honmi',  text: '보고 싶었다는 말로 시작하면... 어떻게 되는 거지.' },
      { character: 'dodo',   text: '나쁘지 않은 시작이네.' },
    ];
    return [
      { character: 'buni',   text: '말을 해야 뭔가 되지.' },
      { character: 'seorup', text: '침묵도 말이야.' },
      { character: 'dukeun', text: '말 없이 눈만 봐도 통할 수 있어.' },
      { character: 'honmi',  text: '침묵이 편한 건지, 불편한 건지.' },
      { character: 'dodo',   text: '기다려. 걔가 먼저 말할 거야.' },
    ];
  };

  // Phase 1 선택
  const handlePhase1Choice = async (choiceId: string) => {
    setShowChoices(false);
    setCurrentChoices([]);
    setPhase1ChoiceId(choiceId);

    const choice = PHASE1_CHOICES.find(c => c.id === choiceId)!;

    // B 반응
    await new Promise(r => setTimeout(r, 300));
    setMessages(prev => [...prev, { type: 'b-response', text: choice.bResponse }]);

    // Phase 2로
    await new Promise(r => setTimeout(r, 1200));
    setCurrentPhase(2);
    setTurnState('showing-emotions-1');
    await startPhase2();
  };

  const startPhase2 = async () => {
    const msgs: Message[] = [
      ...PHASE2_EMOTIONS_A_FEMALE.map(e => ({ type: 'emotion' as const, character: e.character, text: e.text })),
      { type: 'buni-callout', character: 'buni' as EmotionCharacter, text: replaceName(BUNI_CALLOUT_2) },
    ];
    await addMessagesSequentially(msgs, 700);
    setTurnState('waiting-player-input');
    setShowInput(true);
  };

  // Phase 2 선택
  const handlePhase2Choice = async (choiceId: string) => {
    setShowChoices(false);
    setCurrentChoices([]);
    setPhase2ChoiceId(choiceId);

    const choice = PHASE2_CHOICES.find(c => c.id === choiceId)!;

    if (choiceId === 'ask-direct') {
      // B 고백 씬
      setMessages(prev => [...prev, { type: 'narrator', text: '...' }]);
      await new Promise(r => setTimeout(r, 800));
      setMessages(prev => [...prev, { type: 'b-response', text: B_CONFESSION.text }]);
      await new Promise(r => setTimeout(r, 1000));
      setMessages(prev => [...prev, { type: 'b-response', text: B_CONFESSION.clarify }]);
      await new Promise(r => setTimeout(r, 800));
      setTurnState('b-confession-choices');
      setShowChoices(true);
      setCurrentChoices(PHASE2_CONFESSION_CHOICES as typeof PHASE1_CHOICES);
      return;
    }

    if (choiceId === 'give-up-today') {
      setMessages(prev => [...prev, { type: 'b-response', text: choice.bResponse }]);
      await new Promise(r => setTimeout(r, 1500));
      onEnding('undecided');
      return;
    }

    setMessages(prev => [...prev, { type: 'b-response', text: choice.bResponse }]);
    await new Promise(r => setTimeout(r, 1200));
    await startPhase3(choiceId);
  };

  // Phase 2 고백 선택
  const handleConfessionChoice = async (choiceId: string) => {
    setShowChoices(false);
    setCurrentChoices([]);

    const choice = PHASE2_CONFESSION_CHOICES.find(c => c.id === choiceId)!;
    setMessages(prev => [...prev, { type: 'b-response', text: choice.bResponse }]);

    // 반응
    const reactions = Object.entries(CONFESSION_EMOTION_REACTIONS[choiceId]).map(([char, text]) => ({
      character: char as EmotionCharacter, text,
    }));
    await addMessagesSequentially(
      reactions.map(r => ({ type: 'emotion' as const, character: r.character, text: r.text })),
      500
    );

    await new Promise(r => setTimeout(r, 800));
    await startPhase3(choiceId);
  };

  const startPhase3 = async (prevChoiceId: string) => {
    setCurrentPhase(3);
    const opener = PHASE3_B_OPENERS[prevChoiceId] || PHASE3_B_OPENERS['default'];
    setMessages(prev => [...prev, { type: 'b-response', text: opener }]);
    await new Promise(r => setTimeout(r, 1000));

    const msgs: Message[] = [
      ...PHASE3_EMOTIONS_A_FEMALE.map(e => ({ type: 'emotion' as const, character: e.character, text: e.text })),
      { type: 'buni-callout', character: 'buni' as EmotionCharacter, text: replaceName(BUNI_CALLOUT_3) },
    ];
    await addMessagesSequentially(msgs, 700);
    setTurnState('waiting-player-input');
    setShowInput(true);
  };

  // Phase 3 선택
  const handlePhase3Choice = async (choiceId: string) => {
    setShowChoices(false);
    setCurrentChoices([]);

    const choice = PHASE3_CHOICES.find(c => c.id === choiceId)!;
    setMessages(prev => [...prev, { type: 'b-response', text: choice.bResponse }]);

    if (choiceId === 'no-meet') {
      await new Promise(r => setTimeout(r, 1500));
      onEnding('undecided');
      return;
    }

    await new Promise(r => setTimeout(r, 1200));
    // Phase 4
    setCurrentPhase(4);
    setMessages(prev => [...prev, { type: 'narrator', text: '잠시 후...' }]);
    await new Promise(r => setTimeout(r, 800));
    setMessages(prev => [...prev, { type: 'b-response', text: PHASE4_ARRIVAL }]);
    await new Promise(r => setTimeout(r, 1000));

    // Phase 4 Step 1
    const msgs1: Message[] = [
      ...PHASE4_STEP1_EMOTIONS.map(e => ({ type: 'emotion' as const, character: e.character, text: e.text })),
      { type: 'buni-callout', character: 'buni' as EmotionCharacter, text: replaceName(BUNI_CALLOUT_4A) },
    ];
    await addMessagesSequentially(msgs1, 700);

    setShowChoices(true);
    setCurrentChoices(PHASE4_STEP1_CHOICES as typeof PHASE1_CHOICES);
    setTurnState('showing-choices');
  };

  // Phase 4 Step 1 선택 (나가기/들어오기)
  const handlePhase4Step1Choice = async (choiceId: string) => {
    setShowChoices(false);
    setCurrentChoices([]);

    const choice = PHASE4_STEP1_CHOICES.find(c => c.id === choiceId)!;
    const reactions = Object.entries(choice.emotionReactions!).map(([char, text]) => ({
      character: char as EmotionCharacter, text,
    }));
    await addMessagesSequentially(
      reactions.map(r => ({ type: 'emotion' as const, character: r.character, text: r.text })),
      500
    );

    await new Promise(r => setTimeout(r, 600));

    // Phase 4 Step 2
    const msgs2: Message[] = [
      ...PHASE4_STEP2_EMOTIONS.map(e => ({ type: 'emotion' as const, character: e.character, text: e.text })),
      { type: 'buni-callout', character: 'buni' as EmotionCharacter, text: replaceName(BUNI_CALLOUT_4B) },
    ];
    await addMessagesSequentially(msgs2, 700);
    setTurnState('waiting-player-input');
    setShowInput(true);
  };

  // Phase 4 Step 2 선택
  const handlePhase4Step2Choice = async (choiceId: string) => {
    setShowChoices(false);
    const choice = PHASE4_STEP2_CHOICES.find(c => c.id === choiceId)!;
    setMessages(prev => [...prev, { type: 'b-response', text: choice.bResponse }]);
    await new Promise(r => setTimeout(r, 1500));

    if (choice.ending) onEnding(choice.ending);
    else onEnding('breakup');
  };

  // 선택지 라우팅
  const handleChoice = (choiceId: string) => {
    if (currentPhase === 1) handlePhase1Choice(choiceId);
    else if (currentPhase === 2 && turnState !== 'b-confession-choices') handlePhase2Choice(choiceId);
    else if (turnState === 'b-confession-choices') handleConfessionChoice(choiceId);
    else if (currentPhase === 3) handlePhase3Choice(choiceId);
    else if (currentPhase === 4 && currentChoices === (PHASE4_STEP1_CHOICES as typeof PHASE1_CHOICES)) handlePhase4Step1Choice(choiceId);
    else if (currentPhase === 4) handlePhase4Step2Choice(choiceId);
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* 헤더 - 심플하게 */}
      <div className="sticky top-0 z-20 px-6 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(253,246,240,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
        <p className="font-serif text-sm tracking-widest" style={{ color: 'var(--accent-warm)' }}>
          💕 LOVE INSIDE
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {EMOTION_CONFIG[player.emotion].emoji} {EMOTION_CONFIG[player.emotion].name}
        </p>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 px-4 py-6 max-w-sm mx-auto w-full">
        {messages.map((msg, i) => {
          if (msg.type === 'narrator') {
            return (
              <p key={i} className="text-center text-xs my-4 italic" style={{ color: 'var(--text-muted)' }}>
                {msg.text}
              </p>
            );
          }
          if (msg.type === 'b-response') {
            return (
              <div key={i} className="flex justify-start mb-3">
                <div className="max-w-xs">
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{player.partnerName}</p>
                  <div className="px-4 py-3 rounded-2xl text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '18px 18px 18px 4px',
                      color: 'var(--text-primary)',
                      fontWeight: 300,
                      boxShadow: '0 1px 8px rgba(180,120,140,0.08)',
                    }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          }
          if (msg.type === 'player-input') {
            return (
              <div key={i} className="flex justify-end mb-3">
                <div className="max-w-xs">
                  <p className="text-xs mb-1 text-right" style={{ color: 'var(--accent-warm)' }}>
                    {EMOTION_CONFIG[player.emotion].emoji} {player.name}
                  </p>
                  <div className="px-4 py-3 rounded-2xl text-sm"
                    style={{
                      background: 'rgba(201,96,122,0.1)',
                      border: '1px solid rgba(201,96,122,0.25)',
                      borderRadius: '18px 18px 4px 18px',
                      color: 'var(--text-primary)',
                      fontWeight: 300,
                    }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          }
          // emotion / buni-callout
          const config = EMOTION_CONFIG[msg.character!];
          const isBuniCallout = msg.type === 'buni-callout';
          return (
            <div key={i} className="rounded-2xl p-3 mb-2"
              style={{
                background: isBuniCallout
                  ? `rgba(201,96,122,0.08)`
                  : 'rgba(255,255,255,0.7)',
                border: isBuniCallout
                  ? '1px solid rgba(201,96,122,0.2)'
                  : '1px solid var(--border-subtle)',
                boxShadow: '0 1px 6px rgba(180,120,140,0.06)',
              }}>
              <div className="flex items-center gap-2 mb-1">
                <span>{config.emoji}</span>
                <span className="text-xs font-medium" style={{ color: config.color }}>
                  {config.name}
                  {msg.isPlayer && <span className="ml-1" style={{ color: 'var(--text-muted)' }}>(나)</span>}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', fontWeight: 300 }}>
                {msg.text}
              </p>
            </div>
          );
        })}

        {/* 타이핑 인디케이터 */}
        {isAddingMessages && (
          <div className="flex gap-1 px-3 py-2 mb-2">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-pulse-soft"
                style={{ background: 'var(--accent-pink)', animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        )}

        {/* 플레이어 입력창 */}
        {showInput && (
          <div className="mt-4 card-soft p-3">
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              {EMOTION_CONFIG[player.emotion].emoji} {player.name}의 생각은?
            </p>
            <textarea
              value={playerInputText}
              onChange={e => setPlayerInputText(e.target.value)}
              placeholder="지금 내 마음을 써봐..."
              rows={2}
              className="w-full text-sm resize-none outline-none"
              style={{
                background: 'transparent',
                color: 'var(--text-primary)',
                fontFamily: 'Noto Sans KR, sans-serif',
                fontWeight: 300,
                border: 'none',
              }}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handlePlayerSubmit}
                disabled={!playerInputText.trim()}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: playerInputText.trim() ? 'rgba(201,96,122,0.15)' : 'transparent',
                  border: '1px solid rgba(201,96,122,0.3)',
                  color: playerInputText.trim() ? 'var(--accent-warm)' : 'var(--text-muted)',
                  cursor: playerInputText.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                보내기 →
              </button>
            </div>
          </div>
        )}

        {/* 선택지 */}
        {showChoices && currentChoices.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-center mb-3" style={{ color: 'var(--text-muted)' }}>
              어떻게 할까?
            </p>
            {currentChoices.map((choice, i) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice.id)}
                className="choice-btn opacity-0 animate-fadeIn"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
              >
                <div className="font-medium text-sm">{choice.text}</div>
                {'subtext' in choice && choice.subtext && (
                  <div className="text-xs mt-1 italic" style={{ color: 'var(--text-muted)' }}>
                    {choice.subtext}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} className="h-10" />
      </div>
    </div>
  );
}
