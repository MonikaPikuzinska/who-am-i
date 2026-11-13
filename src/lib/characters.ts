export type Character = {
  id: string
  group: string
  position: number
  name: string
  src: string
}

export type BoardSlot = {
  key: string
  character: Character | null
}

// Edit this array to change the row order.
// Groups not listed here are appended alphabetically.
export const GROUP_ORDER = ['skz', 'hr', 'fw', 'iwtv']

const FILE_PATTERN = /^([a-z]+)(\d+)-(.+)\.(jpg|jpeg|png|webp)$/i
const POSITIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const

const imageModules = import.meta.glob('../assets/characters/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
  caseSensitive: false,
})

function fileName(path: string): string {
  const slash = path.lastIndexOf('/')
  return slash === -1 ? path : path.slice(slash + 1)
}

function loadBoard(): { slots: BoardSlot[]; characters: Character[] } {
  const byId = new Map<string, Character>()
  const skipped: string[] = []
  const duplicates: string[] = []

  for (const [path, src] of Object.entries(imageModules)) {
    const file = fileName(path)
    if (typeof src !== 'string') {
      skipped.push(file)
      continue
    }

    const match = FILE_PATTERN.exec(file)
    const groupRaw = match?.[1]
    const positionRaw = match?.[2]
    const rawName = match?.[3]
    if (!groupRaw || !positionRaw || !rawName) {
      skipped.push(file)
      continue
    }

    const position = Number(positionRaw)
    if (!Number.isInteger(position) || position < 1 || position > 8) {
      skipped.push(file)
      continue
    }

    const group = groupRaw.toLowerCase()
    const id = `${group}${position}`
    if (byId.has(id)) {
      duplicates.push(file)
      continue
    }

    byId.set(id, {
      id,
      group,
      position,
      name: rawName.replaceAll('_', ' ').toLocaleUpperCase('pl'),
      src,
    })
  }

  const presentGroups = new Set([...byId.values()].map((character) => character.group))
  const orderedGroups = [
    ...GROUP_ORDER.filter((group) => presentGroups.has(group)),
    ...[...presentGroups]
      .filter((group) => !GROUP_ORDER.includes(group))
      .sort((a, b) => a.localeCompare(b)),
  ]

  const slots: BoardSlot[] = []
  for (const group of orderedGroups) {
    for (const position of POSITIONS) {
      const key = `${group}${position}`
      slots.push({ key, character: byId.get(key) ?? null })
    }
  }

  const characters = [...byId.values()]

  if (skipped.length > 0) {
    console.warn(`[who-am-i] Skipped ${skipped.length} file(s): ${skipped.join(', ')}`)
  }
  if (duplicates.length > 0) {
    console.warn(`[who-am-i] Duplicate card ids, kept the first file: ${duplicates.join(', ')}`)
  }
  if (orderedGroups.length !== 4 || characters.length !== 32) {
    console.warn(
      `[who-am-i] Expected 4 groups × 8 cards, got ${orderedGroups.length} groups and ${characters.length} cards.`,
    )
  }

  return { slots, characters }
}

const board = loadBoard()

export const slots = board.slots
export const characters = board.characters
