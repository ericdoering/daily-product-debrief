import {defineField, defineType} from 'sanity'
import {BookIcon} from '@sanity/icons/Book'
import {DOMAINS} from './Domains'

export const Sanitydeepdive = defineType({
  name: 'Sanitydeepdive',
  title: 'Sanity Deep Dive',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'meta', title: 'Meta', default: true},
    {name: 'content', title: 'Content'},
    {name: 'source', title: 'Source'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'meta',
      description: 'Specific and concrete — the behavior, not the product area.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'meta',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'deck',
      title: 'Deck',
      type: 'text',
      group: 'meta',
      rows: 2,
      description: 'One sentence: what the reader will be able to do after reading this.',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      group: 'meta',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'domain',
      title: 'Domain',
      type: 'string',
      group: 'meta',
      description: 'Catalog domain. Query this to see what has been covered recently.',
      options: {list: DOMAINS.map((d) => ({title: d.title, value: d.value}))},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'audience',
      title: 'Audience',
      type: 'string',
      group: 'meta',
      initialValue: 'Support engineering, Solutions Architecture, R&D, Product, etc.',
    }),
    defineField({
      name: 'keyTakeaway',
      title: 'Key takeaway',
      type: 'text',
      group: 'content',
      rows: 4,
      description:
        'The :::key box. 2–3 sentences that answer the common version of the ticket on their own.',
      validation: (Rule) => Rule.required().max(600),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      group: 'content',
      rows: 30,
      description:
        'The full explainer in Markdown, from "Why this comes up" through "Going deeper". Section headings can flex per topic, so this stays one field rather than seven.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerReply',
      title: 'Customer reply',
      type: 'text',
      group: 'content',
      rows: 6,
      description:
        'The :::customer paragraph, pulled out on its own because this is the part people paste into tickets.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sources',
      title: 'Sources',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (R) => R.required()}),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (R) => R.required().uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        },
      ],
      description: 'Docs pages and changelog entries the claims were verified against.',
    }),
    defineField({
      name: 'pdf',
      title: 'PDF',
      type: 'file',
      group: 'source',
      options: {accept: 'application/pdf'},
      description: 'The built PDF — the actual deliverable the task produces.',
    }),
    defineField({
      name: 'markdown',
      title: 'Original Markdown',
      type: 'text',
      group: 'source',
      rows: 20,
      description: 'The source Markdown including front matter, kept as the archival record.',
    }),
  ],
  orderings: [
    {title: 'Date, newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
    {title: 'Domain', name: 'domainAsc', by: [{field: 'domain', direction: 'asc'}, {field: 'date', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', domain: 'domain', date: 'date'},
    prepare({title, domain, date}) {
      const label = DOMAINS.find((d) => d.value === domain)?.title ?? domain
      return {title, subtitle: [date, label].filter(Boolean).join(' · ')}
    },
  },
})