export type Screen = 'splash' | 'menu' | 'learn' | 'puzzle' | 'play'

export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p'
export type PieceColor = 'w' | 'b'

export interface Piece {
  type: PieceType
  color: PieceColor
}

export type Square = string // z.B. 'e4'

export interface BoardSquare {
  square: Square
  piece: Piece | null
  isLight: boolean
}
