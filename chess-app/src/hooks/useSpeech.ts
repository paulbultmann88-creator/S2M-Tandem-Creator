/**
 * Speech Engine für Einhorn Schach
 *
 * Strategie:
 * 1. Versuche pre-generierte MP3 (Microsoft KatjaNeural – sehr natürlich)
 * 2. Fallback auf Web Speech API falls MP3 nicht vorhanden
 *
 * iOS-Fix: unlock() muss beim ersten Nutzer-Tap aufgerufen werden.
 */

export type SpeechPriority = 'normal' | 'high'

// ── Text → Dateiname (identisch mit generate_audio.py) ────────────────────
function textToSlug(text: string): string {
  const umlauts: [string, string][] = [
    ['ä','ae'],['ö','oe'],['ü','ue'],['ß','ss'],
    ['Ä','ae'],['Ö','oe'],['Ü','ue'],
  ]
  let s = text
  for (const [from, to] of umlauts) s = s.replaceAll(from, to)
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60)
}

// Vite stellt BASE_URL bereit (/  lokal, /S2M-Tandem-Creator/ auf GitHub Pages)
const BASE = import.meta.env.BASE_URL

// ── Interne Queue-Einträge ─────────────────────────────────────────────────
interface Entry {
  text: string
  priority: SpeechPriority
}

class SpeechEngine {
  private queue: Entry[] = []
  private busy = false
  private currentAudio: HTMLAudioElement | null = null
  private unlocked = false

  // Web-Speech-Fallback-Infrastruktur
  private wsVoice: SpeechSynthesisVoice | null = null

  constructor() {
    if ('speechSynthesis' in window) {
      this.loadWSVoice()
      window.speechSynthesis.onvoiceschanged = () => this.loadWSVoice()
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) window.speechSynthesis.pause()
        else window.speechSynthesis.resume()
      })
    }
  }

  private loadWSVoice() {
    const voices = window.speechSynthesis.getVoices()
    const preferred = ['Anna', 'Helena', 'Petra', 'Google Deutsch', 'Microsoft Katja']
    for (const name of preferred) {
      const v = voices.find(v => v.name.includes(name))
      if (v) { this.wsVoice = v; return }
    }
    this.wsVoice = voices.find(v => v.lang.startsWith('de')) ?? null
  }

  /** Beim ersten Tap aufrufen – entsperrt Audio auf iOS */
  unlock() {
    if (this.unlocked) return
    this.unlocked = true
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(' ')
      u.volume = 0
      window.speechSynthesis.speak(u)
    }
    // Leiser Audio-Ping um iOS Audio-Kontext zu aktivieren
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const buf = ctx.createBuffer(1, 1, 22050)
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.connect(ctx.destination)
    src.start(0)
  }

  speak(text: string, priority: SpeechPriority = 'normal') {
    if (priority === 'high') {
      this.stop()
    }
    this.queue.push({ text, priority })
    if (!this.busy) this.processQueue()
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.src = ''
      this.currentAudio = null
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    this.queue = []
    this.busy = false
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.busy = false
      return
    }
    this.busy = true
    const { text } = this.queue.shift()!

    const played = await this.tryMP3(text)
    if (!played) {
      await this.speakWS(text)
    }

    this.processQueue()
  }

  /** Versucht die pre-generierte MP3 abzuspielen. Gibt true zurück wenn erfolgreich. */
  private tryMP3(text: string): Promise<boolean> {
    return new Promise(resolve => {
      const slug = textToSlug(text)
      const url = `${BASE}audio/${slug}.mp3`
      const audio = new Audio(url)
      this.currentAudio = audio

      let done = false
      const finish = (success: boolean) => {
        if (done) return
        done = true
        this.currentAudio = null
        resolve(success)
      }

      // Sicherheitsnetz: maximal Text-Länge × 150ms + 3s warten
      const timeout = setTimeout(
        () => finish(false),
        text.length * 150 + 3000
      )

      audio.onended = () => { clearTimeout(timeout); finish(true) }
      audio.onerror = () => { clearTimeout(timeout); finish(false) }

      audio.play().catch(() => { clearTimeout(timeout); finish(false) })
    })
  }

  /** Web Speech API Fallback */
  private speakWS(text: string): Promise<void> {
    return new Promise(resolve => {
      if (!('speechSynthesis' in window)) { resolve(); return }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang    = 'de-DE'
      utterance.rate    = 0.88
      utterance.pitch   = 1.15
      utterance.volume  = 1.0
      if (this.wsVoice) utterance.voice = this.wsVoice

      let done = false
      const finish = () => { if (!done) { done = true; resolve() } }

      const safety = setTimeout(finish, text.length * 120 + 2000)
      utterance.onend   = () => { clearTimeout(safety); finish() }
      utterance.onerror = () => { clearTimeout(safety); finish() }

      window.speechSynthesis.speak(utterance)
    })
  }
}

export const speech = new SpeechEngine()
