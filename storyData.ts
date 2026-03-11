import { EmotionCharacter } from '@/types/game';

export interface EmotionLine {
  character: EmotionCharacter;
  text: string;
}

export interface StoryBeat {
  id: string;
  emotionLines: EmotionLine[];   // 1턴: 감정들 와글와글
  buniCallout: string;           // 분이가 플레이어한테 말 거는 대사
  playerPromptHint: string;      // 플레이어 입력 힌트
  choices: {
    id: string;
    text: string;
    nextBeat?: string;
    bResponse?: string;          // B의 반응
    emotionReactions?: Record<EmotionCharacter, string>; // 2턴 반응
  }[];
}

// ===== A편 여자 버전 =====

export const PROLOGUE_A_FEMALE = `제주에서의 저녁이었어.

딱새우 1등 맛집, 시끌벅적한 테이블.
딱새우 까는 소리, 웃음소리, 한라봉 향기.

그리고 그 사람.

오늘따라 유독 눈에 띄는 옷차림으로 나타난
연인의 친구.

나는 봤어.
내 사람이 그 사람의 새우를 까주는 걸.
그리고 한라봉까지.

눈이 마주쳤는데.
그냥 웃더라.

나는 아무 말 없이 자리를 떴어.`;

export const OPENING_CALL = [
  { speaker: 'B', text: '지금 어디야?' },
  { speaker: 'A', text: '집.' },
  { speaker: 'B', text: '아니, 어떻게 그렇게 그냥 가버릴 수가 있어.' },
];

// 와글와글 첫 등장
export const WAKEUP_EMOTIONS_A_FEMALE: EmotionLine[] = [
  { character: 'buni',   text: '사과? 내가? 야, 내가 왜 사과해. 신호 보냈잖아. 근데 못 알아챈 거잖아. 오히려 걔가 먼저 미안하다고 해야 하는 거 아니야?' },
  { character: 'seorup', text: '...1주년이 이렇게 되어버리다니, 난 다른 것보다 그게 너무 속상해 ㅜㅜ.' },
  { character: 'dukeun', text: '일단 미안하다고 하자. 그래야 얘기가 풀리잖아. 오늘 이대로 끝내기 싫어. 보고 싶단 말이야.' },
  { character: 'honmi',  text: '근데 내가 먼저 사과하면 내가 잘못한 게 되는 건가? 사과는 내가 받아야 하는 거 아냐? 근데 또 말없이 간 건 좀 그런 거 같기도 하고... 모르겠어 진짜.' },
  { character: 'dodo',   text: '절대 먼저 사과하지 마. 네가 먼저 사과하는 순간 이 대화의 주도권은 걔한테 넘어가는 거야.' },
];

export const BUNI_CALLOUT_1 = '야 @NAME@아, 네 생각은 어때?';

