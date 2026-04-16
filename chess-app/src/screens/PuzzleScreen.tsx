import { useState, useEffect, useCallback } from 'react'
import { Chess, type Square as ChessSquare } from 'chess.js'
import Unicorn, { type UnicornMood } from '../components/Unicorn'
import ChessBoard from '../components/ChessBoard'
import { speech } from '../hooks/useSpeech'
import { SCRIPT } from '../content/script'
import { PUZZLES } from '../content/puzzles'
import type { Screen } from '../types'
import './PuzzleScreen.css'

interface PuzzleScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function PuzzleScreen({ onNavigate }: PuzzleScreenProps) {
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [chess, setChess] = useState(() => {
    const c = new Chess()
    c.load(PUZZLES[0].fen)
    return c
  })
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [validMoves, setValidMoves] = useState<string[]>([])
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)
  const [hintSquares, setHintSquares] = useState<string[]>([])
  const [mood, setMood] = useState<UnicornMood>('happy')
  const [solved, setSolved] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)

  const puzzle = PUZZLES[puzzleIndex]

  // Neues Rätsel laden
  const loadPuzzle = useCallback((index: number) => {
    const p = PUZZLES[index]
    const c = new Chess()
    c.load(p.fen)
    setChess(c)
    setSelectedSquare(null)
    setValidMoves([])
    setLastMove(null)
    setHintSquares([])
    setSolved(false)
    setHintsUsed(0)
    setMood('thinking')
    speech.speak(p.intro, 'high')
    setTimeout(() => setMood('happy'), 3000)
  }, [])

  useEffect(() => {
    loadPuzzle(0)
  }, [loadPuzzle])

  const handleSquareClick = useCallback((square: string) => {
    if (solved) return
    const piece = chess.get(square as Parameters<typeof chess.get>[0])

    // Figur auswählen (nur Spieler-Farbe)
    if (!selectedSquare) {
      if (!piece || piece.color !== puzzle.playerColor) {
        speech.speak(piece ? SCRIPT.feedback.notYourPiece : SCRIPT.feedback.noPieceSelected)
        return
      }
      setSelectedSquare(square)
      const moves = chess.moves({ square: square as ChessSquare, verbose: true })
      setValidMoves(moves.map((m) => (typeof m === 'string' ? m : m.to)))
      return
    }

    // Gleiches Feld → Auswahl aufheben
    if (selectedSquare === square) {
      setSelectedSquare(null)
      setValidMoves([])
      return
    }

    // Andere eigene Figur → wechseln
    if (piece && piece.color === puzzle.playerColor) {
      setSelectedSquare(square)
      const moves = chess.moves({ square: square as ChessSquare, verbose: true })
      setValidMoves(moves.map((m) => (typeof m === 'string' ? m : m.to)))
      return
    }

    // Zug versuchen
    const moveKey = `${selectedSquare}${square}`
    const isSolution = puzzle.solutions.some(s => s.startsWith(moveKey))

    try {
      // Bauern-Umwandlung automatisch zur Dame
      const result = chess.move({ from: selectedSquare, to: square, promotion: 'q' })
      if (!result) throw new Error()

      setLastMove({ from: selectedSquare, to: square })
      setSelectedSquare(null)
      setValidMoves([])
      setHintSquares([])

      if (isSolution) {
        // ✓ Richtig!
        setSolved(true)
        setMood('excited')
        speech.speak(puzzle.successMessage, 'high')
        setTimeout(() => speech.speak(puzzle.concept), 1500)
        setTimeout(() => setMood('happy'), 4000)
      } else {
        // Zug ist regelkonform aber falsch → zurücksetzen nach kurzer Pause
        setMood('sad')
        speech.speak(SCRIPT.feedback.wrong[Math.floor(Math.random() * SCRIPT.feedback.wrong.length)], 'high')
        setTimeout(() => {
          const c = new Chess()
          c.load(puzzle.fen)
          setChess(c)
          setLastMove(null)
          setMood('thinking')
          setTimeout(() => setMood('happy'), 1500)
        }, 1800)
      }
    } catch {
      // Ungültiger Zug
      setSelectedSquare(null)
      setValidMoves([])
      speech.speak(SCRIPT.feedback.invalidMove)
    }
  }, [chess, selectedSquare, solved, puzzle])

  const handleHint = () => {
    if (solved) return
    setHintsUsed(h => h + 1)
    const solution = puzzle.solutions[0]
    const from = solution.substring(0, 2)
    const to = solution.substring(2, 4)
    setHintSquares([from, to])
    speech.speak(hintsUsed === 0 ? SCRIPT.feedback.hint : puzzle.hint, 'high')
    setTimeout(() => setHintSquares([]), 3000)
  }

  const handleNextPuzzle = () => {
    if (puzzleIndex < PUZZLES.length - 1) {
      setPuzzleIndex(i => i + 1)
      loadPuzzle(puzzleIndex + 1)
    } else {
      speech.speak(SCRIPT.puzzle.allSolved, 'high')
      setMood('excited')
      setTimeout(() => onNavigate('menu'), 4000)
    }
  }

  return (
    <div className="puzzle-screen">
      {/* Header */}
      <div className="puzzle-screen__header">
        <button
          className="back-btn"
          onClick={() => { speech.stop(); onNavigate('menu') }}
          aria-label="Zurück"
        >←</button>
        <div className="puzzle-screen__progress">
          {PUZZLES.map((_, i) => (
            <span
              key={i}
              className={`progress-dot ${i < puzzleIndex ? 'progress-dot--done' : i === puzzleIndex ? 'progress-dot--current' : ''}`}
            />
          ))}
        </div>
        <div style={{ width: 44 }} />
      </div>

      {/* Einhorn + Titel */}
      <div className="puzzle-screen__top">
        <Unicorn mood={mood} size={100} />
        <div className="puzzle-screen__info">
          <h2 className="puzzle-screen__title">{puzzle.title}</h2>
          <p className="puzzle-screen__number">Rätsel {puzzleIndex + 1} / {PUZZLES.length}</p>
        </div>
      </div>

      {/* Brett */}
      <ChessBoard
        chess={chess}
        playerColor={puzzle.playerColor}
        selectedSquare={selectedSquare}
        validMoves={validMoves}
        lastMove={lastMove}
        highlightSquares={hintSquares}
        onSquareClick={handleSquareClick}
        disabled={solved}
      />

      {/* Aktions-Buttons */}
      <div className="puzzle-screen__actions">
        {!solved ? (
          <button className="action-btn action-btn--hint" onClick={handleHint}>
            💡 Tipp
          </button>
        ) : (
          <button className="action-btn action-btn--next" onClick={handleNextPuzzle}>
            Weiter ➜
          </button>
        )}
      </div>
    </div>
  )
}
