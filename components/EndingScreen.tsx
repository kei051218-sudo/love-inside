'use client';

import { PlayerInfo, EMOTION_CONFIG } from '@/types/game';

interface Props {
  player: PlayerInfo;
  type: 'happy' | 'breakup' | 'undecided';
  onRestart: () => void;
}

const ENDINGS = {
  happy: {
    emoji: '💛',
    title: '오늘 밤, 우리 괜찮아',
    reactions: [
      { character: 'buni',   text: '...뭐야. 화가 안 나네. 억울하다.' },
      { character: 'seorup', text: '눈물이 나는데 슬프지가 않아. 이상하다.' },
      { character: 'dukeun', text: '거봐. 괜찮을 거라고 했잖아.' },
      { character: 'honmi',  text: '이게 맞는 건지 아직도 모르겠는데... 기분은 좋아.' },
      { character: 'dodo',   text: '...잘 됐네. 근데 다음엔 더 빨리 알아채야 해.' },
    ],
    message: [
      '오늘 밤, 두 사람은 괜찮았다.',
      '',
      '사랑한다는 건',
      '완벽한 사람을 만나는 게 아니라',
      '서툰 사람과 함께 맞춰가는 것일지도.',
    ],
    ending: '당신의 사랑은 오늘 밤을 버텨냈습니다.',
  },
  breakup: {
    emoji: '🖤',
    title: '우리, 여기까지였나봐',
    reactions: [
      { character: 'buni',   text: '...그래. 잘했어. 근데 좀 슬프다.' },
      { character: 'seorup', text: '이게 맞는 결정인 거겠지. 그래도 많이 울 것 같아.' },
      { character: 'dukeun', text: '...아직도 좋아하는데. 왜 이렇게 됐지.' },
      { character: 'honmi',  text: '잘한 건지 못한 건지 모르겠어. 그냥 많이 지쳐.' },
      { character: 'dodo',   text: '잘했어. 후련하지? 이제 앞을 봐.' },
    ],
    message: [
      '오늘 밤, 두 사람은 새로운 길을 선택했다.',
      '',
      '때로는 사랑보다',
      '용기가 필요한 순간이 있다.',
      '오늘이 그런 밤이었을지도.',
    ],
    ending: '당신의 사랑은 오늘 밤 새로운 길을 선택했습니다.',
  },
  undecided: {
    emoji: '🌀',
    title: '오늘 밤은, 그냥 이대로',
    reactions: [
      { character: 'buni',   text: '...오늘은 여기까지. 내일 다시 생각해.' },
      { character: 'seorup', text: '다 털어놓지 못했지만... 오늘은 이게 최선이었어.' },
      { character: 'dukeun', text: '괜찮아. 내일 또 보면 되잖아.' },
      { character: 'honmi',  text: '아직 모르겠어. 좀 더 생각해봐야 할 것 같아.' },
      { character: 'dodo',   text: '잘 쉬어. 모든 걸 오늘 다 해결할 필요는 없어.' },
    ],
    message: [
      '오늘 밤은, 그냥 이대로.',
      '',
      '모든 감정이 하루에 풀리지는 않아.',
      '오늘 못 다한 말은',
      '내일의 우리에게 남겨두기로.',
    ],
    ending: '당신의 사랑은 아직 끝나지 않았습니다.',
  },
};

import { EMOTION_CONFIG as EC } from '@/types/game';

