import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import GameBoard from './components/GameBoard'
import GameHeader from './components/GameHeader'
import Scoreboard from './components/Scoreboard'
import type { FlipResult, GameState } from './types/game'

const DEFAULT_NAME = 'Sofie'
const fallbackCards = Array.from({ length: 16 }, (_, index) => index + 1)

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
        setMessage(`${data.message} Flipping back in 1 second.`)
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

  return (
    <main className="app-shell">
      <GameHeader
        playerName={playerName}
        onPlayerNameChange={setPlayerName}
        onStartGame={startGame}
        isBusy={isBusy}
        message={message}
        hasGameStarted={Boolean(game)}
      />

      <Scoreboard game={game} />

      <GameBoard
        cards={game?.cards ?? fallbackCards}
        matchedIndices={game?.matchedIndices ?? []}
        selectedIndices={selectedIndices}
        disabled={!game || isBusy || isRevealingMismatch || Boolean(game?.finished)}
        onCardClick={handleCardClick}
      />
    </main>
  )
}

export default App
