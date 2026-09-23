import {defineField, defineType, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {DOMAINS} from './Domains'

export const Morningdebrief = defineType({
  name: 'Morningdebrief',
  title: 'Morning Debrief',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'meta', title: 'Meta', default: true},
    {name: 'changelog', title: 'Changelog'},
    {name: 'news', title: 'News & tip'},
    {name: 'source', title: 'Source'},
  ],
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      group: 'meta',
      description: 'The morning this brief covers. One brief per day.',
      validation: (Rule) =>
        Rule.required().custom(async (date, context) => {
          if (!date) return true
          const {document, getClient} = context
          const client = getClient({apiVersion: '2025-02-19'})
          const id = (document?._id ?? '').replace(/^drafts\./, '')
          const count = await client.fetch(
            `count(*[_type == "morningDebrief" && date == $date && !(_id in [$draft, $published])])`,
            {date, draft: `drafts.${id}`, published: id},
          )
          return count > 0 ? 'A Morning Debrief already exists for this date' : true
        }),
    }),
    defineField({
      name: 'releases',
      title: 'Releases',
      type: 'array',
      group: 'changelog',
      of: [defineArrayMember({type: 'Debriefitem'})],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'newFeatures',
      title: 'New features',
      type: 'array',
      group: 'changelog',
      of: [defineArrayMember({type: 'Debriefitem'})],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'bugFixes',
      title: 'Bug fixes',
      type: 'array',
      group: 'changelog',
      of: [defineArrayMember({type: 'Debriefitem'})],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'companyNews',
      title: 'Company news',
      type: 'array',
      group: 'news',
      of: [defineArrayMember({type: 'Newsitem'})],
    }),
    defineField({
      name: 'tip',
      title: 'Tip of the day',
      type: 'object',
      group: 'news',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({
          name: 'title',
          title: 'Tip title',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'domain',
          title: 'Domain',
          type: 'string',
          description:
            'Which catalog domain this tip came from. Stored so future runs can check coverage.',
          options: {list: DOMAINS.map((d) => ({title: d.title, value: d.value}))},
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Tip',
          type: 'text',
          rows: 5,
          description: '2–4 sentences, Markdown. Optional small example.',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'deepDive',
      title: "That day's deep dive",
      type: 'reference',
      group: 'meta',
      to: [{type: 'Sanitydeepdive'}],
      description: 'Optional link to the long-form companion published the same day.',
    }),
    defineField({
      name: 'markdown',
      title: 'Original Markdown',
      type: 'text',
      group: 'source',
      rows: 20,
      description:
        'The full brief exactly as the task generated it. Kept as the archival record so nothing is lost to field mapping.',
    }),
    defineField({
      name: 'sourceFile',
      title: 'Source file',
      type: 'file',
      group: 'source',
      description: 'The morning-debrief-YYYY-MM-DD.md file, if you want the artifact itself.',
    }),
  ],
  orderings: [
    {
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {date: 'date', tip: 'tip.title'},
    prepare({date, tip}) {
      return {
        title: date ? `Morning Debrief — ${date}` : 'Morning Debrief (no date)',
        subtitle: tip ? `Tip: ${tip}` : 'No tip recorded',
      }
    },
  },
})