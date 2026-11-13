import { slots } from '../lib/characters.ts'
import styles from './Board.module.css'
import { CharacterCard } from './CharacterCard.tsx'

type Props = {
  eliminated: readonly string[]
  onOpen: (id: string) => void
  onToggle: (id: string) => void
}

export function Board({ eliminated, onOpen, onToggle }: Props) {
  const eliminatedSet = new Set(eliminated)

  return (
    <div className={styles.board}>
      {slots.map((slot) => {
        const character = slot.character
        if (!character) {
          return <div key={slot.key} className={styles.empty} aria-hidden="true" />
        }

        return (
          <CharacterCard
            key={slot.key}
            character={character}
            eliminated={eliminatedSet.has(character.id)}
            onClick={() => onToggle(character.id)}
            onShowDetails={() => onOpen(character.id)}
          />
        )
      })}
    </div>
  )
}
