import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import penguin_0_0 from './assets/penguin_0_0.png'
import penguin_0_1 from './assets/penguin_0_1.png'
import penguin_0_2 from './assets/penguin_0_2.png'
import penguin_0_3 from './assets/penguin_0_3.png'
import penguin_1_0 from './assets/penguin_1_0.png'
import penguin_1_1 from './assets/penguin_1_1.png'
import penguin_1_2 from './assets/penguin_1_2.png'
import penguin_1_3 from './assets/penguin_1_3.png'

type GameState = {
  playerName: string
  cards: number[]
  matchedIndices: number[]
  score: number
  moves: number
  finished: boolean
}

type FlipResult = {
  match: boolean
  message: string
  firstIndex: number
  secondIndex: number
  firstValue: number
  secondValue: number
  game: GameState
}

const DEFAULT_NAME = 'Sofie'
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

function App() {
  const [playerName, setPlayerName] = useState(DEFAULT_NAME)
  const [game, setGame] = useState<GameState | null>(null)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [isRevealingMismatch, setIsRevealingMismatch] = useState(false)
  const [message, setMessage] = useState('Start a game to begin matching penguins.')
  const [isBusy, setIsBusy] = useState(false)
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const matchedSet = useMemo(() => new Set(game?.matchedIndices ?? []), [game])

  function clearRevealTimeout() {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current)
      revealTimeoutRef.current = null
    }
  }

  useEffect(() => clearRevealTimeout, [])

  async function startGame() {
    const trimmedName = playerName.trim()
    if (!trimmedName) {
      setMessage('Please enter a player name.')
      return
    }

    clearRevealTimeout()
    setSelectedIndices([])
    setIsRevealingMismatch(false)
    setIsBusy(true)
    try {
      const response = await fetch(`/game/${encodeURIComponent(trimmedName)}`, {
        method: 'POST',
      })

      if (!response.ok) {
        setMessage('Could not start the game.')
        return
      }

      const data = (await response.json()) as GameState
      setGame(data)
      setSelectedIndices([])
      setMessage('Pick two penguin cards that match!')
    } catch {
      setMessage('Backend not available yet. Make sure the Java app is running.')
    } finally {
      setIsBusy(false)
    }
  }

  async function flipCards(firstIndex: number, secondIndex: number) {
    if (!game) return

    clearRevealTimeout()
    setIsBusy(true)
    try {
      const response = await fetch(`/game/${encodeURIComponent(game.playerName)}/flip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstIndex, secondIndex }),
      })

      if (!response.ok) {
        setMessage('Could not flip cards.')
        return
      }

      const data = (await response.json()) as FlipResult
      setGame(data.game)
      if (data.match) {
        setSelectedIndices([])
        setIsRevealingMismatch(false)
        setMessage(data.message)
      } else {
        setIsRevealingMismatch(true)
        setMessage(`${data.message} Flipping back in 4 seconds.`)
        revealTimeoutRef.current = setTimeout(() => {
          setSelectedIndices([])
          setIsRevealingMismatch(false)
          revealTimeoutRef.current = null
        }, 1000)
      }
    } catch {
      setMessage('Could not reach the backend.')
      setSelectedIndices([])
      setIsRevealingMismatch(false)
    } finally {
      setIsBusy(false)
    }
  }

  function handleCardClick(index: number) {
    if (!game || isBusy || isRevealingMismatch || game.finished || matchedSet.has(index)) {
      return
    }

    if (selectedIndices.length === 0) {
      setSelectedIndices([index])
      setMessage('Now choose a second card.')
      return
    }

    if (selectedIndices.length === 1) {
      if (selectedIndices[0] === index) return
      const [firstIndex] = selectedIndices
      setSelectedIndices([firstIndex, index])
      void flipCards(firstIndex, index)
    }
  }

  const selectedSet = useMemo(() => new Set(selectedIndices), [selectedIndices])

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Penguin Memory Game</p>
          <h1>Find all matching penguin pairs</h1>
          <p className="lead">
            Flip two cards at a time, remember where the penguins are, and clear the
            board with the fewest moves.
          </p>
        </div>
        <div className="controls">
          <label className="field">
            <span>Player name</span>
            <input
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Enter your name"
            />
          </label>
          <button className="primary-button" onClick={startGame} disabled={isBusy}>
            {game ? 'Restart game' : 'Start game'}
          </button>
          <p className="status">{message}</p>
        </div>
      </section>

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

      <section className="board-section">
        <div className="board-header">
          <h2>Penguin board</h2>
          <p>Match two cards with the same penguin number.</p>
        </div>

        <div className="board">
          {(game?.cards ?? Array.from({ length: 16 }, (_, index) => index + 1)).map(
            (value, index) => {
              const isMatched = matchedSet.has(index)
              const isSelected = selectedSet.has(index)
              const showFace = isMatched || isSelected

              return (
                <button
                  key={index}
                  className={`card ${showFace ? 'card--open' : ''} ${
                    isMatched ? 'card--matched' : ''
                  }`}
                  onClick={() => handleCardClick(index)}
                  disabled={!game || isBusy || isRevealingMismatch || isMatched || game.finished}
                >
                  <span className="card__label">{index + 1}</span>
                  <span className="card__face">
                    {showFace ? <img src={penguinImages[value as keyof typeof penguinImages]} alt={`Penguin ${value}`} /> : '❓'}
                  </span>
                </button>
              )
            },
          )}
        </div>
      </section>
    </main>
  )
}

export default App
