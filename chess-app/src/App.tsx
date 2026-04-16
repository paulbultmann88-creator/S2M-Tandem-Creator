import { useState } from 'react'
import { speech } from './hooks/useSpeech'
import Unicorn from './components/Unicorn'
import StartScreen from './screens/StartScreen'
import LearnScreen from './screens/LearnScreen'
import PuzzleScreen from './screens/PuzzleScreen'
import PlayScreen from './screens/PlayScreen'
import type { Screen } from './types'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')

  // iOS erfordert einen User-Tap bevor Audio abgespielt werden kann
  const handleSplashTap = () => {
    speech.unlock()
    setScreen('menu')
  }

  return (
    <div className="app">
      {screen === 'splash' && (
        <div className="splash-screen" onClick={handleSplashTap} role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleSplashTap()}
          aria-label="Antippen zum Starten">
          <div className="splash-screen__content">
            <Unicorn mood="happy" size={200} animate />
            <h1 className="splash-screen__title">Einhorn Schach</h1>
            <div className="splash-screen__tap-hint">
              <span className="tap-pulse">👆</span>
              <span>Antippen zum Starten!</span>
            </div>
          </div>
        </div>
      )}

      {screen === 'menu' && (
        <StartScreen onNavigate={setScreen} />
      )}

      {screen === 'learn' && (
        <LearnScreen onNavigate={setScreen} />
      )}

      {screen === 'puzzle' && (
        <PuzzleScreen onNavigate={setScreen} />
      )}

      {screen === 'play' && (
        <PlayScreen onNavigate={setScreen} />
      )}
    </div>
  )
}
