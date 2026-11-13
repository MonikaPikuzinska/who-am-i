import type { Character } from '../lib/characters.ts'
import styles from './SecretPanel.module.css'

type Props = {
  character: Character | null
  onPick: () => void
}

export function SecretPanel({ character, onPick }: Props) {
  return (
    <section className={styles.panel} aria-labelledby="secret-heading">
      <h2 id="secret-heading" className={styles.heading}>
        Your character
      </h2>
      {character ? (
        <>
          <img className={styles.photo} src={character.src} alt={character.name} />
          <p className={styles.name}>{character.name}</p>
          <button type="button" className={styles.button} onClick={onPick}>
            Change character
          </button>
        </>
      ) : (
        <div className={styles.empty}>
          <p>Pick the character your opponent has to guess</p>
          <button type="button" className={styles.button} onClick={onPick}>
            Pick a character
          </button>
        </div>
      )}
    </section>
  )
}
