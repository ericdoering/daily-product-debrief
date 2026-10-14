import {Code} from '@sanity/ui/code'
import {Box, Card, Label, Stack} from '@sanity/ui'
import {isValidElement, type ReactNode} from 'react'
import Markdown, {type Components} from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'

const LANGUAGE_LABEL: Record<string, string> = {
  bash: 'Shell',
  groq: 'GROQ',
  javascript: 'JavaScript',
  js: 'JavaScript',
  sh: 'Shell',
  ts: 'TypeScript',
  typescript: 'TypeScript',
}

const Prose = styled.div`
  color: var(--card-fg-color);
  font-size: 0.9375rem;
  line-height: 1.6;
  overflow-wrap: anywhere;

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }

  p {
    margin: 0.75rem 0;
  }

  a {
    color: var(--card-link-color);
    text-underline-offset: 0.15em;
  }

  strong {
    font-weight: 600;
  }

  ul,
  ol {
    margin: 0.75rem 0;
    padding-left: 1.25rem;
  }

  li + li {
    margin-top: 0.75rem;
  }

  li > ul,
  li > ol {
    margin-top: 0.5rem;
  }

  :not(pre) > code {
    background: var(--card-code-bg-color);
    border-radius: 3px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.85em;
    padding: 0.1em 0.35em;
  }

  .table-wrap {
    margin: 1rem 0;
    overflow-x: auto;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    border-bottom: 1px solid var(--card-border-color);
    padding: 0.65rem 0.75rem;
    text-align: left;
    vertical-align: top;
  }

  th {
    color: var(--card-muted-fg-color);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &.digest-item > ul,
  &.digest-item > ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &.digest-item li li {
    border-left: 2px solid var(--card-border-color);
    color: var(--card-muted-fg-color);
    list-style: none;
    margin-top: 0.75rem;
    padding-left: 0.75rem;
  }

  &.deck p {
    color: var(--card-muted-fg-color);
    font-size: 1.0625rem;
    margin: 0;
  }
`

const components: Components = {
  a: ({href, children}) => (
    <a href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  ),
  pre: ({children}) => <CodeBlock>{children}</CodeBlock>,
  table: ({children}) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
}

export function MarkdownView({
  markdown,
  variant = 'flow',
}: {
  markdown: string
  variant?: 'flow' | 'item' | 'deck'
}) {
  return (
    <Prose className={variant === 'flow' ? undefined : variant === 'item' ? 'digest-item' : 'deck'}>
      <Markdown components={components} remarkPlugins={[remarkGfm]}>
        {markdown}
      </Markdown>
    </Prose>
  )
}

function CodeBlock({children}: {children: ReactNode}) {
  const block = readCodeBlock(children)
  if (!block) return <pre>{children}</pre>

  if (block.language === 'callout') {
    return <Callout markdown={block.value} />
  }

  const label = block.language ? LANGUAGE_LABEL[block.language] : undefined

  return (
    <Stack marginY={3} gap={2}>
      {label ? (
        <Label muted size={0}>
          {label}
        </Label>
      ) : null}
      <Box overflow="auto">
        <Code language={block.language} size={1}>
          {block.value}
        </Code>
      </Box>
    </Stack>
  )
}

function Callout({markdown}: {markdown: string}) {
  const tone = calloutTone(markdown)
  return (
    <Card marginY={3} padding={4} radius={2} tone={tone}>
      <MarkdownView markdown={markdown} />
    </Card>
  )
}

function calloutTone(markdown: string): 'primary' | 'positive' {
  const head = markdown.slice(0, 240).toLowerCase()
  if (head.includes('customer') || head.includes('say this')) return 'positive'
  return 'primary'
}

function readCodeBlock(children: ReactNode): {language?: string; value: string} | undefined {
  if (!isValidElement<{children?: ReactNode; className?: string}>(children)) return undefined
  const language = /language-([\w-]+)/.exec(children.props.className ?? '')?.[1]
  const value = String(children.props.children ?? '').replace(/\n$/, '')
  return {language, value}
}
