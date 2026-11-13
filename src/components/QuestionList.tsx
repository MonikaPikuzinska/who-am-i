import { questions } from '../data/questions.ts'
import styles from './QuestionList.module.css'

type Props = {
  asked: readonly number[]
  onToggle: (index: number) => void
  onClear: () => void
}

export function QuestionList({ asked, onToggle, onClear }: Props) {
  const askedSet = new Set(asked)

  return (
    <section className={styles.panel} aria-labelledby="questions-heading">
      <h2 id="questions-heading" className={styles.heading}>
        Questions
      </h2>
      <p className={styles.hint}>Click a question once you have asked it.</p>
      <button type="button" className={styles.clear} onClick={onClear} disabled={asked.length === 0}>
        Clear asked questions
      </button>
      <ul className={styles.list}>
        {questions.map((question, index) => {
          const isAsked = askedSet.has(index)
          return (
            <li key={index}>
              <button
                type="button"
                className={isAsked ? `${styles.question} ${styles.asked}` : styles.question}
                aria-pressed={isAsked}
                onClick={() => onToggle(index)}
              >
                {question}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
