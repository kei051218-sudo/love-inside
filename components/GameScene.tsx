'use client';

import { useState, useEffect } from 'react';
import { PlayerInfo, EmotionCharacter, EMOTION_CONFIG } from '@/types/game';

interface EmotionLine { character: EmotionCharacter; text: string; }
interface ChoiceOption { id: string; text: string; sub?: string; }

// ── 스크립트 ─────────────────────────────────────────
// 각 분기마다 1턴(감정표현)과 2턴(행동선택) 대사 + 선택지

const SCRIPT: Record<string, {
  turn1: { lines: EmotionLine[]; myLine: Record<EmotionCharacter, string>; choices: ChoiceOption[] };
  turn2: { lines: EmotionLine[]; myLine: Record<EmotionCharacter, string>; choices: ChoiceOption[] };
}> = {

  // ── 1분기: 전화 첫 마디 ──────────────────────────
  phase1: {
    turn1: {
      lines: [
        { character: 'buni',   text: '사과? 내가? 야, 내가 왜 사과해. 신호 보냈잖아. 근데 못 알아챈 거잖아. 오히려 걔가 먼저 미안하다고 해야 하는 거 아니야?' },
        { character: 'seorup', text: '...1주년이 이렇게 되어버리다니, 난 다른 것보다 그게 너무 속상해.' },
        { character: 'honmi',  text: '근데 내가 먼저 사과하면 내가 잘못한 게 되는 건가? 사과는 내가 받아야 하는 거 아냐? 근데 또 말없이 간 건 좀 그런 거 같기도 하고... 모르겠어 진짜.' },
        { character: 'dodo',   text: '절대 먼저 사과하지 마. 네가 먼저 사과하는 순간 이 대화의 주도권은 걔한테 넘어가는 거야.' },
        { character: 'dukeun', text: '일단 미안하다고 하자. 그래야 얘기가 풀리잖아. 오늘 이대로 끝내기 싫어. 보고 싶단 말이야.' },
      ],
      myLine: {
        buni:   '억울해. 내가 왜 먼저 사과해야 해.',
        seorup: '...1주년인데. 이렇게 됐어.',
        dukeun: '보고 싶어. 오늘 이대로 끝내기 싫어.',
        honmi:  '모르겠어. 내가 잘못한 건지 걔가 잘못한 건지.',
        dodo:   '주도권 안 내줘. 내가 먼저 사과 안 해.',
      },
      choices: [
        { id: 'feel-angry',  text: '화가 난다', sub: '억울하고 이해가 안 돼' },
        { id: 'feel-sad',    text: '서럽다', sub: '1주년인데 이렇게 됐어' },
        { id: 'feel-miss',   text: '보고 싶다', sub: '오늘 이대로 끝내기 싫어' },
        { id: 'feel-confused', text: '모르겠다', sub: '내 감정이 뭔지 모르겠어' },
        { id: 'feel-cold',   text: '기다린다', sub: '먼저 연락 안 해' },
      ],
    },
    turn2: {
      lines: [
        { character: 'buni',   text: '맞받아쳐. 바로 가. 뭘 잘못했는지 스스로 말하게 해봐.' },
        { character: 'seorup', text: '근데 이러면 더 감정적으로 흘러갈 것 같은데...' },
        { character: 'honmi',  text: '이게 맞는 건지 모르겠는데 일단 말은 나왔어.' },
        { character: 'dodo',   text: '좋아. 뭘 잘못했는지 스스로 말하게 해봐.' },
        { character: 'dukeun', text: '일단 미안하다고 하자. 그래야 얘기가 풀리잖아. 보고 싶단 말이야.' },
      ],
      myLine: {
        buni:   '"어떻게 그럴 수가 있어?"',
        seorup: '"말없이 가버려서 미안해. 근데 나 오늘 많이 속상했어."',
        dukeun: '"일단 미안해. 근데 나 오늘 많이 속상했어. 보고 싶어."',
        honmi:  '"그렇게 가버린 건 미안해. 근데 할 말은 있어."',
        dodo:   '"..."  (아무 말 않고 듣는다)',
      },
      choices: [
        { id: 'apologize',    text: '차분하게 사과하며 이유를 설명한다', sub: '"말없이 가버려서 미안해. 근데 나 오늘 많이 속상했어."' },
        { id: 'short-sorry',  text: '가버린 것만 짧게 사과한다', sub: '"그렇게 가버린 건 미안해. 근데 할 말은 있어."' },
        { id: 'confront',     text: '다짜고짜 묻는다', sub: '"어떻게 그럴 수가 있어?"' },
        { id: 'vent',         text: '쌓인 감정을 토로한다', sub: '"굳이 내 친구한테까지 새우에 한라봉까지 까줄 필요가 있어?"' },
        { id: 'silent',       text: '아무 말 않고 듣는다' },
      ],
    },
  },

  // ── 2분기: 쌓인 감정 + 핵심 ──────────────────────
  phase2: {
    turn1: {
      lines: [
        { character: 'buni',   text: '아니 근데 솔직히 새우가 문제가 아니잖아. 오늘 내 친구가 그렇게 차려입고 나온 거 봤잖아. 우린 커플티 입고 갔는데.' },
        { character: 'seorup', text: '매번 이래. 화나도 말 못하고 혼자 삭히다가 결국 이렇게 터지는 거잖아. 나 사실 오늘만의 얘기가 아니야.' },
        { character: 'honmi',  text: '나 지금 걔가 밉냐고 하면... 밉지는 않아. 근데 이 기분은 뭐지. 내가 너무 예민한 건가. 아니면 당연히 화낼 수 있는 건가.' },
        { character: 'dodo',   text: '똑바로 물어봐. 그 친구 눈에 들어왔냐고. 빙빙 돌리지 말고.' },
        { character: 'dukeun', text: '근데 있잖아... 우리 연인이 모두에게 다정한 사람이라서 좋아했던 거잖아. 그게 갑자기 나쁜 게 되는 건 아니잖아.' },
      ],
      myLine: {
        buni:   '오늘 내 친구가 더 꾸미고 온 것도 마음에 안 들었어.',
        seorup: '사실 오늘만의 얘기가 아니야.',
        dukeun: '다정한 사람이라서 좋아했던 건데... 그게 갑자기 나쁜 게 됐어.',
        honmi:  '내가 너무 예민한 건가. 이 기분이 뭔지 모르겠어.',
        dodo:   '빙빙 돌리지 말고 직접 물어봐야 해.',
      },
      choices: [
        { id: 'feel2-betrayed', text: '배신감이 든다', sub: '나한테만 친절했으면 좋겠어' },
        { id: 'feel2-tired',    text: '지친다', sub: '매번 이렇게 혼자 삭혀왔어' },
        { id: 'feel2-confused', text: '헷갈린다', sub: '걔가 나쁜 건지 내가 예민한 건지' },
        { id: 'feel2-curious',  text: '궁금하다', sub: '그 친구가 눈에 들어왔던 건지 직접 묻고 싶어' },
      ],
    },
    turn2: {
      lines: [
        { character: 'buni',   text: '야 그냥 다 털어놔. 참으면 걔는 모르잖아.' },
        { character: 'seorup', text: '말하면 더 싸울 것 같긴 한데... 안 말하면 또 혼자 삭히는 거잖아.' },
        { character: 'honmi',  text: '직접 물었다가 대답이 별로면... 근데 안 물어보면 계속 찜찜할 것 같고.' },
        { character: 'dodo',   text: '직접 물어. 눈에 들어왔냐고. 듣기 싫어도 알아야 해.' },
        { character: 'dukeun', text: '사실 오늘만의 얘기가 아닌 것 같아. 그냥 다 말해봐.' },
      ],
      myLine: {
        buni:   '"굳이 내 친구한테까지 그렇게 잘해줄 필요 있어?"',
        seorup: '"사실 오늘만의 얘기가 아니야."',
        dukeun: '"모두에게 다정해서 좋았는데... 오늘은 좀 달랐어."',
        honmi:  '"솔직히 얘기해봐. 오늘 내 친구가 눈에 들어온 거야?"',
        dodo:   '"그 친구, 눈에 들어왔어?"',
      },
      choices: [
        { id: 'vent-all',     text: '쌓인 감정을 털어놓는다', sub: '"사실 오늘만의 얘기가 아니야. 항상 나한테만 친절했으면 좋겠다고 했잖아."' },
        { id: 'ask-direct',   text: '직접 묻는다', sub: '"솔직히 얘기해봐. 오늘 내 친구가 눈에 들어온 거야?"' },
        { id: 'ask-indirect', text: '돌려서 묻는다', sub: '"우리 기념일인데 자기가 더 꾸미고 오냐구."' },
        { id: 'give-up',      text: '오늘은 더 이상 얘기하지 않는다', sub: '"됐어. 오늘은 그냥 자자."' },
      ],
    },
  },

  // ── 3분기: 만날까 말까 ───────────────────────────
  phase3: {
    turn1: {
      lines: [
        { character: 'buni',   text: '지금 온다고? 나 아직 화 안 풀렸는데. 만나면 더 싸울 것 같은데.' },
        { character: 'seorup', text: '...보고 싶긴 해. 근데 이 눈 보여주기 싫어. 너무 울었잖아.' },
        { character: 'honmi',  text: '만나면 좋아질까. 아니면 더 싸울까. 만나야 할지 말아야 할지 모르겠어.' },
        { character: 'dodo',   text: '오고 싶으면 오라고 해. 근데 네가 먼저 열어준다고 하지 마. 기다려.' },
        { character: 'dukeun', text: '와. 와줘. 지금 당장. 목소리 듣는 것보다 얼굴 보고 싶어.' },
      ],
      myLine: {
        buni:   '아직 화 안 풀렸어. 만나면 더 싸울 것 같아.',
        seorup: '보고 싶긴 한데 이 눈 보여주기 싫어.',
        dukeun: '얼른 와줬으면 좋겠어.',
        honmi:  '만나면 좋아질지 더 싸울지 모르겠어.',
        dodo:   '오고 싶으면 오라고 해. 근데 내가 먼저 나가지는 않을 거야.',
      },
      choices: [
        { id: 'feel3-angry',   text: '화가 아직 안 풀렸다', sub: '만나면 더 싸울 것 같아' },
        { id: 'feel3-miss',    text: '그래도 보고 싶다', sub: '얼굴 보면 나아질 것 같아' },
        { id: 'feel3-tired',   text: '그냥 쉬고 싶다', sub: '오늘은 혼자 있고 싶어' },
        { id: 'feel3-unsure',  text: '모르겠다', sub: '만날지 말지 결정이 안 서' },
      ],
    },
    turn2: {
      lines: [
        { character: 'buni',   text: '그래도 오늘 다 끝내는 게 나아. 내일로 미루면 더 꼬여.' },
        { character: 'seorup', text: '오늘은 그냥 자는 게 나을 수도 있어. 지쳤잖아.' },
        { character: 'honmi',  text: '만나자고 하면 내가 더 보고 싶었던 거 티 나는 건가...' },
        { character: 'dodo',   text: '걔가 결정하게 해. 오고 싶으면 오겠지.' },
        { character: 'dukeun', text: '만나. 오늘 안 만나면 더 어색해질 거야.' },
      ],
      myLine: {
        buni:   '"...와. 근데 올 거면 빨리 와."',
        seorup: '"오늘은 그냥 자. 내일 얘기하자."',
        dukeun: '"와줘."',
        honmi:  '"...모르겠어. 네가 결정해."',
        dodo:   '"네가 결정해."',
      },
      choices: [
        { id: 'meet',       text: '만난다', sub: '"...와. 근데 올 거면 빨리 와."' },
        { id: 'no-meet',    text: '오늘은 만나지 않는다', sub: '"오늘은 그냥 자. 내일 얘기하자."' },
        { id: 'let-decide', text: '연인한테 결정을 맡긴다', sub: '"모르겠어. 네가 결정해."' },
      ],
    },
  },

  // ── 4분기: 집 앞 ─────────────────────────────────
  phase4: {
    turn1: {
      lines: [
        { character: 'buni',   text: '집 앞까지 왔어? 빠르네. 근데 내가 나가면 내가 더 보고 싶었던 거 티 나는 거 아냐?' },
        { character: 'seorup', text: '집 앞까지 달려왔구나... 그 마음은 알겠어. 근데 아직 눈이 부어있는데.' },
        { character: 'honmi',  text: '나가는 게 맞나, 들어오라고 하는 게 맞나. 뭐가 더 자연스럽지.' },
        { character: 'dodo',   text: '들어오라고 해. 네가 나가면 네가 더 약한 거야. 기다려.' },
        { character: 'dukeun', text: '나가. 빨리. 보고 싶잖아. 지금 이 순간이 중요한 거야.' },
      ],
      myLine: {
        buni:   '내가 나가면 더 보고 싶었던 거 티 나잖아.',
        seorup: '집 앞까지 왔구나... 근데 눈이 아직 부어.',
        dukeun: '빨리 나가고 싶어. 보고 싶잖아.',
        honmi:  '나가는 게 맞나, 들어오라고 하는 게 맞나.',
        dodo:   '들어오라고 해. 내가 나가면 약해 보여.',
      },
      choices: [
        { id: 'feel4-proud',  text: '자존심이 걸린다', sub: '내가 먼저 나가면 지는 것 같아' },
        { id: 'feel4-miss',   text: '빨리 보고 싶다', sub: '그냥 나가고 싶어' },
        { id: 'feel4-unsure', text: '어색할 것 같다', sub: '막상 보면 뭐라고 해야 할지 모르겠어' },
        { id: 'feel4-wait',   text: '기다리고 싶다', sub: '걔가 먼저 말하게 할 거야' },
      ],
    },
    turn2: {
      lines: [
        { character: 'buni',   text: '자존심 버려. 지금 그게 중요한 게 아니잖아.' },
        { character: 'seorup', text: '막상 나가면 눈물 나올 것 같아. 들어오라고 하는 게 나을 수도.' },
        { character: 'honmi',  text: '어차피 만날 거잖아. 나가든 들어오라고 하든 큰 차이 없지 않아?' },
        { character: 'dodo',   text: '들어오라고 해. 홈 어드밴티지야.' },
        { character: 'dukeun', text: '나가. 지금 당장. 보고 싶잖아.' },
      ],
      myLine: {
        buni:   '(나가서 맞이한다)',
        seorup: '"들어와."',
        dukeun: '(문을 열고 나간다)',
        honmi:  '"들어와도 돼."',
        dodo:   '"들어와."',
      },
      choices: [
        { id: 'go-out', text: '나가서 맞이한다' },
        { id: 'let-in', text: '들어오라고 한다' },
      ],
    },
  },

  // ── 5분기: 결말 ──────────────────────────────────
  phase5: {
    turn1: {
      lines: [
        { character: 'buni',   text: '막상 보니까 할 말이 없어? 아까 그 많던 말은 다 어디 갔어.' },
        { character: 'seorup', text: '...보는 순간 눈물 나올 것 같아. 참아. 제발.' },
        { character: 'honmi',  text: '뭐라고 해야 하지. 미안해? 보고 싶었어? 아직 화나?' },
        { character: 'dodo',   text: '먼저 말하지 마. 걔가 먼저 말하게 해.' },
        { character: 'dukeun', text: '말 안 해도 돼. 그냥 안아줘. 그게 다야.' },
      ],
      myLine: {
        buni:   '아까 그 많던 말이 다 사라진 것 같아.',
        seorup: '...보는 순간 눈물 나올 것 같아.',
        dukeun: '말 말고 그냥 안아줬으면 좋겠어.',
        honmi:  '뭐라고 해야 할지 모르겠어.',
        dodo:   '먼저 말 안 할 거야.',
      },
      choices: [
        { id: 'feel5-blank',  text: '할 말이 없어졌다', sub: '막상 보니까 아무 말도 안 나와' },
        { id: 'feel5-cry',    text: '울 것 같다', sub: '눈물이 나올 것 같아' },
        { id: 'feel5-hug',    text: '안기고 싶다', sub: '말보다 안아줬으면 좋겠어' },
        { id: 'feel5-wait',   text: '기다린다', sub: '걔가 먼저 말하게 할 거야' },
      ],
    },
    turn2: {
      lines: [
        { character: 'buni',   text: '지금 이 순간만큼은 화가 다 사그라드는 것 같아.' },
        { character: 'seorup', text: '그냥 미안하다고 해. 말이 길 필요 없어.' },
        { character: 'honmi',  text: '뭘 말해도 이상하게 들릴 것 같은데... 그냥 솔직하게 해.' },
        { character: 'dodo',   text: '침묵도 나쁘지 않아. 근데 뭔가 한 마디는 해야 할 것 같은데.' },
        { character: 'dukeun', text: '보고 싶었다고 해. 그게 다야.' },
      ],
      myLine: {
        buni:   '"미안해."',
        seorup: '"미안해."',
        dukeun: '"보고 싶었어."',
        honmi:  '"미안해."',
        dodo:   '(말없이 안긴다)',
      },
      choices: [
        { id: 'sorry',       text: '"미안해."' },
        { id: 'miss',        text: '"보고 싶었어."' },
        { id: 'still-angry', text: '"아직 화 안 풀렸어."' },
        { id: 'hug',         text: '말없이 안긴다' },
      ],
    },
  },
};