// 1분기: 어떤 말로 시작할까
export const PHASE1_CHOICES = [
  {
    id: 'apologize-explain',
    text: '차분하게 사과하며 이유를 설명한다',
    subtext: '"말없이 가버려서 미안해. 근데 나 오늘 많이 속상했어. 들어줄 수 있어?"',
    bResponse: '자기야... 미안해. 나도 많이 걱정했어. 어떤 게 그렇게 속상했는지 얘기해줘.',
    emotionReactions: {
      buni:   '그래도 먼저 사과했으면 이유도 확실히 말해야 해.',
      seorup: '이렇게 말하니까 목소리가 떨려. 근데 잘 했어.',
      dukeun: '잘했어! 이러면 대화가 돼.',
      honmi:  '이게 맞는 방식인가... 그래도 얘기는 되겠다.',
      dodo:   '사과는 했으니까. 이제 할 말 해.',
    }
  },
  {
    id: 'apologize-short',
    text: '가버린 것만 짧게 사과한다',
    subtext: '"그렇게 가버린 건 미안해. 근데 할 말은 있어."',
    bResponse: '응, 나도 미안해. 근데 갑자기 왜 그렇게 간 건지 이유는 알고 싶어.',
    emotionReactions: {
      buni:   '짧게 사과하고 바로 본론. 좋아.',
      seorup: '이 짧은 말 안에 얼마나 많은 게 담겨있는지.',
      dukeun: '오케이. 이제 얘기해보자.',
      honmi:  '할 말이 있다고 했는데... 뭐라고 하지.',
      dodo:   '적당해. 끌려가지 말고.',
    }
  },
  {
    id: 'confront',
    text: '다짜고짜 묻는다',
    subtext: '"어떻게 그럴 수가 있어?"',
    bResponse: '응? 자기야, 정말 미안해. 왜 화났는지 얘기해주면 안 될까?',
    emotionReactions: {
      buni:   '그렇지. 바로 가.',
      seorup: '근데 이러면 더 감정적으로 흘러갈 것 같은데...',
      dukeun: '조금 세게 나갔지만... 솔직한 거잖아.',
      honmi:  '이게 맞는 건지 모르겠는데 일단 말은 나왔어.',
      dodo:   '좋아. 뭘 잘못했는지 스스로 말하게 해봐.',
    }
  },
  {
    id: 'vent',
    text: '쌓인 감정을 토로한다',
    subtext: '"굳이 내 친구한테까지 새우에 한라봉까지 까줄 필요가 있어? 내가 항상 말하잖아, 나한테만 친절했으면 좋겠다고."',
    bResponse: '난 자기를 위해서 그런 거였어. 자기 친구들이니까 배려한 거지 다른 뜻은 없었어.',
    emotionReactions: {
      buni:   '드디어 본론이다. 잘했어.',
      seorup: '이 말 하면서 눈물 날 것 같아.',
      dukeun: '말하길 잘했어. 근데 걔 반응 봐봐.',
      honmi:  '자기를 위해서 그랬다고... 그게 더 복잡한데.',
      dodo:   '말은 했어. 이제 어떻게 받아치느냐가 문제지.',
    }
  },
  {
    id: 'silent',
    text: '아무 말 않고 듣는다',
    subtext: '',
    bResponse: '자기야, 지금 어디야? 왜 그렇게 가버린 거야. 걱정되잖아.',
    emotionReactions: {
      buni:   '침묵도 답이긴 한데... 이러다 걔 페이스에 끌려가.',
      seorup: '걱정된다고 했어. 그 말이 좀 풀리게 하네.',
      dukeun: '걱정해줬잖아. 그것만으로도 좀 낫지 않아?',
      honmi:  '침묵이 길어지면 어떻게 되는 거지.',
      dodo:   '기다려. 걔가 먼저 말하게 해.',
    }
  },
];

// 2분기: 쌓인 감정 + 눈길 질문
export const PHASE2_EMOTIONS_A_FEMALE: EmotionLine[] = [
  { character: 'buni',   text: '아니 근데 솔직히 새우가 문제가 아니잖아. 오늘 내 친구가 그렇게 차려입고 나온 거 봤잖아. 우린 커플티 입고 갔는데.' },
  { character: 'seorup', text: '매번 이래. 화나도 말 못하고 혼자 삭히다가 결국 이렇게 터지는 거잖아. 나 사실 오늘만의 얘기가 아니야.' },
  { character: 'dukeun', text: '근데 있잖아... 우리 연인이 모두에게 다정한 사람이라서 좋아했던 거잖아. 그게 갑자기 나쁜 게 되는 건 아니잖아.' },
  { character: 'honmi',  text: '나 지금 걔가 밉냐고 하면... 밉지는 않아. 근데 이 기분은 뭐지. 내가 너무 예민한 건가. 아니면 당연히 화낼 수 있는 건가.' },
  { character: 'dodo',   text: '똑바로 물어봐. 그 친구 눈에 들어왔냐고. 빙빙 돌리지 말고.' },
];

export const BUNI_CALLOUT_2 = '야 @NAME@아, 네 생각은 어때? 그냥 넘어갈 거야, 아니면 오늘 다 얘기할 거야?';

