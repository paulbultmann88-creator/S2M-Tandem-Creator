import { useState, useEffect } from 'react'
import Unicorn, { type UnicornMood } from '../components/Unicorn'
import { speech } from '../hooks/useSpeech'
import { SCRIPT } from '../content/script'
import type { Screen } from '../types'
import './LearnScreen.css'

interface LearnScreenProps {
  onNavigate: (screen: Screen) => void
}

type PieceKey = keyof typeof SCRIPT.pieces
type StrategyKey = keyof typeof SCRIPT.strategy

interface LessonEntry {
  id: string
  icon: string
  label: string
  color: string
}

const PIECE_LESSONS: LessonEntry[] = [
  { id: 'king',   icon: '♔', label: 'König',    color: '#F59E0B' },
  { id: 'queen',  icon: '♕', label: 'Dame',     color: '#EC4899' },
  { id: 'rook',   icon: '♖', label: 'Turm',     color: '#3B82F6' },
  { id: 'bishop', icon: '♗', label: 'Läufer',   color: '#10B981' },
  { id: 'knight', icon: '♘', label: 'Springer', color: '#8B5CF6' },
  { id: 'pawn',   icon: '♙', label: 'Bauer',    color: '#F97316' },
]

const STRATEGY_LESSONS: LessonEntry[] = [
  { id: 'center',      icon: '🎯', label: 'Die Mitte',    color: '#6366F1' },
  { id: 'develop',     icon: '🚀', label: 'Figuren raus', color: '#06B6D4' },
  { id: 'protectKing', icon: '🛡️', label: 'König schützen', color: '#7C3AED' },
  { id: 'capture',     icon: '⚔️', label: 'Schlagen',     color: '#EF4444' },
  { id: 'savePieces',  icon: '💎', label: 'Figuren retten', color: '#F59E0B' },
]

export default function LearnScreen({ onNavigate }: LearnScreenProps) {
  const [mood, setMood] = useState<UnicornMood>('happy')
  const [activeTab, setActiveTab] = useState<'pieces' | 'strategy'>('pieces')
  const [activeLesson, setActiveLesson] = useState<string | null>(null)

  useEffect(() => {
    speech.speak('Was möchtest du lernen?', 'high')
  }, [])

  const playPieceLesson = (id: string) => {
    const key = id as PieceKey
    const lesson = SCRIPT.pieces[key]
    setActiveLesson(id)
    setMood('talking')
    speech.stop()
    speech.speak(lesson.intro)
    speech.speak(lesson.move)
    speech.speak(lesson.tip)
    speech.speak(lesson.extra)
    setTimeout(() => setMood('happy'), 5000)
  }

  const playStrategyLesson = (id: string) => {
    const key = id as StrategyKey
    const lesson = SCRIPT.strategy[key]
    setActiveLesson(id)
    setMood('talking')
    speech.stop()
    speech.speak(lesson.title)
    speech.speak(lesson.explain)
    speech.speak(lesson.tip)
    setTimeout(() => setMood('happy'), 6000)
  }

  const handleLessonTap = (id: string) => {
    if (activeTab === 'pieces') playPieceLesson(id)
    else playStrategyLesson(id)
  }

  return (
    <div className="learn-screen">
      {/* Header */}
      <div className="learn-screen__header">
        <button
          className="back-btn"
          onClick={() => { speech.stop(); onNavigate('menu') }}
          aria-label="Zurück"
        >
          ←
        </button>
        <h2 className="learn-screen__title">Lernen</h2>
        <div style={{ width: 44 }} />
      </div>

      {/* Einhorn */}
      <div className="learn-screen__unicorn">
        <Unicorn mood={mood} size={120} />
        {activeLesson && (
          <button
            className="repeat-btn"
            onClick={() => handleLessonTap(activeLesson)}
            aria-label="Nochmal anhören"
          >
            🔊
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="learn-screen__tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'pieces'}
          className={`tab-btn ${activeTab === 'pieces' ? 'tab-btn--active' : ''}`}
          onClick={() => { setActiveTab('pieces'); setActiveLesson(null) }}
        >
          ♟ Figuren
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'strategy'}
          className={`tab-btn ${activeTab === 'strategy' ? 'tab-btn--active' : ''}`}
          onClick={() => { setActiveTab('strategy'); setActiveLesson(null) }}
        >
          🎯 Strategie
        </button>
      </div>

      {/* Lektionen-Grid */}
      <div className="learn-screen__grid" role="tabpanel">
        {(activeTab === 'pieces' ? PIECE_LESSONS : STRATEGY_LESSONS).map(lesson => (
          <button
            key={lesson.id}
            className={`lesson-card ${activeLesson === lesson.id ? 'lesson-card--active' : ''}`}
            style={{ '--lesson-color': lesson.color } as React.CSSProperties}
            onClick={() => handleLessonTap(lesson.id)}
            aria-label={lesson.label}
          >
            <span className="lesson-card__icon">{lesson.icon}</span>
            <span className="lesson-card__label">{lesson.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
