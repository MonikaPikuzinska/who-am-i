import { useEffect, useRef } from 'react'
import { descriptionFor } from '../data/descriptions.ts'
import type { Character } from '../lib/characters.ts'
import styles from './CharacterDetail.module.css'

type Props = {
  character: Character | null
  eliminated: boolean
  onToggleEliminated: () => void
  onClose: () => void
}

export function CharacterDetail({ character, eliminated, onToggleEliminated, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const open = character !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const description = character ? descriptionFor(character.id) : ''

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="detail-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {character ? (
        <>
          <div className={styles.header}>
            <h2 id="detail-title">{character.name}</h2>
            <button type="button" className={styles.close} onClick={onClose}>
              Close
            </button>
          </div>
          <img className={styles.photo} src={character.src} alt={character.name} />
          <p className={description ? styles.description : styles.missing}>
            {description || 'No description yet.'}
          </p>
          <button type="button" className={styles.eliminate} onClick={onToggleEliminated}>
            {eliminated ? 'Bring back' : 'Cross out'}
          </button>
        </>
      ) : null}
    </dialog>
  )
}
