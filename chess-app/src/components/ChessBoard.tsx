import { useCallback, useMemo } from 'react'
import { Chess } from 'chess.js'
import type { PieceType, PieceColor } from '../types'
import './ChessBoard.css'

// Unicode-Symbole pro Figur
const PIECE_SYMBOLS: Record<PieceType, Record<PieceColor, string>> = {
  k: { w: '♔', b: '♚' },
  q: { w: '♕', b: '♛' },
  r: { w: '♖', b: '♜' },
  b: { w: '♗', b: '♝' },
  n: { w: '♘', b: '♞' },
  p: { w: '♙', b: '♟' },
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

interface ChessBoardProps {
  chess: Chess
  playerColor: 'w' | 'b'
  selectedSquare: string | null
  validMoves: string[]
  lastMove: { from: string; to: string } | null
  highlightSquares?: string[]
  onSquareClick: (square: string) => void
  disabled?: boolean
}

export default function ChessBoard({
  chess,
  playerColor,
  selectedSquare,
  validMoves,
  lastMove,
  highlightSquares = [],
  onSquareClick,
  disabled = false,
}: ChessBoardProps) {
  const board = useMemo(() => chess.board(), [chess])

  // Reihenfolge: Spieler-Farbe immer unten
  const rows = useMemo(() => {
    const r = [0, 1, 2, 3, 4, 5, 6, 7]
    return playerColor === 'w' ? r : [...r].reverse()
  }, [playerColor])

  const cols = useMemo(() => {
    const c = [0, 1, 2, 3, 4, 5, 6, 7]
    return playerColor === 'w' ? c : [...c].reverse()
  }, [playerColor])

  const getSquareName = useCallback(
    (rowIdx: number, colIdx: number): string => FILES[colIdx] + (8 - rowIdx),
    []
  )

  return (
    <div className="chess-board" role="grid" aria-label="Schachbrett">
      {rows.map(rowIdx => (
        <div key={rowIdx} className="chess-board__row" role="row">
          {cols.map(colIdx => {
            const square = getSquareName(rowIdx, colIdx)
            const piece = board[rowIdx][colIdx]
            const isLight = (rowIdx + colIdx) % 2 === 0

            const isSelected   = square === selectedSquare
            const isValidMove  = validMoves.includes(square)
            const isLastMoveFrom = lastMove?.from === square
            const isLastMoveTo   = lastMove?.to   === square
            const isHint         = highlightSquares.includes(square)
            const isInCheck      = chess.isCheck() &&
                                   piece?.type === 'k' &&
                                   piece.color === chess.turn()

            const classes = [
              'chess-board__square',
              isLight ? 'chess-board__square--light' : 'chess-board__square--dark',
              isSelected      && 'chess-board__square--selected',
              isValidMove     && 'chess-board__square--valid',
              isLastMoveFrom  && 'chess-board__square--last-from',
              isLastMoveTo    && 'chess-board__square--last-to',
              isHint          && 'chess-board__square--hint',
              isInCheck       && 'chess-board__square--check',
              disabled        && 'chess-board__square--disabled',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <button
                key={square}
                className={classes}
                role="gridcell"
                aria-label={`${square}${piece ? ` ${piece.color === 'w' ? 'weiß' : 'schwarz'} ${piece.type}` : ''}`}
                onClick={() => !disabled && onSquareClick(square)}
                style={{ touchAction: 'manipulation' }}
              >
                {/* Gültige-Züge-Indikator */}
                {isValidMove && !piece && (
                  <span className="chess-board__dot" aria-hidden="true" />
                )}
                {isValidMove && piece && (
                  <span className="chess-board__capture-ring" aria-hidden="true" />
                )}

                {/* Figur */}
                {piece && (
                  <span
                    className={`chess-board__piece chess-board__piece--${piece.color}`}
                    aria-hidden="true"
                  >
                    {PIECE_SYMBOLS[piece.type][piece.color]}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
