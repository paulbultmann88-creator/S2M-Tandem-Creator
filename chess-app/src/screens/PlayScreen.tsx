import { useState, useEffect, useCallback, useRef } from 'react'
import { Chess, type Square as ChessSquare } from 'chess.js'
import Unicorn, { type UnicornMood } from '../components/Unicorn'
import ChessBoard from '../components/ChessBoard'
import { speech } from '../hooks/useSpeech'
import { SCRIPT } from '../content/script'
import type { Screen } from '../types'
import './PlayScreen.css'

interface PlayScreenProps {
  onNavigate: (screen: Screen) => void
}

// Bewertung einer Figur für KI-Entscheidungen
const PIECE_VALUE: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
}

/** Sehr schwache KI – zufällige Züge, gelegentlich schlägt sie */
function getAIMove(chess: Chess): { from: string; to: string; promotion?: string } | null {
  const moves = chess.moves({ verbose: true })
  if (moves.length === 0) return null

  // 35% Chance: Schau ob KI eine Figur schlagen kann
  const captures = moves.filter(m => m.captured)
  if (captures.length > 0 && Math.random() < 0.35) {
    // Wähle den wertvollsten Schlag
    const best = captures.reduce((a, b) =>
      (PIECE_VALUE[b.captured!] ?? 0) > (PIECE_VALUE[a.captured!] ?? 0) ? b : a
    )
    return { from: best.from, to: best.to, promotion: 'q' }
  }

  // Ansonsten zufälliger Zug
  const move = moves[Math.floor(Math.random() * moves.length)]
  return { from: move.from, to: move.to, promotion: 'q' }
}

