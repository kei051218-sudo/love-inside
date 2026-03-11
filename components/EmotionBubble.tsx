'use client';

import { EmotionCharacter, EMOTION_CONFIG } from '@/types/game';

interface EmotionBubbleProps {
  character: EmotionCharacter;
  text: string;
  isPlayer?: boolean;
  delay?: number;
  className?: string;
}

export default function EmotionBubble({ character, text, isPlayer = false, delay = 0, className = '' }: EmotionBubbleProps) {
  const config = EMOTION_CONFIG[character];

  return (
    <div
      className={`opacity-0 animate-fadeIn ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      <div
        className="rounded-2xl p-4 mb-3"
        style={{
          background: isPlayer
            ? `linear-gradient(135deg, rgba(${hexToRgb(config.color)}, 0.15), rgba(${hexToRgb(config.color)}, 0.05))`
            : 'rgba(255,255,255,0.04)',
          border: isPlayer
            ? `1px solid rgba(${hexToRgb(config.color)}, 0.4)`
            : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{config.emoji}</span>
          <span
            className="text-xs font-medium tracking-wide"
            style={{ color: config.color }}
          >
            {config.name}
            {isPlayer && <span className="ml-1 opacity-60">(나)</span>}
          </span>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-primary)', fontWeight: 300 }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