export const PHASE2_CHOICES = [
  {
    id: 'vent-all',
    text: '쌓인 감정을 털어놓는다',
    subtext: '"사실 오늘만의 얘기가 아니야. 항상 나한테만 친절했으면 좋겠다고 했잖아. 근데 매번 이래."',
    bResponse: '...자기야. 그게 그렇게 힘들었어? 나 진짜 몰랐어. 미안해.',
    emotionReactions: {
      buni:   '드디어 말했어. 잘했어.',
      seorup: '미안하다고 했어. 근데 왜 눈물이 나려고 하지.',
      dukeun: '알아줬잖아. 이제 좀 풀릴 것 같아.',
      honmi:  '근데 다음엔 또 이럴 것 같은데... 아닌가.',
      dodo:   '말로만 미안하면 뭐해. 바뀌어야지.',
    }
  },
  {
    id: 'ask-direct',
    text: '직접 묻는다',
    subtext: '"솔직히 얘기해봐. 오늘 내 친구가 예뻐보여서 더 그랬던 거 아냐?"',
    bResponse: '...솔직히 말할게.',
    emotionReactions: {
      buni:   '솔직히 말할게라고? 뭐라고 할 것 같아.',
      seorup: '듣고 싶으면서도 듣기 싫어. 이 침묵이 너무 길어.',
      dukeun: '괜찮아. 어떤 대답이 와도 우리 연인 믿어.',
      honmi:  '솔직히 말할게... 이게 좋은 신호야, 나쁜 신호야.',
      dodo:   '잘 들어. 눈 감지 말고.',
    }
  },
  {
    id: 'ask-indirect',
    text: '돌려서 묻는다',
    subtext: '"나 친구 때문에 짜증나기도 했어. 우리 기념일인데 왜 자기가 더 꾸미고 오냐구."',
    bResponse: '으응? 친구가 꾸미고 왔었어? 난 우리 자기밖에 눈에 안 들어와서 친구들은 뭐 입고 왔는지 기억도 안 나는데.',
    emotionReactions: {
      buni:   '기억도 안 난다고? 진짜야? 거짓말 아니야?',
      seorup: '우리 자기밖에 눈에 안 들어온다고 했어. 나 지금 울 것 같아.',
      dukeun: '봐봐. 역시 우리 연인이잖아. 그럴 줄 알았어.',
      honmi:  '근데 진짜일까. 아니면 그냥 하는 말일까.',
      dodo:   '흠. 나쁘지 않은 대답이네. 근데 방심은 금물.',
    }
  },
  {
    id: 'give-up-today',
    text: '오늘은 더 이상 얘기하지 않는다',
    subtext: '"...됐어. 오늘은 그냥 자자."',
    bResponse: '자기야, 우리 이러지 않기로 했잖아. 오늘 감정은 오늘 풀기로 약속했었잖아.',
    emotionReactions: {
      buni:   '약속? 무슨 약속? 지금 그게 문제야?',
      seorup: '맞아... 우리 그런 약속 했었는데. 내가 먼저 어긴 건가.',
      dukeun: '저 말은 우리 사이를 지키고 싶어서 하는 말이잖아.',
      honmi:  '약속을 꺼내는 게 꼬투리인 건지, 진심인 건지 모르겠어.',
      dodo:   '약속 얘기 꺼낸다고 넘어가지 마. 지금 내 감정이 먼저야.',
    }
  },
];

// "솔직히 말할게" 이후 B의 고백
export const B_CONFESSION = {
  pause: '...',
  text: '눈에 들어오긴 했어.',
  pause2: '',
  clarify: '근데 그게 다야. 진짜로. 화려하게 차려입고 오니까 눈에 띈 거지. 마음이 흔들린 건 아니야. 자기 옆에 있으면서 딴 마음 품은 적 없어.',
};

export const CONFESSION_EMOTION_REACTIONS: Record<string, Record<string, string>> = {
  accept: {
    buni:   '...진짜 괜찮아? 억지로 괜찮은 척하는 거 아니야?',
    seorup: '괜찮다고 하는데 왜 눈물이 나려고 하지.',
    dukeun: '괜찮아. 솔직하게 말해준 것만으로도 충분해.',
    honmi:  '괜찮은 척하다가 나중에 또 터지는 거 아닐까.',
    dodo:   '괜찮으면 괜찮은 거야. 근데 잊지는 마.',
  },
  angry: {
    buni:   '당연히 화나지. 근데 솔직하게 말해준 건 맞잖아.',
    seorup: '화나는 게 당연해. 근데 이 화를 어떻게 해야 하지.',
    dukeun: '화는 나는데... 솔직하게 말해준 거잖아. 그게 어디야.',
    honmi:  '화가 나는 건지, 서러운 건지, 안심이 되는 건지 모르겠어.',
    dodo:   '화내도 돼. 근데 솔직하게 말해준 것만큼은 인정해줘.',
  },
  pushmore: {
    buni:   '맞아. 그게 다인지 확인해야지.',
    seorup: '더 물어봤다가 더 나쁜 말 나오면 어떡하지.',
    dukeun: '야, 이 정도면 충분한 거 아니야? 더 파면 다쳐.',
    honmi:  '더 물어보는 게 맞는 건지... 모르겠어.',
    dodo:   '파고 싶으면 파. 근데 각오는 해야 해.',
  },
};

