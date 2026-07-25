import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '8yy9mp89',
    dataset: 'production'
  },
  // Keep the nested Studio isolated from the Astro app's parent tsconfig.
  // The Studio does not use TypeScript path aliases.
  vite: {
    resolve: {
      tsconfigPaths: false,
    },
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
