import type { GameState } from '../types/game'

type ScoreboardProps = {
  game: GameState | null
}

function Scoreboard({ game }: ScoreboardProps) {
  return (
    <section className="scoreboard">
      <div>
        <span>Score</span>
        <strong>{game?.score ?? 0}</strong>
      </div>
      <div>
        <span>Moves</span>
        <strong>{game?.moves ?? 0}</strong>
      </div>
      <div>
        <span>Matched pairs</span>
        <strong>{game ? game.matchedIndices.length / 2 : 0}/8</strong>
      </div>
      <div>
        <span>Status</span>
        <strong>{game?.finished ? 'Completed' : 'Playing'}</strong>
      </div>
    </section>
  )
}

export default Scoreboard