export const PHASE2_CONFESSION_CHOICES = [
  {
    id: 'accept',
    text: '받아들인다',
    subtext: '"...알았어. 솔직하게 말해줘서 고마워."',
    bResponse: '자기야... 미안해. 그리고 고마워. 나 자기밖에 없어, 진짜로.',
  },
  {
    id: 'angry',
    text: '화를 낸다',
    subtext: '"눈에 들어왔다는 게 말이 돼? 나 지금 너무 화나."',
    bResponse: '...화나는 거 당연해. 근데 자기야, 나 자기한테 거짓말하기 싫어서 말한 거야.',
  },
  {
    id: 'pushmore',
    text: '더 묻는다',
    subtext: '"그게 다야? 진짜로?"',
    bResponse: '...더 이상은 없어. 자기, 나 자기 사랑해. 그것만은 진짜야.',
  },
];

// 3분기: 오늘 밤 만날까 말까
export const PHASE3_B_OPENERS: Record<string, string> = {
  'vent-all':      '자기야... 그동안 그렇게 힘들었구나. 나 지금 당장 가고 싶어. 어디야?',
  'accept':        '자기야, 고마워. 나 지금 보고 싶어. 가도 돼?',
  'angry':         '...자기야, 이대로 끊기 싫어. 나 지금 가면 안 돼?',
  'pushmore':      '자기, 나 자기 사랑해. 오늘 밤 이대로 끝내지 말자. 만나자.',
  'ask-indirect':  '자기야, 나 지금 많이 보고 싶어. 지금 가도 돼?',
  'give-up-today': '자기야, 우리 이러면 안 돼. 나 지금 갈게. 문 열어줄 거지?',
  'default':       '자기야, 보고 싶어. 지금 가도 돼?',
};

export const PHASE3_EMOTIONS_A_FEMALE: EmotionLine[] = [
  { character: 'buni',   text: '지금 온다고? 나 아직 화 안 풀렸는데. 만나면 더 싸울 것 같은데.' },
  { character: 'seorup', text: '...보고 싶긴 해. 근데 이 눈 보여주기 싫어. 너무 울었잖아.' },
  { character: 'dukeun', text: '와. 와줘. 지금 당장. 목소리 듣는 것보다 얼굴 보고 싶어.' },
  { character: 'honmi',  text: '만나면 좋아질까. 아니면 더 싸울까. 만나야 할지 말아야 할지 모르겠어.' },
  { character: 'dodo',   text: '오고 싶으면 오라고 해. 근데 네가 먼저 열어준다고 하지 마. 기다려.' },
];

export const BUNI_CALLOUT_3 = '야 @NAME@아, 어떻게 할 거야? 오라고 할 거야, 말 거야?';

export const PHASE3_CHOICES = [
  {
    id: 'meet',
    text: '만난다',
    subtext: '"...와. 근데 올 거면 빨리 와."',
    bResponse: '알았어. 금방 갈게. 문 앞에서 전화할게.',
    emotionReactions: {
      buni:   '그래. 와서 직접 설명해봐.',
      seorup: '오면... 또 눈물 날 것 같아. 근데 괜찮아.',
      dukeun: '잘했어. 보면 다 풀릴 거야. 분명히.',
      honmi:  '만나면 해결될까. 근데 안 보는 것보단 낫겠지.',
      dodo:   '오라고 해. 근데 문은 네가 열어줘. 기다리게 해.',
    }
  },
  {
    id: 'no-meet',
    text: '오늘은 만나지 않는다',
    subtext: '"오늘은 그냥 자. 내일 얘기하자."',
    bResponse: '...그래. 알았어. 잘 자, 자기야.',
    emotionReactions: {
      buni:   '맞아. 오늘은 혼자 정리할 시간이 필요해.',
      seorup: '혼자 있으면 더 생각 많아질 것 같은데...',
      dukeun: '에이... 보고 싶은데. 진짜 오지 말라고 할 거야?',
      honmi:  '혼자 있는 게 맞는 건지. 더 멀어지는 건 아닐지.',
      dodo:   '혼자 있어. 감정 정리하고 만나는 게 나아.',
    }
  },
  {
    id: 'let-decide',
    text: 'B한테 결정을 넘긴다',
    subtext: '"...모르겠어. 네가 결정해."',
    bResponse: '...나 갈게. 보고 싶어, 자기.',
    emotionReactions: {
      buni:   '결정을 넘겼어. 뭐, 어떻게 나오나 보자.',
      seorup: '보고 싶다고 했어. 그 말에 마음이 움직이네.',
      dukeun: '와줄 거잖아. 역시.',
      honmi:  '내가 결정 못 한 건지, 맡긴 건지 모르겠어.',
      dodo:   '...뭐. 오면 오는 거지.',
    }
  },
];

