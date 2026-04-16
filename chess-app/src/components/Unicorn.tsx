import './Unicorn.css'

export type UnicornMood = 'happy' | 'thinking' | 'excited' | 'sad' | 'talking'

interface UnicornProps {
  mood?: UnicornMood
  size?: number
  animate?: boolean
}

export default function Unicorn({ mood = 'happy', size = 160, animate = true }: UnicornProps) {
  // Mund-Form je nach Stimmung
  const mouth: Record<UnicornMood, string> = {
    happy:    'M 82 96 Q 96 108 110 96',
    thinking: 'M 85 100 Q 96 100 107 100',
    excited:  'M 80 94 Q 96 112 112 94',
    sad:      'M 82 104 Q 96 94 110 104',
    talking:  'M 82 96 Q 96 110 110 96',
  }

  // Augen je nach Stimmung
  const eyes: Record<UnicornMood, { left: string; right: string }> = {
    happy:    { left: 'M 78 76 Q 85 70 92 76', right: 'M 100 76 Q 107 70 114 76' },
    thinking: { left: 'M 78 78 L 92 78',        right: 'M 100 72 Q 107 70 114 74' },
    excited:  { left: 'M 75 73 Q 85 65 95 73',  right: 'M 97 73 Q 107 65 117 73' },
    sad:      { left: 'M 78 74 Q 85 80 92 74',  right: 'M 100 74 Q 107 80 114 74' },
    talking:  { left: 'M 78 76 Q 85 70 92 76',  right: 'M 100 76 Q 107 70 114 76' },
  }

  const animClass = animate
    ? mood === 'thinking' ? 'unicorn--thinking'
    : mood === 'excited'  ? 'unicorn--excited'
    : 'unicorn--bounce'
    : ''

  return (
    <div className={`unicorn-wrapper ${animClass}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 192 192"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        aria-label="Stella das Einhorn"
      >
        {/* ── Körper ── */}
        <ellipse cx="96" cy="152" rx="52" ry="38" fill="#F5F0FF" stroke="#C4B5FD" strokeWidth="2" />

        {/* ── Beine ── */}
        <rect x="68" y="178" width="12" height="14" rx="5" fill="#F5F0FF" stroke="#C4B5FD" strokeWidth="1.5" />
        <rect x="84" y="180" width="12" height="12" rx="5" fill="#F5F0FF" stroke="#C4B5FD" strokeWidth="1.5" />
        <rect x="96" y="180" width="12" height="12" rx="5" fill="#F5F0FF" stroke="#C4B5FD" strokeWidth="1.5" />
        <rect x="112" y="178" width="12" height="14" rx="5" fill="#F5F0FF" stroke="#C4B5FD" strokeWidth="1.5" />

        {/* ── Schwanz (Regenbogen) ── */}
        <path d="M148 148 Q168 128 162 155 Q178 130 170 160" stroke="#F472B6" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M148 148 Q170 125 165 155" stroke="#A78BFA" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M148 148 Q172 132 168 158" stroke="#60A5FA" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* ── Kopf ── */}
        <circle cx="96" cy="86" r="50" fill="#F5F0FF" stroke="#C4B5FD" strokeWidth="2" />

        {/* ── Horn ── */}
        <polygon points="96,18 86,52 106,52" fill="url(#hornGrad)" />
        <line x1="96" y1="22" x2="88" y2="46" stroke="#FCD34D" strokeWidth="1" opacity="0.5" />
        <line x1="96" y1="26" x2="100" y2="48" stroke="#FCD34D" strokeWidth="1" opacity="0.5" />

        {/* ── Mähne (Regenbogen) ── */}
        <path d="M 52 68 Q 30 95 44 128" stroke="#F472B6" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M 48 64 Q 24 95 40 130" stroke="#A78BFA" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M 56 60 Q 34 90 48 125" stroke="#60A5FA" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M 62 56 Q 44 85 56 120" stroke="#34D399" strokeWidth="6" fill="none" strokeLinecap="round" />

        {/* ── Augen (Weiß) ── */}
        <ellipse cx="84" cy="82" rx="12" ry="13" fill="white" />
        <ellipse cx="108" cy="82" rx="12" ry="13" fill="white" />

        {/* ── Pupillen ── */}
        <circle cx="86" cy="83" r="7" fill="#4C1D95" />
        <circle cx="110" cy="83" r="7" fill="#4C1D95" />

        {/* ── Glanz in den Augen ── */}
        <circle cx="89" cy="80" r="3" fill="white" />
        <circle cx="113" cy="80" r="3" fill="white" />
        <circle cx="87" cy="85" r="1.5" fill="white" opacity="0.7" />
        <circle cx="111" cy="85" r="1.5" fill="white" opacity="0.7" />

        {/* ── Wimper-Bögen ── */}
        <path d={eyes[mood].left}  stroke="#4C1D95" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d={eyes[mood].right} stroke="#4C1D95" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* ── Nase ── */}
        <ellipse cx="88" cy="100" rx="4" ry="2.5" fill="#FBCFE8" />
        <ellipse cx="104" cy="100" rx="4" ry="2.5" fill="#FBCFE8" />

        {/* ── Mund ── */}
        <path d={mouth[mood]} stroke="#EC4899" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* ── Wangen-Röte ── */}
        <ellipse cx="72" cy="98" rx="10" ry="6" fill="#FBCFE8" opacity="0.5" />
        <ellipse cx="120" cy="98" rx="10" ry="6" fill="#FBCFE8" opacity="0.5" />

        {/* ── Sternchen-Dekor ── */}
        <text x="132" y="60" fontSize="14" fill="#FCD34D" opacity="0.9">✦</text>
        <text x="140" y="82" fontSize="10" fill="#C4B5FD" opacity="0.8">✦</text>
        <text x="128" y="44" fontSize="10" fill="#F472B6" opacity="0.7">✦</text>

        {/* ── Gradients ── */}
        <defs>
          <linearGradient id="hornGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>

      {/* Glitzer-Partikel bei excited */}
      {mood === 'excited' && (
        <div className="unicorn-glitter" aria-hidden="true">
          <span>✨</span><span>⭐</span><span>✨</span>
        </div>
      )}
    </div>
  )
}
