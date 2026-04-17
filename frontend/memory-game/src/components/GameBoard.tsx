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
    <section className="board-section w-full min-h-0 max-h-[100dvh] overflow-y-auto overflow-x-hidden p-2 sm:p-3">
      {/*<div className="board-header">*/}
      {/*  <h2>Penguin board</h2>*/}
      {/*  <p>Match two cards with the same penguin number.</p>*/}
      {/*</div>*/}

      <div className="w-full min-h-0">
        <div className="board grid grid-cols-4 gap-2 sm:gap-3 p-1 sm:p-2 w-full max-w-[720px] mx-auto">
          {cards.map((value, index) => (
            <div key={index} className="aspect-square w-full min-w-0">
              <PenguinCard
                value={value}
                isMatched={matchedSet.has(index)}
                isSelected={selectedSet.has(index)}
                disabled={disabled || matchedSet.has(index)}
                onClick={() => onCardClick(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GameBoard

