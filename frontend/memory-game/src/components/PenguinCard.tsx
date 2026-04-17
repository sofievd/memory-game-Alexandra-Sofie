import penguin_0_0 from '../assets/penguin_0_0.png'
import penguin_0_1 from '../assets/penguin_0_1.png'
import penguin_0_2 from '../assets/penguin_0_2.png'
import penguin_0_3 from '../assets/penguin_0_3.png'
import penguin_1_0 from '../assets/penguin_1_0.png'
import penguin_1_1 from '../assets/penguin_1_1.png'
import penguin_1_2 from '../assets/penguin_1_2.png'
import penguin_1_3 from '../assets/penguin_1_3.png'

type PenguinCardProps = {
  value: number
  isMatched: boolean
  isSelected: boolean
  disabled: boolean
  onClick: () => void
}

const penguinImages = {
  1: penguin_0_0,
  2: penguin_0_1,
  3: penguin_0_2,
  4: penguin_0_3,
  5: penguin_1_0,
  6: penguin_1_1,
  7: penguin_1_2,
  8: penguin_1_3,
} as const

export function PenguinCard({ value, isMatched, isSelected, disabled, onClick }: PenguinCardProps) {
  const showFace = isMatched || isSelected

  return (
    <button
      className={`card w-full p-1 ${showFace ? 'card--open' : ''} ${isMatched ? 'card--matched' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {/*<span className="card__label">{index + 1}</span>*/}
      <span className="card__face">
        {showFace ? <img src={penguinImages[value as keyof typeof penguinImages]} alt={`Penguin ${value}`} /> : '❓'}
      </span>
    </button>
  )
}


