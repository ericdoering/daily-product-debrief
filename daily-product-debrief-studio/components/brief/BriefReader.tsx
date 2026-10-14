import {Badge, Box, Card, Container, Heading, Inline, Label, Stack, Text} from '@sanity/ui'
import {type UserViewComponent} from 'sanity/structure'
import {digestBrief, listItemPresentation} from './digestMarkdown'
import {MarkdownView} from './MarkdownView'

const KIND: Record<string, string> = {
  morningDebrief: 'Morning Debrief',
  sanityDeepDive: 'Sanity Deep Dive',
}

export const BriefReader: UserViewComponent = (props) => {
  const displayed = props.document.displayed
  const body = typeof displayed.body === 'string' ? displayed.body : ''
  const date = typeof displayed.date === 'string' ? displayed.date : undefined
  const fallbackTitle = typeof displayed.title === 'string' ? displayed.title : undefined
  const digest = digestBrief(body)
  const title = digest.title || fallbackTitle || 'Untitled'
  const kind = KIND[props.schemaType.name] ?? props.schemaType.name

  return (
    <Card height="fill" overflow="auto" padding={4} tone="transparent">
      <Container width={1}>
        <Stack paddingBottom={5} gap={5}>
          <Stack gap={3}>
            <Label muted size={0}>
              {kind}
            </Label>
            <Heading as="h1" size={3}>
              {title}
            </Heading>
            {date ? (
              <Text muted size={1}>
                {formatDate(date)}
              </Text>
            ) : null}
            {digest.meta ? (
              <Text muted size={1}>
                {digest.meta}
              </Text>
            ) : null}
            {digest.lede ? <MarkdownView markdown={digest.lede} variant="deck" /> : null}
          </Stack>

          {body.trim() ? (
            <>
              {digest.intro ? <MarkdownView markdown={digest.intro} /> : null}
              {digest.sections.map((section) => (
                <Card key={section.title} border padding={4} radius={2} shadow={1}>
                  <Stack gap={4}>
                    <Heading as="h2" size={1}>
                      {section.title}
                    </Heading>
                    {section.items ? (
                      <Stack gap={3}>
                        {section.items.map((item) => (
                          <ItemCard item={item} key={item} />
                        ))}
                      </Stack>
                    ) : section.body ? (
                      <MarkdownView markdown={section.body} />
                    ) : null}
                  </Stack>
                </Card>
              ))}
            </>
          ) : (
            <Card padding={4} radius={2} tone="transparent" border>
              <Text muted>This document has no body yet. Add the markdown in the Source tab.</Text>
            </Card>
          )}
        </Stack>
      </Container>
    </Card>
  )
}

function ItemCard({item}: {item: string}) {
  const presentation = listItemPresentation(item)
  const showHeader = presentation.isNew || presentation.number

  return (
    <Card padding={3} radius={2} tone="transparent" border>
      <Stack gap={3}>
        {showHeader ? (
          <Inline gap={2}>
            {presentation.number ? (
              <Box>
                <Text size={1} weight="semibold">
                  {presentation.number}
                </Text>
              </Box>
            ) : null}
            {presentation.isNew ? <Badge tone="positive">New</Badge> : null}
          </Inline>
        ) : null}
        <MarkdownView markdown={presentation.markdown} variant="item" />
      </Stack>
    </Card>
  )
}

function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return iso
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
  }).format(date)
}
