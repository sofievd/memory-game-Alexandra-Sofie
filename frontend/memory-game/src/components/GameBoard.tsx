import { PenguinCard } from './PenguinCard'

type GameBoardProps = {
  cards: number[]
  matchedIndices: number[]
  selectedIndices: number[]
  disabled: boolean
  onCardClick: (index: number) => void
}

function GameBoard({ cards, matchedIndices, selectedIndices, disabled, onCardClick }: GameBoardProps) {
  const matchedSet = new Set(matchedIndices)
  const selectedSet = new Set(selectedIndices)

  return (
    <section className="board-section">
      <div className="board-header">
        <h2>Penguin board</h2>
        <p>Match two cards with the same penguin number.</p>
      </div>

      <div className="board">
        {cards.map((value, index) => (
          <PenguinCard
            key={index}
            value={value}
            index={index}
            isMatched={matchedSet.has(index)}
            isSelected={selectedSet.has(index)}
            disabled={disabled || matchedSet.has(index)}
            onClick={() => onCardClick(index)}
          />
        ))}
      </div>
    </section>
  )
}

export default GameBoard

