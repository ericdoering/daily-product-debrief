import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {defaultDocumentNode, structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'daily-product-debrief-studio',

  projectId: '5f22r5dz',
  dataset: 'production',

  plugins: [structureTool({structure, defaultDocumentNode}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
