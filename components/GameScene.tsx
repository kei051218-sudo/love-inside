'use client';

import { useState, useEffect } from 'react';
import { PlayerInfo, EmotionCharacter, EMOTION_CONFIG } from '@/types/game';

interface EmotionLine { character: EmotionCharacter; text: string; }
interface ChoiceOption { id: string; text: string; sub?: string; }

// ── 전체 감정 대사 (5개) ─────────────────────────────
const ALL_LINES: Record<number, EmotionLine[]> = {
  1: [
    { character: 'buni',   text: '사과? 내가? 야, 내가 왜 사과해. 신호 보냈잖아. 근데 못 알아챈 거잖아. 오히려 걔가 먼저 미안하다고 해야 하는 거 아니야?' },
    { character: 'seorup', text: '...1주년이 이렇게 되어버리다니, 난 다른 것보다 그게 너무 속상해.' },
    { character: 'dukeun', text: '일단 미안하다고 하자. 그래야 얘기가 풀리잖아. 오늘 이대로 끝내기 싫어. 보고 싶단 말이야.' },
    { character: 'honmi',  text: '근데 내가 먼저 사과하면 내가 잘못한 게 되는 건가? 사과는 내가 받아야 하는 거 아냐? 근데 또 말없이 간 건 좀 그런 거 같기도 하고... 모르겠어 진짜.' },
    { character: 'dodo',   text: '절대 먼저 사과하지 마. 네가 먼저 사과하는 순간 이 대화의 주도권은 걔한테 넘어가는 거야.' },
  ],
  2: [
    { character: 'buni',   text: '아니 근데 솔직히 새우가 문제가 아니잖아. 오늘 내 친구가 그렇게 차려입고 나온 거 봤잖아. 우린 커플티 입고 갔는데.' },
    { character: 'seorup', text: '매번 이래. 화나도 말 못하고 혼자 삭히다가 결국 이렇게 터지는 거잖아. 나 사실 오늘만의 얘기가 아니야.' },
    { character: 'dukeun', text: '근데 있잖아... 우리 연인이 모두에게 다정한 사람이라서 좋아했던 거잖아. 그게 갑자기 나쁜 게 되는 건 아니잖아.' },
    { character: 'honmi',  text: '나 지금 걔가 밉냐고 하면... 밉지는 않아. 근데 이 기분은 뭐지. 내가 너무 예민한 건가. 아니면 당연히 화낼 수 있는 건가.' },
    { character: 'dodo',   text: '똑바로 물어봐. 그 친구 눈에 들어왔냐고. 빙빙 돌리지 말고.' },
  ],
  3: [
    { character: 'buni',   text: '지금 온다고? 나 아직 화 안 풀렸는데. 만나면 더 싸울 것 같은데.' },
    { character: 'seorup', text: '...보고 싶긴 해. 근데 이 눈 보여주기 싫어. 너무 울었잖아.' },
    { character: 'dukeun', text: '와. 와줘. 지금 당장. 목소리 듣는 것보다 얼굴 보고 싶어.' },
    { character: 'honmi',  text: '만나면 좋아질까. 아니면 더 싸울까. 만나야 할지 말아야 할지 모르겠어.' },
    { character: 'dodo',   text: '오고 싶으면 오라고 해. 근데 네가 먼저 열어준다고 하지 마. 기다려.' },
  ],
  41: [
    { character: 'buni',   text: '집 앞까지 왔어? 빠르네. 근데 내가 나가면 내가 더 보고 싶었던 거 티 나는 거 아냐?' },
    { character: 'seorup', text: '집 앞까지 달려왔구나... 그 마음은 알겠어. 근데 아직 눈이 부어있는데.' },
    { character: 'dukeun', text: '나가. 빨리. 보고 싶잖아. 지금 이 순간이 중요한 거야.' },
    { character: 'honmi',  text: '나가는 게 맞나, 들어오라고 하는 게 맞나. 뭐가 더 자연스럽지.' },
    { character: 'dodo',   text: '들어오라고 해. 네가 나가면 네가 더 약한 거야. 기다려.' },
  ],
  42: [
    { character: 'buni',   text: '막상 보니까 할 말이 없어? 아까 그 많던 말은 다 어디 갔어.' },
    { character: 'seorup', text: '...보는 순간 눈물 나올 것 같아. 참아. 제발.' },
    { character: 'dukeun', text: '말 안 해도 돼. 그냥 안아줘. 그게 다야.' },
    { character: 'honmi',  text: '뭐라고 해야 하지. 미안해? 보고 싶었어? 아직 화나?' },
    { character: 'dodo',   text: '먼저 말하지 마. 걔가 먼저 말하게 해.' },
  ],
};

