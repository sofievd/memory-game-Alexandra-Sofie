export type GameState = {
  playerName: string
  cards: number[]
  matchedIndices: number[]
  score: number
  moves: number
  finished: boolean
}

export type FlipResult = {
  match: boolean
  message: string
  firstIndex: number
  secondIndex: number
  firstValue: number
  secondValue: number
  game: GameState
}

