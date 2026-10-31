export type Accent = 'amber' | 'sky' | 'emerald' | 'violet' | 'rose' | 'teal'

const ACCENTS: Accent[] = ['amber', 'sky', 'emerald', 'violet', 'rose', 'teal']

export function accentFor(id: string): Accent {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return ACCENTS[hash % ACCENTS.length]
}