// 플레이어 감정별 기본 대사 (phase별)
const MY_LINES: Record<EmotionCharacter, string[]> = {
  buni:   [
    '사과? 내가? 내가 왜 사과해. 신호 보냈잖아.',
    '솔직히 새우가 문제가 아니잖아. 우린 커플티 입고 갔는데.',
    '아직 화 안 풀렸는데. 만나면 더 싸울 것 같아.',
    '내가 나가면 더 보고 싶었던 거 티 나잖아.',
    '막상 보니까 할 말이 없어? 아까 그 많던 말은?',
  ],
  seorup: [
    '...1주년이 이렇게 됐어. 다른 것보다 그게 너무 속상해.',
    '매번 이래. 나 사실 오늘만의 얘기가 아니야.',
    '보고 싶긴 해. 근데 이 눈 보여주기 싫어.',
    '집 앞까지 달려왔구나... 그 마음은 알겠어.',
    '...보는 순간 눈물 나올 것 같아. 참아.',
  ],
  dukeun: [
    '일단 미안하다고 하자. 오늘 이대로 끝내기 싫어. 보고 싶어.',
    '우리 연인이 모두에게 다정한 사람이라서 좋아했던 거잖아.',
    '와줘. 지금 당장 보고 싶어.',
    '나가. 빨리. 지금 이 순간이 중요한 거야.',
    '말 안 해도 돼. 그냥 안아줘.',
  ],
  honmi:  [
    '내가 먼저 사과하면 내가 잘못한 게 되는 건가... 모르겠어.',
    '내가 너무 예민한 건가. 아니면 당연히 화낼 수 있는 건가.',
    '만나면 좋아질까. 만나야 할지 말아야 할지 모르겠어.',
    '나가는 게 맞나, 들어오라고 하는 게 맞나.',
    '뭐라고 해야 하지.',
  ],
  dodo:   [
    '절대 먼저 사과하지 마. 주도권 내주지 마.',
    '똑바로 물어봐. 그 친구 눈에 들어왔냐고.',
    '오고 싶으면 오라고 해. 네가 먼저 나가지 마.',
    '들어오라고 해. 네가 나가면 약한 거야.',
    '먼저 말하지 마. 걔가 먼저 말하게 해.',
  ],
};

const CALLOUTS: Record<number, string> = {
  1: '네 생각은 어때?',
  2: '네 생각은 어때? 그냥 넘어갈 거야, 오늘 다 얘기할 거야?',
  3: '어떻게 할 거야? 오라고 할 거야, 말 거야?',
  41: '어떻게 할 거야?',
  42: '뭐라고 할 거야?',
};

const CHOICES: Record<number, ChoiceOption[]> = {
  1: [
    { id: 'apologize',   text: '차분하게 사과하며 이유를 설명한다', sub: '"말없이 가버려서 미안해. 근데 나 오늘 많이 속상했어."' },
    { id: 'short-sorry', text: '가버린 것만 짧게 사과한다', sub: '"그렇게 가버린 건 미안해. 근데 할 말은 있어."' },
    { id: 'confront',    text: '다짜고짜 묻는다', sub: '"어떻게 그럴 수가 있어?"' },
    { id: 'vent',        text: '쌓인 감정을 토로한다', sub: '"굳이 내 친구한테까지 새우에 한라봉까지 까줄 필요가 있어?"' },
    { id: 'silent',      text: '아무 말 않고 듣는다' },
  ],
  2: [
    { id: 'vent-all',    text: '쌓인 감정을 털어놓는다', sub: '"사실 오늘만의 얘기가 아니야. 항상 나한테만 친절했으면 좋겠다고 했잖아."' },
    { id: 'ask-direct',  text: '직접 묻는다', sub: '"솔직히 얘기해봐. 오늘 내 친구가 예뻐보여서 더 그랬던 거 아냐?"' },
    { id: 'ask-indirect',text: '돌려서 묻는다', sub: '"우리 기념일인데 자기가 더 꾸미고 오냐구."' },
    { id: 'give-up',     text: '오늘은 더 이상 얘기하지 않는다', sub: '"됐어. 오늘은 그냥 자자."' },
  ],
  3: [
    { id: 'meet',       text: '만난다', sub: '"...와. 근데 올 거면 빨리 와."' },
    { id: 'no-meet',    text: '오늘은 만나지 않는다', sub: '"오늘은 그냥 자. 내일 얘기하자."' },
    { id: 'let-decide', text: '연인한테 결정을 맡긴다', sub: '"모르겠어. 네가 결정해."' },
  ],
  41: [
    { id: 'go-out', text: '나가서 맞이한다' },
    { id: 'let-in', text: '들어오라고 한다' },
  ],
  42: [
    { id: 'sorry',       text: '"미안해."' },
    { id: 'miss',        text: '"보고 싶었어."' },
    { id: 'still-angry', text: '"아직 화 안 풀렸어."' },
    { id: 'hug',         text: '말없이 안긴다' },
  ],
};

