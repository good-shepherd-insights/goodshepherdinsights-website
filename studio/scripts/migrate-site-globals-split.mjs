import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import {createClient} from '@sanity/client'

const tokenPath = path.join(os.homedir(), '.config', 'sanity', 'config.json')
const authToken = JSON.parse(fs.readFileSync(tokenPath, 'utf8')).authToken
const dryRun = process.argv.includes('--dry-run')

const client = createClient({
  projectId: '8yy9mp89',
  dataset: 'production',
  apiVersion: '2026-01-01',
  token: authToken,
  useCdn: false,
})

const directFields = [
  {field: 'brand', id: 'brand', type: 'brand'},
  {field: 'contact', id: 'contact', type: 'contact'},
  {field: 'organization', id: 'organization', type: 'organization'},
  {field: 'header', id: 'header', type: 'header'},
  {field: 'footer', id: 'footer', type: 'footer'},
  {field: 'seoDefaults', id: 'seo-defaults', type: 'seoDefaults'},
  {field: 'indexing', id: 'indexing', type: 'indexing'},
  {field: 'forms', id: 'forms', type: 'forms'},
  {field: 'uiCopy', id: 'ui-copy', type: 'uiCopy'},
  {field: 'appManifest', id: 'app-manifest', type: 'appManifest'},
]

const operations = []

const oldDoc = await client.fetch(
  `*[_type == "siteGlobals" && _id == "site-globals"][0]`,
)

if (oldDoc) {
  for (const {field, id, type} of directFields) {
    const value = oldDoc[field]
    if (value === undefined) continue
    operations.push({kind: 'createOrReplace', doc: {...value, _id: id, _type: type}})
  }

  if (oldDoc.socialLinks !== undefined) {
    operations.push({
      kind: 'createOrReplace',
      doc: {_id: 'social-links', _type: 'socialLinks', links: oldDoc.socialLinks},
    })
  }

  operations.push({kind: 'delete', id: 'site-globals'})
}

if (dryRun) {
  console.log(JSON.stringify(operations, null, 2))
} else {
  for (const op of operations) {
    if (op.kind === 'createOrReplace') {
      await client.createOrReplace(op.doc)
    } else if (op.kind === 'delete') {
      await client.delete(op.id)
    }
  }
  console.log(`Applied ${operations.length} operation(s).`)
}