// 4분기: 집 앞 도착
export const PHASE4_ARRIVAL = '나 집 앞에 도착했어.';

export const PHASE4_STEP1_EMOTIONS: EmotionLine[] = [
  { character: 'buni',   text: '집 앞까지 왔어? 빠르네. 근데 내가 나가면 내가 더 보고 싶었던 거 티 나는 거 아냐?' },
  { character: 'seorup', text: '집 앞까지 달려왔구나... 그 마음은 알겠어. 근데 아직 눈이 부어있는데.' },
  { character: 'dukeun', text: '나가. 빨리. 보고 싶잖아. 지금 이 순간이 중요한 거야.' },
  { character: 'honmi',  text: '나가는 게 맞나, 들어오라고 하는 게 맞나. 뭐가 더 자연스럽지.' },
  { character: 'dodo',   text: '들어오라고 해. 네가 나가면 네가 더 약한 거야. 기다려.' },
];

export const BUNI_CALLOUT_4A = '야 @NAME@아, 어떻게 할 거야?';

export const PHASE4_STEP1_CHOICES = [
  {
    id: 'go-out',
    text: '나가서 맞이한다',
    emotionReactions: {
      buni:   '에이, 티 다 났네. 뭐 어때, 보고 싶은 거 맞잖아.',
      seorup: '나가면서 심호흡 한 번 해. 눈 많이 부었어.',
      dukeun: '잘했어. 보는 순간 다 녹을 거야.',
      honmi:  '나가는 게 맞겠지. 아마도.',
      dodo:   '...뭐, 네 선택이니까.',
    }
  },
  {
    id: 'let-in',
    text: '들어오라고 한다',
    emotionReactions: {
      buni:   '그래. 네 공간이잖아. 네가 주도해.',
      seorup: '들어오면 더 긴 얘기 하게 될 것 같은데... 괜찮아?',
      dukeun: '들어오면 더 오래 있을 수 있잖아. 좋아.',
      honmi:  '들어오라고 하면 완전히 풀겠다는 건데. 그게 맞나.',
      dodo:   '잘 생각했어. 네 페이스로 가는 거야.',
    }
  },
];

export const PHASE4_STEP2_EMOTIONS: EmotionLine[] = [
  { character: 'buni',   text: '막상 보니까 할 말이 없어? 아까 그 많던 말은 다 어디 갔어.' },
  { character: 'seorup', text: '...보는 순간 눈물 나올 것 같아. 참아. 제발.' },
  { character: 'dukeun', text: '말 안 해도 돼. 그냥 안아줘. 그게 다야.' },
  { character: 'honmi',  text: '뭐라고 해야 하지. 미안해? 보고 싶었어? 아직도 화나?' },
  { character: 'dodo',   text: '먼저 말하지 마. 걔가 먼저 말하게 해.' },
];

export const BUNI_CALLOUT_4B = '야 @NAME@아, 뭐라고 할 거야?';

export const PHASE4_STEP2_CHOICES = [
  {
    id: 'sorry',
    text: '"미안해."',
    bResponse: '나도 미안해. 자기야.',
    ending: 'happy' as const,
  },
  {
    id: 'missed-you',
    text: '"보고 싶었어."',
    bResponse: '나도. 엄청.',
    ending: 'happy' as const,
  },
  {
    id: 'still-angry',
    text: '"아직 화 안 풀렸어."',
    bResponse: '...그래. 알아. 근데 나 왔잖아.',
    ending: null, // 추가 선택
  },
  {
    id: 'hug',
    text: '말없이 안긴다',
    bResponse: '말없이 안아준다. 한참 동안.',
    ending: 'happy' as const,
  },
];

