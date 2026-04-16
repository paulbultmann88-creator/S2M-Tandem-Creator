/**
 * Speech Engine für Einhorn Schach
 *
 * iOS-Probleme die wir lösen:
 * 1. Audio braucht einen User-Gesture zum Starten → SpeechEngine.unlock() beim ersten Tap
 * 2. Stimmenladung ist asynchron → onvoiceschanged event
 * 3. Sätze brechen ab → Queue-System mit Prioritäten
 * 4. iOS Safari pausiert speechSynthesis im Hintergrund → visibilitychange guard
 */

export type SpeechPriority = 'normal' | 'high'

class SpeechEngine {
  private queue: Array<{ text: string; priority: SpeechPriority }> = []
  private isSpeaking = false
  private voice: SpeechSynthesisVoice | null = null
  private unlocked = false

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices()
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices()
      // iOS pausiert TTS wenn Tab im Hintergrund
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          window.speechSynthesis.pause()
        } else {
          window.speechSynthesis.resume()
        }
      })
    }
  }

  private loadVoices() {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length === 0) return

    // Präferenz-Reihenfolge: Apple Anna (iOS), Google Deutsch, dann jede DE-Stimme
    const preferred = ['Anna', 'Helena', 'Petra', 'Google Deutsch', 'Microsoft Katja']
    for (const name of preferred) {
      const found = voices.find(v => v.name.includes(name))
      if (found) {
        this.voice = found
        return
      }
    }
    // Fallback: irgendeine deutsche Stimme
    this.voice = voices.find(v => v.lang.startsWith('de')) ?? voices[0] ?? null
  }

  /** Muss beim ersten Nutzer-Tap aufgerufen werden (iOS-Anforderung) */
  unlock() {
    if (this.unlocked) return
    this.unlocked = true
    // Leiser Test-Utterance um Audio-Kontext zu öffnen
    const u = new SpeechSynthesisUtterance(' ')
    u.volume = 0
    window.speechSynthesis.speak(u)
  }

  speak(text: string, priority: SpeechPriority = 'normal') {
    if (!('speechSynthesis' in window)) return

    if (priority === 'high') {
      // Alles abbrechen und sofort sprechen
      window.speechSynthesis.cancel()
      this.queue = []
      this.isSpeaking = false
    }

    this.queue.push({ text, priority })
    if (!this.isSpeaking) {
      this.processQueue()
    }
  }

  stop() {
    window.speechSynthesis.cancel()
    this.queue = []
    this.isSpeaking = false
  }

  private processQueue() {
    if (this.queue.length === 0) {
      this.isSpeaking = false
      return
    }

    this.isSpeaking = true
    const { text } = this.queue.shift()!

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'de-DE'
    utterance.rate = 0.88   // etwas langsamer für Kinder
    utterance.pitch = 1.15  // etwas höher, freundlicher
    utterance.volume = 1.0

    if (this.voice) {
      utterance.voice = this.voice
    }

    // iOS Workaround: speechSynthesis hängt manchmal → Timeout als Sicherheitsnetz
    let finished = false
    const safetyTimer = setTimeout(() => {
      if (!finished) {
        finished = true
        this.isSpeaking = false
        this.processQueue()
      }
    }, text.length * 120 + 2000)

    utterance.onend = () => {
      if (!finished) {
        finished = true
        clearTimeout(safetyTimer)
        this.processQueue()
      }
    }
    utterance.onerror = () => {
      if (!finished) {
        finished = true
        clearTimeout(safetyTimer)
        this.processQueue()
      }
    }

    window.speechSynthesis.speak(utterance)
  }
}

// Singleton – einmal erzeugen, überall nutzen
export const speech = new SpeechEngine()
