export type BriefSection = {
  title: string
  body: string
  items: string[] | null
}

export type BriefDigest = {
  title?: string
  lede?: string
  meta?: string
  intro: string
  sections: BriefSection[]
}

const EMOJI: Record<string, string> = {
  bug: '🐛',
  bulb: '💡',
  mega: '📣',
  new: '🆕',
  rocket: '🚀',
  sparkles: '✨',
}

const CALLOUT_OPEN = '::: {.callout}'
const CALLOUT_CLOSE = ':::'

/** Turn a Slack-canvas markdown body into title, lede, and scannable sections. */
export function digestBrief(markdown: string): BriefDigest {
  const prepared = liftCallouts(
    replaceEmoji(markdown.replaceAll('\u00a0', ' ').replace(/\r\n/g, '\n')),
  )
  const split = splitSections(prepared)
  const header = peelHeader(split.intro)

  return {
    title: header.title,
    lede: header.lede,
    meta: header.meta,
    intro: header.rest,
    sections: split.sections.map((section) => ({
      title: section.title,
      body: section.body,
      items: splitTopLevelList(section.body),
    })),
  }
}

export function listItemPresentation(item: string): {
  markdown: string
  isNew: boolean
  number?: string
} {
  const number = /^(\d+)\. /.exec(item)?.[1]
  const isNew = /^(?:[*+-] |\d+\. )🆕(?:\s|$)/.test(item)
  const markdown = item.replace(/^((?:[*+-] |\d+\. ))🆕\s*/, '$1')
  return {markdown, isNew, number}
}

function replaceEmoji(markdown: string): string {
  return markdown.replaceAll(/:([a-z0-9_+-]+):/gi, (full, name: string) => {
    return EMOJI[name.toLowerCase()] ?? full
  })
}

/** Pandoc callouts are not markdown. Lift them into a fenced block the reader can style. */
function liftCallouts(markdown: string): string {
  const lines = markdown.split('\n')
  const out: string[] = []

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].trim() !== CALLOUT_OPEN) {
      out.push(lines[index])
      continue
    }

    const inner: string[] = []
    index += 1
    while (index < lines.length && lines[index].trim() !== CALLOUT_CLOSE) {
      inner.push(lines[index])
      index += 1
    }
    out.push('```callout', ...inner, '```')
  }

  return out.join('\n')
}

function splitSections(markdown: string): {
  intro: string
  sections: {title: string; body: string}[]
} {
  const intro: string[] = []
  const sections: {title: string; body: string}[] = []
  let current: {title: string; lines: string[]} | undefined

  for (const line of markdown.split('\n')) {
    const heading = /^## (.+)$/.exec(line)
    if (heading) {
      if (current) sections.push({title: current.title, body: current.lines.join('\n').trim()})
      current = {title: heading[1].trim(), lines: []}
      continue
    }
    if (current) current.lines.push(line)
    else intro.push(line)
  }

  if (current) sections.push({title: current.title, body: current.lines.join('\n').trim()})
  return {intro: intro.join('\n').trim(), sections}
}

function peelHeader(intro: string): {title?: string; lede?: string; meta?: string; rest: string} {
  const lines = intro.split('\n')
  let index = 0
  const skipBlanks = () => {
    while (index < lines.length && lines[index].trim() === '') index += 1
  }

  skipBlanks()
  let title: string | undefined
  if (lines[index]?.startsWith('# ')) {
    title = lines[index].slice(2).trim()
    index += 1
  }

  skipBlanks()
  const ledeSource = lines[index]?.trim() ?? ''
  const ledeMatch = /^\*(.+)\*$/.exec(ledeSource)
  let lede: string | undefined
  if (ledeMatch && !ledeSource.startsWith('* ')) {
    lede = ledeMatch[1].trim()
    index += 1
  }

  skipBlanks()
  const metaSource = lines[index]?.trim() ?? ''
  let meta: string | undefined
  if (metaSource.includes('·') && !/[*_`#[\]]/.test(metaSource)) {
    meta = metaSource
    index += 1
  }

  return {title, lede, meta, rest: lines.slice(index).join('\n').trim()}
}

/** A section that is only a list becomes one card per item. Mixed prose stays as markdown. */
function splitTopLevelList(markdown: string): string[] | null {
  const lines = markdown.trim().split('\n')
  if (lines.length === 1 && lines[0] === '') return null

  const items: string[][] = []
  let current: string[] | undefined

  for (const line of lines) {
    if (line.trim() === '') {
      if (current) current.push('')
      continue
    }
    if (/^(?:[*+-] |\d+\. )/.test(line)) {
      if (current) items.push(current)
      current = [line]
      continue
    }
    if (current && /^[ \t]/.test(line)) {
      current.push(line)
      continue
    }
    return null
  }

  if (current) items.push(current)
  if (items.length === 0) return null
  return items.map((item) => item.join('\n').trimEnd())
}
