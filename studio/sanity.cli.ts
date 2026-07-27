import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '8yy9mp89',
    dataset: 'production'
  },
  project: {
    basePath: '/studio',
  },
  // Keep the nested Studio isolated from the Astro app's parent tsconfig.
  // The Studio does not use TypeScript path aliases.
  vite: {
    plugins: [
      {
        name: 'studio-dev-runtime-origin',
        apply: 'serve',
        transformIndexHtml(html: string) {
          return html
            .replace(
              'from "/studio/@react-refresh"',
              'from "http://127.0.0.1:3333/studio/@react-refresh"',
            )
            .replace(
              'src="/studio/@vite/client"',
              'src="http://127.0.0.1:3333/studio/@vite/client"',
            )
        },
      },
    ],
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
