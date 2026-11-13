import { useEffect, useRef } from 'react'
import { slots } from '../lib/characters.ts'
import styles from './CharacterPicker.module.css'
import { CharacterCard } from './CharacterCard.tsx'

type Props = {
  open: boolean
  selectedId: string | null
  onSelect: (id: string) => void
  onClose: () => void
}

export function CharacterPicker({ open, selectedId, onSelect, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="picker-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.header}>
        <h2 id="picker-title">Pick your character</h2>
        <button type="button" className={styles.close} onClick={onClose}>
          Close
        </button>
      </div>
      <div className={styles.grid}>
        {slots.map((slot) => {
          const character = slot.character
          if (!character) {
            return <div key={slot.key} className={styles.empty} aria-hidden="true" />
          }

          return (
            <CharacterCard
              key={slot.key}
              character={character}
              selected={character.id === selectedId}
              onClick={() => onSelect(character.id)}
            />
          )
        })}
      </div>
    </dialog>
  )
}