const B_RESPONSES: Record<string, string> = {
  'apologize':    '자기야... 미안해. 나도 많이 걱정했어. 어떤 게 그렇게 속상했는지 얘기해줘.',
  'short-sorry':  '응, 나도 미안해. 갑자기 왜 간 건지 이유는 알고 싶어.',
  'confront':     '응? 자기야, 정말 미안해. 왜 화났는지 얘기해주면 안 될까?',
  'vent':         '난 자기를 위해서 그런 거였어. 자기 친구들이니까 배려한 거지 다른 뜻은 없었어.',
  'silent':       '자기야, 지금 어디야? 왜 그렇게 가버린 거야. 걱정되잖아.',
  'vent-all':     '...자기야. 그게 그렇게 힘들었어? 나 진짜 몰랐어. 미안해.',
  'ask-direct':   '...눈에 들어오긴 했어. 근데 그게 다야. 진짜로. 마음이 흔들린 건 아니야. 자기 옆에 있으면서 딴 마음 품은 적 없어.',
  'ask-indirect': '으응? 난 우리 자기밖에 눈에 안 들어와서 친구들은 뭐 입고 왔는지 기억도 안 나는데.',
  'give-up':      '자기야, 우리 이러지 않기로 했잖아. 오늘 감정은 오늘 풀기로 약속했었잖아.',
  'meet':         '알았어. 금방 갈게. 문 앞에서 전화할게.',
  'no-meet':      '...그래. 알았어. 잘 자, 자기야.',
  'let-decide':   '...나 갈게. 보고 싶어, 자기.',
  'go-out':       '...왔어.',
  'let-in':       '들어가도 돼?',
  'sorry':        '나도 미안해. 자기야.',
  'miss':         '나도. 엄청.',
  'still-angry':  '...그래. 알아. 근데 나 왔잖아.',
  'hug':          '말없이 안아준다. 한참 동안.',
  'free':         '...응. 알아. 나도 생각해볼게.',
};

// ── 메인 ────────────────────────────────────────────
interface Props { player: PlayerInfo; onEnding: (type: 'happy' | 'breakup' | 'undecided') => void; }