export default function EndingScreen({ player, type, onRestart }: Props) {
  const ending = ENDINGS[type];
  const cfg = EMOTION_CONFIG[player.emotion];

  return (
    <div style={{ minHeight: '100vh', background: '#FDF6F0', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <div style={{ padding: '48px 28px 0', maxWidth: '420px', margin: '0 auto', width: '100%' }}>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#B08090', letterSpacing: '0.1em', marginBottom: '8px' }}>
          {ending.emoji} ENDING
        </p>
        <p style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '22px', color: '#7A3D50', textAlign: 'center', lineHeight: 1.5, marginBottom: '32px' }}>
          {ending.title}
        </p>
      </div>

      <div style={{ flex: 1, padding: '0 16px', maxWidth: '420px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>

        {/* 감정 반응들 */}
        <div style={{ marginBottom: '28px' }}>
          {ending.reactions.map((r, i) => {
            const ec = EMOTION_CONFIG[r.character as keyof typeof EMOTION_CONFIG];
            const isMe = r.character === player.emotion;
            return (
              <div key={i} style={{
                background: isMe ? `${ec.color}12` : 'rgba(255,255,255,0.85)',
                border: isMe ? `1px solid ${ec.color}35` : '1px solid rgba(201,96,122,0.1)',
                borderRadius: '16px', padding: '14px 16px', marginBottom: '10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span>{ec.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: ec.color }}>{ec.name}</span>
                  {isMe && <span style={{ fontSize: '10px', color: ec.color, background: `${ec.color}25`, padding: '1px 7px', borderRadius: '8px' }}>나</span>}
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.75, color: '#2C1810', fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 300, margin: 0 }}>
                  {r.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* 엔딩 메시지 */}
        <div style={{
          background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(201,96,122,0.15)',
          borderRadius: '20px', padding: '28px 24px', marginBottom: '16px',
        }}>
          {ending.message.map((line, i) => (
            <p key={i} style={{
              fontFamily: 'Noto Serif KR, serif',
              fontSize: line === '' ? '8px' : '15px',
              color: '#6B4855',
              lineHeight: 2,
              margin: 0,
              minHeight: line === '' ? '16px' : 'auto',
            }}>
              {line || '\u00A0'}
            </p>
          ))}
        </div>

        {/* 결말 한 줄 */}
        <p style={{
          fontFamily: 'Noto Serif KR, serif', fontSize: '14px',
          color: '#C9607A', textAlign: 'center', marginBottom: '32px', letterSpacing: '0.02em',
        }}>
          {ending.ending}
        </p>

        {/* 공연 안내 */}
        <div style={{
          background: 'rgba(201,96,122,0.06)', border: '1px solid rgba(201,96,122,0.18)',
          borderRadius: '16px', padding: '20px', marginBottom: '16px', textAlign: 'center',
        }}>
          <p style={{ fontSize: '13px', color: '#7A3D50', lineHeight: 1.9, fontFamily: 'Noto Sans KR, sans-serif', marginBottom: '12px' }}>
            🎭 관객들이 주인공의 감정이 되어<br />
            처음부터 끝까지 모든 과정을 함께 하는<br />
            참여형 연극 <strong>Love Inside</strong><br />
            함께 하고 싶으시다면 →
          </p>
          <a href="#" style={{
            display: 'inline-block', padding: '12px 24px', borderRadius: '12px',
            background: 'rgba(201,96,122,0.15)', border: '1px solid rgba(201,96,122,0.3)',
            color: '#C9607A', fontSize: '14px', textDecoration: 'none', fontFamily: 'Noto Sans KR, sans-serif',
          }}>공연 바로가기</a>
        </div>

        {/* 버튼들 */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '48px' }}>
          <button onClick={onRestart} style={{
            flex: 1, padding: '16px', borderRadius: '14px', fontSize: '14px',
            background: 'white', border: '1px solid rgba(201,96,122,0.2)',
            color: '#B08090', cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif',
          }}>다시하기</button>
          <button onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Love Inside', text: `나의 엔딩: ${ending.title}\n${ending.ending}`, url: window.location.href });
            }
          }} style={{
            flex: 1, padding: '16px', borderRadius: '14px', fontSize: '14px',
            background: 'rgba(201,96,122,0.12)', border: '1px solid rgba(201,96,122,0.3)',
            color: '#C9607A', cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif',
          }}>💬 내 엔딩 공유하기</button>
        </div>
      </div>
    </div>
  );
}
