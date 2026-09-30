import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '5f22r5dz',
    dataset: 'production'
  },
  deployment: {
    appId: 'fnnp3a0m0jm991gkwykog3j6',
    autoUpdates: true,
    
  },
  studioHost: 'daily-product-debrief',
})
