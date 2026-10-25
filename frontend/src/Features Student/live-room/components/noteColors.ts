import type { NoteColor } from '../types'

export const noteBg: Record<NoteColor, string> = {
  yellow: 'bg-yellow-200',
  blue: 'bg-sky-200',
  green: 'bg-green-200',
  pink: 'bg-pink-200',
}

export const NOTE_COLORS: NoteColor[] = ['yellow', 'blue', 'green', 'pink']