export default function PlayScreen({ onNavigate }: PlayScreenProps) {
  const [chess] = useState(() => new Chess())
  const [, forceUpdate] = useState(0)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [validMoves, setValidMoves] = useState<string[]>([])
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)
  const [mood, setMood] = useState<UnicornMood>('happy')
  const [gameOver, setGameOver] = useState(false)
  const [gameMessage, setGameMessage] = useState('')
  const [aiThinking, setAiThinking] = useState(false)
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const refresh = () => forceUpdate(n => n + 1)

  const endGame = useCallback((message: string, m: UnicornMood) => {
    setGameOver(true)
    setGameMessage(message)
    setMood(m)
    speech.speak(message, 'high')
  }, [])

  const handleAIMove = useCallback(() => {
    if (chess.isGameOver()) return
    setAiThinking(true)
    setMood('thinking')
    speech.speak(SCRIPT.ai.thinking)

    // Kurze Verzögerung damit es sich menschlich anfühlt
    aiTimerRef.current = setTimeout(() => {
      const move = getAIMove(chess)
      if (!move) return

      chess.move(move)
      setLastMove({ from: move.from, to: move.to })
      setAiThinking(false)
      refresh()

      // KI-Kommentar
      if (chess.isCheckmate()) {
        endGame(SCRIPT.feedback.checkmateLose, 'sad')
        return
      }
      if (chess.isDraw()) {
        endGame(SCRIPT.feedback.draw, 'happy')
        return
      }
      if (chess.isCheck()) {
        setMood('excited')
        speech.speak(SCRIPT.feedback.check, 'high')
      } else if (move.promotion) {
        speech.speak(SCRIPT.ai.iAttack)
        setMood('excited')
      } else {
        setMood('happy')
        speech.speak(SCRIPT.ai.iMadeMove)
      }
    }, 900 + Math.random() * 600)
  }, [chess, endGame])

  // Spieler-Zug → danach KI
  const handleSquareClick = useCallback((square: string) => {
    if (gameOver || aiThinking || chess.turn() !== 'w') return

    const piece = chess.get(square as Parameters<typeof chess.get>[0])

    if (!selectedSquare) {
      if (!piece || piece.color !== 'w') {
        if (piece) speech.speak(SCRIPT.feedback.notYourPiece)
        return
      }
      setSelectedSquare(square)
      const moves = chess.moves({ square: square as ChessSquare, verbose: true })
      setValidMoves(moves.map((m) => (typeof m === 'string' ? m : m.to)))
      return
    }

    if (selectedSquare === square) {
      setSelectedSquare(null)
      setValidMoves([])
      return
    }

    if (piece && piece.color === 'w') {
      setSelectedSquare(square)
      const moves = chess.moves({ square: square as ChessSquare, verbose: true })
      setValidMoves(moves.map((m) => (typeof m === 'string' ? m : m.to)))
      return
    }

    // Zug ausführen
    try {
      const result = chess.move({ from: selectedSquare, to: square, promotion: 'q' })
      if (!result) throw new Error()

      setLastMove({ from: selectedSquare, to: square })
      setSelectedSquare(null)
      setValidMoves([])
      refresh()

      if (chess.isCheckmate()) {
        endGame(SCRIPT.feedback.checkmateWin, 'excited')
        return
      }
      if (chess.isDraw()) {
        endGame(SCRIPT.feedback.draw, 'happy')
        return
      }
      if (chess.isCheck()) {
        speech.speak(SCRIPT.feedback.checkByPlayer)
        setMood('excited')
      } else {
        const correctPhrases = SCRIPT.feedback.correct
        speech.speak(correctPhrases[Math.floor(Math.random() * correctPhrases.length)])
        setMood('happy')
      }

      // KI zieht
      handleAIMove()
    } catch {
      setSelectedSquare(null)
      setValidMoves([])
      speech.speak(SCRIPT.feedback.invalidMove)
    }
  }, [chess, selectedSquare, gameOver, aiThinking, handleAIMove, endGame])

  // Spiel neu starten
  const handleRestart = () => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current)
    chess.reset()
    setSelectedSquare(null)
    setValidMoves([])
    setLastMove(null)
    setGameOver(false)
    setGameMessage('')
    setAiThinking(false)
    setMood('happy')
    refresh()
    speech.speak('Neues Spiel! Du fängst an!', 'high')
  }

  useEffect(() => {
    speech.speak('Ich bin Stella. Du spielst Weiß! Du fängst an!', 'high')
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current)
    }
  }, [])

  const isPlayerTurn = !gameOver && !aiThinking && chess.turn() === 'w'

  return (
    <div className="play-screen">
      {/* Header */}
      <div className="play-screen__header">
        <button
          className="back-btn"
          onClick={() => { speech.stop(); if (aiTimerRef.current) clearTimeout(aiTimerRef.current); onNavigate('menu') }}
          aria-label="Zurück"
        >←</button>
        <h2 className="play-screen__title">Spielen</h2>
        <button
          className="restart-btn"
          onClick={handleRestart}
          aria-label="Neu starten"
        >🔄</button>
      </div>

      {/* Status-Leiste */}
      <div className={`play-screen__status ${isPlayerTurn ? 'play-screen__status--player' : 'play-screen__status--ai'}`}>
        <span>
          {gameOver ? '🏁 Spiel beendet'
            : aiThinking ? '🤔 Stella überlegt...'
            : chess.isCheck() ? '⚠️ Schach! Rette deinen König!'
            : isPlayerTurn ? '⭐ Du bist dran!'
            : '🔄 Stella zieht...'}
        </span>
      </div>

      {/* Einhorn */}
      <div className="play-screen__unicorn">
        <Unicorn mood={mood} size={90} />
      </div>

      {/* Brett */}
      <ChessBoard
        chess={chess}
        playerColor="w"
        selectedSquare={selectedSquare}
        validMoves={validMoves}
        lastMove={lastMove}
        onSquareClick={handleSquareClick}
        disabled={!isPlayerTurn}
      />

      {/* Spiel-Ende Banner */}
      {gameOver && (
        <div className="game-over-banner">
          <p className="game-over-banner__text">{gameMessage}</p>
          <button className="action-btn action-btn--restart" onClick={handleRestart}>
            🎮 Nochmal spielen!
          </button>
        </div>
      )}
    </div>
  )
}
