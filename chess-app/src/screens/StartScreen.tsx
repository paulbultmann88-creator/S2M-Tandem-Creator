import { useEffect, useState } from 'react'
import Unicorn from '../components/Unicorn'
import { speech } from '../hooks/useSpeech'
import { SCRIPT } from '../content/script'
import type { Screen } from '../types'
import './StartScreen.css'

interface StartScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function StartScreen({ onNavigate }: StartScreenProps) {
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    // Kurze Verzögerung, dann Begrüßung sprechen
    const t = setTimeout(() => {
      speech.speak(SCRIPT.welcome, 'high')
      setShowButtons(true)
    }, 400)
    return () => clearTimeout(t)
  }, [])

  const handleMenuButton = (screen: Screen, text: string) => {
    speech.speak(text, 'high')
    setTimeout(() => onNavigate(screen), 800)
  }

  return (
    <div className="start-screen">
      <div className="start-screen__header">
        <h1 className="start-screen__title" aria-label="Einhorn Schach">
          🦄 Einhorn Schach
        </h1>
        <p className="start-screen__subtitle">Lerne Schach mit Stella!</p>
      </div>

      <div className="start-screen__unicorn">
        <Unicorn mood="happy" size={180} />
      </div>

      {showButtons && (
        <nav className="start-screen__nav" aria-label="Hauptmenü">
          <button
            className="menu-btn menu-btn--learn"
            onClick={() => handleMenuButton('learn', SCRIPT.menuLearn)}
            aria-label="Lernen"
          >
            <span className="menu-btn__icon">📖</span>
            <span className="menu-btn__label">Lernen</span>
          </button>

          <button
            className="menu-btn menu-btn--puzzle"
            onClick={() => handleMenuButton('puzzle', SCRIPT.menuPuzzle)}
            aria-label="Rätsel"
          >
            <span className="menu-btn__icon">🧩</span>
            <span className="menu-btn__label">Rätsel</span>
          </button>

          <button
            className="menu-btn menu-btn--play"
            onClick={() => handleMenuButton('play', SCRIPT.menuPlay)}
            aria-label="Spielen"
          >
            <span className="menu-btn__icon">♟</span>
            <span className="menu-btn__label">Spielen</span>
          </button>
        </nav>
      )}
    </div>
  )
}
