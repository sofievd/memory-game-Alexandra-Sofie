type GameHeaderProps = {
  playerName: string
  onPlayerNameChange: (value: string) => void
  onStartGame: () => void
  isBusy: boolean
  message: string
  hasGameStarted: boolean
}

function GameHeader({
  playerName,
  onPlayerNameChange,
  onStartGame,
  isBusy,
  message,
  hasGameStarted,
}: GameHeaderProps) {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <p className="eyebrow">Penguin Memory Game</p>
        <h1>Find all matching penguin pairs</h1>
        <p className="lead">
          Flip two cards at a time, remember where the penguins are, and clear the board with the
          fewest moves.
        </p>
      </div>
      <div className="controls">
        <label className="field">
          <span>Player name</span>
          <input
            value={playerName}
            onChange={(event) => onPlayerNameChange(event.target.value)}
            placeholder="Enter your name"
          />
        </label>
        <button className="primary-button" onClick={onStartGame} disabled={isBusy}>
          {hasGameStarted ? 'Restart game' : 'Start game'}
        </button>
        <p className="status">{message}</p>
      </div>
    </section>
  )
}

export default GameHeader

