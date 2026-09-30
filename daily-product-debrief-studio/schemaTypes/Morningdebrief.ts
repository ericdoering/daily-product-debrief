import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

export const Morningdebrief = defineType({
  name: 'Morningdebrief',
  title: 'Morning Debrief',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Morning Debrief',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'The morning this debrief covers.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 40,
      description: 'The full debrief in Markdown, exactly as laid out in the Slack canvas.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {title: 'Date, newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
    {title: 'Date, oldest first', name: 'dateAsc', by: [{field: 'date', direction: 'asc'}]},
  ],
  preview: {
    select: {date: 'date'},
    prepare({date}) {
      return {title: date ? `Morning Debrief — ${date}` : 'Morning Debrief (no date)'}
    },
  },
})