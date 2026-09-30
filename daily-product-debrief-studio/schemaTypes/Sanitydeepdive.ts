
import {defineField, defineType} from 'sanity'
import {BookIcon} from '@sanity/icons/Book'
 
export const Sanitydeepdive = defineType({
  name: 'Sanitydeepdive',
  title: 'Sanity Deep Dive',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Sanity Deep Dive',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'The day this deep dive was published.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 40,
      description: 'The full deep dive in Markdown, exactly as laid out in the Slack canvas.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {title: 'Date, newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
    {title: 'Date, oldest first', name: 'dateAsc', by: [{field: 'date', direction: 'asc'}]},
  ],
  preview: {
    select: {date: 'date', body: 'body'},
    prepare({date, body}) {
      // The canvas H1 carries the topic, so surface it as the subtitle to keep
      // the document list navigable without adding a field for it.
      const heading = (body ?? '').match(/^#\s+Sanity Deep Dive\s*(?:—|-)\s*(.+)$/m)?.[1]
      return {
        title: date ? `Sanity Deep Dive — ${date}` : 'Sanity Deep Dive (no date)',
        subtitle: heading?.trim(),
      }
    },
  },
})
 