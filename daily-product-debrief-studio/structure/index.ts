import {BookIcon} from '@sanity/icons/Book'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {EditIcon} from '@sanity/icons/Edit'
import {EyeOpenIcon} from '@sanity/icons/EyeOpen'
import {
  type DefaultDocumentNodeResolver,
  type StructureBuilder,
  type StructureResolver,
} from 'sanity/structure'
import {BriefReader} from '../components/brief/BriefReader'

const READABLE_TYPES = ['morningDebrief', 'sanityDeepDive'] as const

type ReadableType = (typeof READABLE_TYPES)[number]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Read')
        .icon(EyeOpenIcon)
        .id('read')
        .child(
          S.list()
            .title('Read')
            .id('read-list')
            .items([
              S.listItem()
                .title('Morning Debriefs')
                .icon(CalendarIcon)
                .id('read-morning-debriefs')
                .child(readingList(S, 'morningDebrief', 'Morning Debriefs')),
              S.listItem()
                .title('Sanity Deep Dives')
                .icon(BookIcon)
                .id('read-deep-dives')
                .child(readingList(S, 'sanityDeepDive', 'Sanity Deep Dives')),
            ]),
        ),
      S.divider().title('Source'),
      S.documentTypeListItem('morningDebrief').title('Morning Debriefs'),
      S.documentTypeListItem('sanityDeepDive').title('Sanity Deep Dives'),
    ])

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  if (!isReadableType(schemaType)) return S.document().views([S.view.form()])
  return S.document().views(documentViews(S, false))
}

function readingList(S: StructureBuilder, schemaType: ReadableType, title: string) {
  return S.documentTypeList(schemaType)
    .id(`read-${schemaType}`)
    .title(title)
    .defaultOrdering([{field: 'date', direction: 'desc'}])
    .child((documentId) =>
      S.document().documentId(documentId).schemaType(schemaType).views(documentViews(S, true)),
    )
}

function documentViews(S: StructureBuilder, readFirst: boolean) {
  const reading = S.view.component(BriefReader).id('reading').title('Reading').icon(EyeOpenIcon)
  const source = S.view.form().id('source').title('Source').icon(EditIcon)
  return readFirst ? [reading, source] : [source, reading]
}

function isReadableType(schemaType: string): schemaType is ReadableType {
  return READABLE_TYPES.some((type) => type === schemaType)
}
