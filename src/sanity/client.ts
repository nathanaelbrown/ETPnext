import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,      // e.g., '2025-08-01'
  useCdn: true,    // fine for public marketing content
})