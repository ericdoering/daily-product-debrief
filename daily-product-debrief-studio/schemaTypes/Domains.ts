/**
 * The 17-domain catalog shared by the morning-debrief and sanity-tip skills.
 *
 * Both skills rotate through this list by day-of-year, so storing the domain on
 * every document lets a future run query what's already been covered instead of
 * relying on files being readable on disk.
 *
 * Keep the order and the indexes in sync with references/domains.md in the
 * sanity-tip skill — the rotation offset depends on the list being identical.
 */
export const DOMAINS = [
    {title: '0 — GROQ basics', value: 'groq-basics'},
    {title: '1 — Datasets & perspectives', value: 'datasets-perspectives'},
    {title: '2 — References', value: 'references'},
    {title: '3 — Content Lake API & CDN', value: 'content-lake-api'},
    {title: '4 — Image pipeline', value: 'image-pipeline'},
    {title: '5 — Portable Text', value: 'portable-text'},
    {title: '6 — Studio configuration', value: 'studio-configuration'},
    {title: '7 — Permissions, roles & tokens', value: 'permissions-roles-tokens'},
    {title: '8 — Webhooks', value: 'webhooks'},
    {title: '9 — Functions & Blueprints', value: 'functions-blueprints'},
    {title: '10 — MCP server, Content Agent & Context', value: 'mcp-agent-context'},
    {title: '11 — Content Releases & scheduling', value: 'content-releases'},
    {title: '12 — Media Library', value: 'media-library'},
    {title: '13 — JavaScript client & next-sanity', value: 'js-client-next-sanity'},
    {title: '14 — Migrations, mutations & transactions', value: 'migrations-mutations'},
    {title: '15 — CLI & deployment', value: 'cli-deployment'},
    {title: '16 — Schema & validation', value: 'schema-validation'},
  ] as const
  
  /** Products the changelog commonly attributes entries to. */
  export const PRODUCTS = [
    'Sanity Studio',
    'Content Lake',
    'Functions',
    'Media Library',
    'MCP server',
    'Content Agent',
    'Blueprints',
    'Canvas',
    'Dashboard',
    'Manage',
    'GROQ',
    'JavaScript Client',
    'next-sanity',
    'Webhooks',
    'AI Assist',
    'GraphQL',
    'Sanity UI',
    'React App SDK',
    'Agent Context',
    'Other',
  ]