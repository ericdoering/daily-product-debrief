import {defineField, defineType} from 'sanity'
import {PRODUCTS} from '../Domains'

/**
 * One changelog entry in a debrief — a release, a new feature, or a bug fix.
 * The same shape serves all three buckets, so they stay comparable when queried.
 */
export const Debriefitem = defineType({
  name: 'Debriefitem',
  title: 'Debrief item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'What shipped, changed, or got fixed.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'string',
      options: {list: PRODUCTS},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      description: 'e.g. v5.24.0. Leave empty for entries that are not version-tagged.',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'One tight sentence: what changed and why it matters on a ticket.',
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published',
      type: 'date',
      description: 'The date on the changelog entry, not the date of the brief.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isNew',
      title: 'Shipped in the last 24 hours',
      type: 'boolean',
      description: 'The 🆕 flag. False means this is a recent item carried forward.',
      initialValue: false,
    }),
    defineField({
      name: 'url',
      title: 'Source link',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'whyItMatters',
      title: 'Why it matters',
      type: 'string',
      description:
        'Optional one-line tie to company strategy. Never include internal targets or numbers.',
      validation: (Rule) => Rule.max(200),
    }),
  ],
  preview: {
    select: {title: 'title', product: 'product', version: 'version', isNew: 'isNew', date: 'publishedAt'},
    prepare({title, product, version, isNew, date}) {
      return {
        title: [isNew ? '🆕' : null, product, version].filter(Boolean).join(' ') + ` — ${title}`,
        subtitle: date,
      }
    },
  },
})