// 엔딩
export const ENDINGS = {
  happy: {
    title: '오늘 밤, 우리 괜찮아',
    scene: `한참을 안고 있다가, B가 먼저 말을 꺼낸다.

"자기야, 나 진짜 자기밖에 없어. 오늘 내가 눈치가 없었어. 미안해."

A는 아무 말 없이 B의 어깨에 기댄다.

"앞으로는 더 잘 할게. 약속해."

창문 너머로 제주의 밤바람이 들어온다.`,
    emotionLines: [
      { character: 'buni' as EmotionCharacter,   text: '...뭐야. 화가 안 나네. 억울하다.' },
      { character: 'seorup' as EmotionCharacter, text: '눈물이 나는데 슬프지가 않아. 이상하다.' },
      { character: 'dukeun' as EmotionCharacter, text: '거봐. 괜찮을 거라고 했잖아.' },
      { character: 'honmi' as EmotionCharacter,  text: '이게 맞는 건지 아직도 모르겠는데... 기분은 좋아.' },
      { character: 'dodo' as EmotionCharacter,   text: '...잘 됐네. 근데 다음엔 더 빨리 알아채야 해.' },
    ],
    card: '오늘 밤, 두 사람은 괜찮았다.\n\n사랑한다는 건\n완벽한 사람을 만나는 게 아니라\n서툰 사람과 함께 맞춰가는 것일지도.\n\n당신의 사랑은 오늘 밤을 버텨냈습니다.',
    emoji: '🌙',
  },
  breakup: {
    title: '우리, 여기까지였나봐',
    scene: `만났지만 대화는 점점 어긋났다.

"아직 화 안 풀렸어."
"...그래. 알아. 근데 나 왔잖아."
"온 게 다야? 왜 왔는지는 알아?"
"자기가 보고 싶어서."
"나는 네가 뭘 잘못했는지 알았으면 했어."

긴 침묵.

"...자기야, 나 진짜 최선을 다하고 있어."
"나도 알아. 근데 그게 나한테는 안 느껴질 때가 있어."

또 침묵.

"우리... 지금 많이 지쳤나봐."
"...응."`,
    emotionLines: [
      { character: 'buni' as EmotionCharacter,   text: '이게 맞는 결말인 건지. 모르겠어. 근데 더 이상 싸우기 싫어.' },
      { character: 'seorup' as EmotionCharacter, text: '울고 싶은데 눈물도 안 나와. 그게 더 슬퍼.' },
      { character: 'dukeun' as EmotionCharacter, text: '...두근거림이 멈췄어. 처음으로.' },
      { character: 'honmi' as EmotionCharacter,  text: '이게 끝인 건가. 아직도 모르겠어.' },
      { character: 'dodo' as EmotionCharacter,   text: '...잘 버텼어. 수고했어.' },
    ],
    card: '오늘 밤, 두 사람은 서로를 놓았다.\n\n사랑이 부족해서가 아니었다.\n그냥, 타이밍이 맞지 않았던 걸지도.\n\n당신의 사랑은 오늘 밤 새로운 길을 선택했습니다.',
    emoji: '🖤',
  },
  undecided: {
    title: '오늘 밤은, 그냥 이대로',
    scene: `전화가 끊겼다.

아무것도 해결되지 않았다.
아무것도 결정되지 않았다.

그냥 밤이 깊어졌다.

핸드폰을 내려놓으려다, 다시 집어든다.
카톡 창을 열었다 닫았다.
뭔가 보내려다 지웠다.

B의 마지막 메시지가 아직 읽음 처리가 안 돼있다.`,
    emotionLines: [
      { character: 'buni' as EmotionCharacter,   text: '이게 뭐야. 끝난 것도 아니고 풀린 것도 아니고.' },
      { character: 'seorup' as EmotionCharacter, text: '오늘 하루가 너무 길었어. 그냥 자고 싶어.' },
      { character: 'dukeun' as EmotionCharacter, text: '내일은 괜찮아질 거야. 그렇지?' },
      { character: 'honmi' as EmotionCharacter,  text: '...모르겠어. 아직도.' },
      { character: 'dodo' as EmotionCharacter,   text: '생각 정리되면 그때 연락해. 서두르지 마.' },
    ],
    card: '오늘 밤, 두 사람은 아직 답을 찾지 못했다.\n\n괜찮아.\n모든 사랑이 오늘 밤 답을 낼 필요는 없으니까.\n\n당신의 사랑은 아직 끝나지 않았습니다.',
    emoji: '🌙',
  },
};