// B 반응
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

const PHASE_ORDER = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'];
const PHASE_LABELS: Record<string, string> = {
  phase1: '1분기', phase2: '2분기', phase3: '3분기', phase4: '4분기', phase5: '결말',
};

// ── 메인 ────────────────────────────────────────────
interface Props { player: PlayerInfo; onEnding: (type: 'happy' | 'breakup' | 'undecided') => void; }

type ScreenMode = 'turn1' | 'turn2' | 'my-line' | 'b-response';

export default function GameScene({ player, onEnding }: Props) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [mode, setMode] = useState<ScreenMode>('turn1');
  const [visibleCount, setVisibleCount] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [myLineText, setMyLineText] = useState('');
  const [bResponseText, setBResponseText] = useState('');

  const phaseKey = PHASE_ORDER[phaseIdx];
  const phase = SCRIPT[phaseKey];
  const cfg = EMOTION_CONFIG[player.emotion];
  const currentData = mode === 'turn1' ? phase.turn1 : phase.turn2;

  // 현재 데이터에서 내 감정 제외한 라인
  const lines = currentData.lines.filter(l => l.character !== player.emotion);

  // 화면 전환 시마다 순차 표시 리셋
  useEffect(() => {
    setVisibleCount(0);
    setShowInput(false);
    setFreeText('');
    if (mode !== 'turn1' && mode !== 'turn2') return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), (i + 1) * 650));
    });
    timers.push(setTimeout(() => {
      setVisibleCount(lines.length + 1);
      setTimeout(() => setShowInput(true), 300);
    }, (lines.length + 1) * 650));
    return () => timers.forEach(clearTimeout);
  }, [phaseIdx, mode]);

  // 1턴 선택 → 2턴으로
  const handleTurn1Choice = () => {
    setMode('turn2');
  };

  // 2턴 선택 → 내 대사 표시
  const handleTurn2Choice = (choiceId: string) => {
    // 특수 케이스: 엔딩 분기
    if (phaseKey === 'phase2' && choiceId === 'give-up') {
      const myText = phase.turn2.myLine[player.emotion];
      setMyLineText(myText);
      setBResponseText(B_RESPONSES['give-up']);
      setMode('my-line');
      return;
    }
    if (phaseKey === 'phase3' && choiceId === 'no-meet') {
      setMyLineText(phase.turn2.myLine[player.emotion]);
      setBResponseText(B_RESPONSES['no-meet']);
      setMode('my-line');
      return;
    }
    const myText = phase.turn2.myLine[player.emotion];
    const bText = B_RESPONSES[choiceId] || '...';
    // phase3 meet/let-decide → 도착 알림 추가
    if (phaseKey === 'phase3') {
      setMyLineText(myText);
      setBResponseText(`${bText}\n\n— 잠시 후 —\n\n나 집 앞에 도착했어.`);
    } else {
      setMyLineText(myText);
      setBResponseText(bText);
    }
    setMode('my-line');
  };

  const handleFree = () => {
    if (!freeText.trim()) return;
    if (mode === 'turn1') {
      handleTurn1Choice();
    } else {
      setMyLineText(freeText);
      setBResponseText(B_RESPONSES['free']);
      setMode('my-line');
    }
  };

  // 내 대사 확인 → B 반응으로
  const handleMyLineConfirm = () => {
    setMode('b-response');
  };

  // B 반응 확인 → 다음 분기 or 엔딩
  const handleBConfirm = () => {
    // 엔딩 판단
    if (phaseKey === 'phase2' && bResponseText.includes('약속했었잖아')) {
      onEnding('undecided'); return;
    }
    if (phaseKey === 'phase3' && bResponseText.includes('잘 자')) {
      onEnding('undecided'); return;
    }
    if (phaseKey === 'phase5') {
      const isHappy = myLineText.includes('미안') || myLineText.includes('보고 싶') || myLineText.includes('안긴다');
      onEnding(isHappy ? 'happy' : 'breakup'); return;
    }
    // 다음 분기
    if (phaseIdx < PHASE_ORDER.length - 1) {
      setPhaseIdx(p => p + 1);
      setMode('turn1');
    }
  };

  // ── 내 대사 화면 ──
  if (mode === 'my-line') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FDF6F0' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 32px' }}>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#B08090', marginBottom: '12px' }}>
            {cfg.emoji} {player.name}의 말
          </p>
          <div style={{
            background: `${cfg.color}12`, border: `1px solid ${cfg.color}35`,
            borderRadius: '20px', padding: '28px 24px',
            boxShadow: `0 4px 24px ${cfg.color}15`,
          }}>
            <p style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '16px', color: '#2C1810', lineHeight: 1.9, margin: 0 }}>
              {myLineText}
            </p>
          </div>
        </div>
        <div style={{ padding: '0 32px 48px' }}>
          <button onClick={handleMyLineConfirm} style={{
            width: '100%', padding: '18px', borderRadius: '16px',
            background: `${cfg.color}18`, border: `1px solid ${cfg.color}40`,
            color: cfg.color, fontFamily: 'Noto Serif KR, serif', fontSize: '15px', cursor: 'pointer',
          }}>확인 →</button>
        </div>
      </div>
    );
  }

  // ── B 반응 화면 ──
  if (mode === 'b-response') {
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
            {bResponseText.split('\n').map((line, i) => (
              <p key={i} style={{
                fontFamily: 'Noto Serif KR, serif', fontSize: '15px',
                color: line.startsWith('—') ? '#B08090' : '#2C1810',
                lineHeight: 1.9, margin: line === '' ? '8px 0' : '0',
                fontStyle: line.startsWith('—') ? 'italic' : 'normal',
              }}>
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>
        <div style={{ padding: '0 32px 48px' }}>
          <button onClick={handleBConfirm} style={{
            width: '100%', padding: '18px', borderRadius: '16px',
            background: 'rgba(201,96,122,0.12)', border: '1px solid rgba(201,96,122,0.3)',
            color: '#C9607A', fontFamily: 'Noto Serif KR, serif', fontSize: '15px', cursor: 'pointer',
          }}>확인 →</button>
        </div>
      </div>
    );
  }

  // ── 감정 화면 (1턴 / 2턴) ──
  const choices = currentData.choices;
  const myDefaultLine = currentData.myLine[player.emotion];
  const turnLabel = mode === 'turn1' ? '감정' : '행동';

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
          <span style={{ fontSize: '11px', color: '#B08090' }}>{PHASE_LABELS[phaseKey]} · {turnLabel}</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 16px 0', maxWidth: '420px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>

        {/* 감정 4개 */}
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
            <button onClick={() => mode === 'turn1' ? handleTurn1Choice() : handleTurn2Choice(choices[0]?.id)} style={{
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

            {/* 선택지 */}
            {choices.map(c => (
              <button key={c.id}
                onClick={() => mode === 'turn1' ? handleTurn1Choice() : handleTurn2Choice(c.id)}
                style={{
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