export default function GameScene({ player, onEnding }: Props) {
  const [phaseKey, setPhaseKey] = useState<number>(1); // 1,2,3,41,42
  const [visibleCount, setVisibleCount] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [bSaying, setBSaying] = useState<string | null>(null);
  const [bNext, setBNext] = useState<(() => void) | null>(null);

  const cfg = EMOTION_CONFIG[player.emotion];
  const myEmotion = player.emotion;

  // 현재 phase에서 내 감정 제외한 라인
  const getLines = (key: number): EmotionLine[] =>
    (ALL_LINES[key] || []).filter(l => l.character !== myEmotion);

  const getMyLineIdx = (key: number) => {
    if (key === 1) return 0;
    if (key === 2) return 1;
    if (key === 3) return 2;
    if (key === 41) return 3;
    return 4;
  };

  // 화면 진입 시 순차 표시
  useEffect(() => {
    setVisibleCount(0);
    setShowInput(false);
    setFreeText('');
    const lines = getLines(phaseKey);
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), (i + 1) * 700));
    });
    timers.push(setTimeout(() => {
      setVisibleCount(lines.length + 1);
      setTimeout(() => setShowInput(true), 400);
    }, (lines.length + 1) * 700));
    return () => timers.forEach(clearTimeout);
  }, [phaseKey]);

  const showB = (text: string, next: () => void) => {
    setBSaying(text);
    setBNext(() => next);
  };

  const goNext = (choiceId: string) => {
    setShowInput(false);
    const bText = B_RESPONSES[choiceId] || '...';

    if (phaseKey === 1) {
      showB(bText, () => { setBSaying(null); setPhaseKey(2); });
    } else if (phaseKey === 2) {
      if (choiceId === 'give-up') {
        showB(bText, () => { setBSaying(null); onEnding('undecided'); }); return;
      }
      showB(`${bText}\n\n자기야... 나 지금 보고 싶어. 가도 돼?`, () => { setBSaying(null); setPhaseKey(3); });
    } else if (phaseKey === 3) {
      if (choiceId === 'no-meet') {
        showB(bText, () => { setBSaying(null); onEnding('undecided'); }); return;
      }
      showB(bText, () => {
        setBSaying(null);
        setTimeout(() => showB('나 집 앞에 도착했어.', () => { setBSaying(null); setPhaseKey(41); }), 300);
      });
    } else if (phaseKey === 41) {
      showB(bText, () => { setBSaying(null); setPhaseKey(42); });
    } else if (phaseKey === 42) {
      const isHappy = ['sorry', 'miss', 'hug'].includes(choiceId);
      showB(bText, () => { setBSaying(null); onEnding(isHappy ? 'happy' : 'breakup'); });
    }
  };

  const handleFree = () => {
    if (!freeText.trim()) return;
    setFreeText('');
    setShowInput(false);
    showB(B_RESPONSES['free'], () => {
      setBSaying(null);
      if (phaseKey === 1) setPhaseKey(2);
      else if (phaseKey === 2) {
        showB(`${B_RESPONSES['free']}\n\n자기야... 나 지금 보고 싶어. 가도 돼?`, () => { setBSaying(null); setPhaseKey(3); });
      }
    });
  };

  // B 반응 화면
  if (bSaying !== null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FDF6F0' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 32px' }}>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#B08090', marginBottom: '12px', letterSpacing: '0.1em' }}>
            {player.partnerName}
          </p>
          <div style={{
            background: 'white', border: '1px solid rgba(201,96,122,0.15)',
            borderRadius: '20px', padding: '28px 24px',
            boxShadow: '0 4px 24px rgba(180,120,140,0.1)',
          }}>
            {bSaying.split('\n').map((line, i) => (
              <p key={i} style={{
                fontFamily: 'Noto Serif KR, serif', fontSize: '15px',
                color: '#2C1810', lineHeight: 1.9, margin: line === '' ? '8px 0' : '0',
              }}>
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>
        <div style={{ padding: '0 32px 48px' }}>
          <button onClick={() => bNext && bNext()} style={{
            width: '100%', padding: '18px', borderRadius: '16px',
            background: 'rgba(201,96,122,0.12)', border: '1px solid rgba(201,96,122,0.3)',
            color: '#C9607A', fontFamily: 'Noto Serif KR, serif', fontSize: '15px', cursor: 'pointer',
          }}>확인 →</button>
        </div>
      </div>
    );
  }

  // 감정 화면
  const lines = getLines(phaseKey);
  const choices = CHOICES[phaseKey] || [];
  const myLineIdx = getMyLineIdx(phaseKey);
  const myDefaultLine = MY_LINES[myEmotion][myLineIdx];
  const callout = CALLOUTS[phaseKey] || '네 생각은 어때?';
  const phaseLabel = { 1: '첫 번째 감정', 2: '두 번째 감정', 3: '만날까?', 41: '집 앞 도착', 42: '마주섰을 때' }[phaseKey] || '';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FDF6F0' }}>
      {/* 헤더 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(253,246,240,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,96,122,0.1)',
        padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <p style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '13px', color: '#C9607A', margin: 0 }}>💕 LOVE INSIDE</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{cfg.emoji}</span>
          <span style={{ fontSize: '11px', color: '#B08090' }}>{phaseLabel}</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 16px 0', maxWidth: '420px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>

        {/* 다른 감정 4개 */}
        {lines.slice(0, visibleCount).map((line, i) => {
          const ec = EMOTION_CONFIG[line.character];
          return (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(201,96,122,0.1)',
              borderRadius: '16px', padding: '14px 16px', marginBottom: '10px',
              boxShadow: '0 1px 6px rgba(180,120,140,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '15px' }}>{ec.emoji}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: ec.color }}>{ec.name}</span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.75, color: '#2C1810', fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 300, margin: 0 }}>
                {line.text}
              </p>
            </div>
          );
        })}

        {/* 내 감정 callout */}
        {visibleCount > lines.length && (
          <div style={{
            background: `${cfg.color}12`, border: `1px solid ${cfg.color}35`,
            borderRadius: '16px', padding: '14px 16px', marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span>{cfg.emoji}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: cfg.color }}>{cfg.name}</span>
              <span style={{ fontSize: '10px', color: cfg.color, background: `${cfg.color}25`, padding: '1px 7px', borderRadius: '8px' }}>나</span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.75, color: '#2C1810', fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 300, margin: 0 }}>
              {callout}
            </p>
          </div>
        )}

        {/* 입력 영역 */}
        {showInput && (
          <div>
            {/* 자유 입력 */}
            <div style={{
              background: 'white', border: `1px solid ${cfg.color}30`,
              borderRadius: '16px', padding: '16px', marginBottom: '12px',
            }}>
              <p style={{ fontSize: '11px', color: '#B08090', margin: '0 0 8px' }}>
                {cfg.emoji} {cfg.name}(나)의 말은?
              </p>
              <textarea value={freeText} onChange={e => setFreeText(e.target.value)}
                placeholder="지금 내 마음을 직접 써봐..." rows={2}
                style={{
                  width: '100%', background: 'transparent', border: 'none', outline: 'none',
                  resize: 'none', fontSize: '14px', color: '#2C1810',
                  fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 300, boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleFree} disabled={!freeText.trim()} style={{
                  padding: '8px 16px', borderRadius: '10px', fontSize: '12px',
                  background: freeText.trim() ? `${cfg.color}20` : 'transparent',
                  border: `1px solid ${cfg.color}40`,
                  color: freeText.trim() ? cfg.color : '#B08090',
                  cursor: freeText.trim() ? 'pointer' : 'not-allowed',
                }}>보내기 →</button>
              </div>
            </div>

            {/* 내 감정 기본 대사 */}
            <button onClick={() => goNext(choices[0]?.id)} style={{
              width: '100%', background: `${cfg.color}10`,
              border: `1px solid ${cfg.color}30`, borderRadius: '14px',
              padding: '14px 16px', marginBottom: '10px', textAlign: 'left', cursor: 'pointer', display: 'block',
            }}>
              <div style={{ fontSize: '11px', color: cfg.color, marginBottom: '4px' }}>
                {cfg.emoji} {cfg.name}이라면...
              </div>
              <div style={{ fontSize: '13px', color: '#2C1810', fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 300, fontStyle: 'italic' }}>
                "{myDefaultLine}"
              </div>
            </button>

            {/* 구분선 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(201,96,122,0.15)' }} />
              <span style={{ fontSize: '11px', color: '#B08090' }}>다른 선택지</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(201,96,122,0.15)' }} />
            </div>

            {/* 나머지 선택지 */}
            {choices.map((c, i) => (
              <button key={c.id} onClick={() => goNext(c.id)} style={{
                width: '100%', background: 'rgba(255,255,255,0.88)',
                border: '1px solid rgba(201,96,122,0.12)', borderRadius: '14px',
                padding: '14px 16px', marginBottom: '8px', textAlign: 'left', cursor: 'pointer', display: 'block',
              }}>
                <div style={{ fontSize: '13px', color: '#2C1810', fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 400 }}>{c.text}</div>
                {c.sub && <div style={{ fontSize: '12px', color: '#B08090', marginTop: '4px', fontStyle: 'italic' }}>{c.sub}</div>}
              </button>
            ))}
            <div style={{ height: '40px' }} />
          </div>
        )}
      </div>
    </div>
  );
}
