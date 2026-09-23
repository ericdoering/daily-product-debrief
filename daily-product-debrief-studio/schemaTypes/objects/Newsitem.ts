import {defineField, defineType} from 'sanity'

/** A company news entry — announcement, blog post, incident, partnership. */
export const Newsitem = defineType({
  name: 'Newsitem',
  title: 'News item',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: '1–2 sentences, in your own words.',
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isNew',
      title: 'Published in the last 24 hours',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {title: 'headline', date: 'publishedAt', isNew: 'isNew'},
    prepare({title, date, isNew}) {
      return {title: isNew ? `🆕 ${title}` : title, subtitle: date}
    },
  },
})