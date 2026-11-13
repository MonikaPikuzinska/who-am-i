import { useMemo, useState } from 'react'
import styles from './App.module.css'
import { Board } from './components/Board.tsx'
import { CharacterDetail } from './components/CharacterDetail.tsx'
import { CharacterPicker } from './components/CharacterPicker.tsx'
import { QuestionList } from './components/QuestionList.tsx'
import { SecretPanel } from './components/SecretPanel.tsx'
import { questions } from './data/questions.ts'
import { usePersistentState } from './hooks/usePersistentState.ts'
import { characters } from './lib/characters.ts'

type GameState = {
  s: string | null
  e: string[]
  q: number[]
}

const EMPTY_GAME: GameState = { s: null, e: [], q: [] }
const COOKIE_NAME = 'whoami'
const knownIds = new Set(characters.map((character) => character.id))

function uniqueStrings(values: unknown[]): string[] {
  const seen = new Set<string>()
  for (const value of values) {
    if (typeof value === 'string') seen.add(value)
  }
  return [...seen]
}

function uniqueIndexes(values: unknown[]): number[] {
  const seen = new Set<number>()
  for (const value of values) {
    if (typeof value === 'number' && Number.isInteger(value)) seen.add(value)
  }
  return [...seen]
}

function parseGameState(raw: string): GameState {
  const data: unknown = JSON.parse(raw)
  if (typeof data !== 'object' || data === null) return EMPTY_GAME

  const record = data as Record<string, unknown>
  const secret = typeof record.s === 'string' && knownIds.has(record.s) ? record.s : null
  const eliminated = Array.isArray(record.e)
    ? uniqueStrings(record.e).filter((id) => knownIds.has(id))
    : []
  const asked = Array.isArray(record.q)
    ? uniqueIndexes(record.q).filter((index) => index >= 0 && index < questions.length)
    : []

  return { s: secret, e: eliminated, q: asked }
}

export default function App() {
  const [game, setGame] = usePersistentState(COOKIE_NAME, EMPTY_GAME, parseGameState)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)

  const secret = useMemo(
    () => characters.find((character) => character.id === game.s) ?? null,
    [game.s],
  )
  const detail = useMemo(
    () => characters.find((character) => character.id === detailId) ?? null,
    [detailId],
  )

  function toggleEliminated(id: string) {
    setGame((current) => ({
      ...current,
      e: current.e.includes(id) ? current.e.filter((item) => item !== id) : [...current.e, id],
    }))
  }

  function selectSecret(id: string) {
    setGame((current) => ({ ...current, s: id }))
    setPickerOpen(false)
  }

  function openDetail(id: string) {
    setPickerOpen(false)
    setDetailId(id)
  }

  function openPicker() {
    setDetailId(null)
    setPickerOpen(true)
  }

  function toggleAsked(index: number) {
    setGame((current) => ({
      ...current,
      q: current.q.includes(index) ? current.q.filter((item) => item !== index) : [...current.q, index],
    }))
  }

  function clearAsked() {
    setGame((current) => ({ ...current, q: [] }))
  }

  function resetGame() {
    const confirmed = window.confirm(
      'Start over? This clears your character, crossed-out cards, and asked questions.',
    )
    if (!confirmed) return
    setGame(EMPTY_GAME)
    setPickerOpen(false)
    setDetailId(null)
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Who am I?</h1>
        <button type="button" className={styles.reset} onClick={resetGame}>
          New game
        </button>
      </header>
      <main className={styles.layout}>
        <Board eliminated={game.e} onOpen={openDetail} onToggle={toggleEliminated} />
        <aside className={styles.side}>
          <SecretPanel character={secret} onPick={openPicker} />
          <QuestionList asked={game.q} onToggle={toggleAsked} onClear={clearAsked} />
        </aside>
      </main>
      <CharacterPicker
        open={pickerOpen}
        selectedId={game.s}
        onSelect={selectSecret}
        onClose={() => setPickerOpen(false)}
      />
      <CharacterDetail
        character={detail}
        eliminated={detail ? game.e.includes(detail.id) : false}
        onToggleEliminated={() => {
          if (detail) toggleEliminated(detail.id)
        }}
        onClose={() => setDetailId(null)}
      />
    </div>
  )
}
