import type { Character } from '../lib/characters.ts'
import styles from './CharacterCard.module.css'

type Props = {
  character: Character
  eliminated?: boolean
  selected?: boolean
  onClick: () => void
  onShowDetails?: () => void
}

function classNames(...parts: Array<string | false | undefined>): string {
  return parts.filter((part) => part).join(' ')
}

export function CharacterCard({
  character,
  eliminated = false,
  selected = false,
  onClick,
  onShowDetails,
}: Props) {
  const label = eliminated ? `${character.name}, crossed out` : character.name

  return (
    <div className={classNames(styles.card, eliminated && styles.eliminated, selected && styles.selected)}>
      <button
        type="button"
        className={styles.open}
        onClick={onClick}
        aria-pressed={onShowDetails ? eliminated : undefined}
        aria-current={selected ? 'true' : undefined}
        aria-label={label}
      >
        <span className={styles.photoWrap}>
          <img src={character.src} alt={character.name} />
        </span>
      </button>
      <div className={styles.meta}>
        {onShowDetails ? (
          <button
            type="button"
            className={styles.info}
            aria-label={`About ${character.name}`}
            onClick={onShowDetails}
          >
            <span aria-hidden="true">?</span>
          </button>
        ) : null}
        <button type="button" className={styles.caption} tabIndex={-1} aria-hidden="true" onClick={onClick}>
          {character.name}
        </button>
      </div>
    </div>
  )
}
