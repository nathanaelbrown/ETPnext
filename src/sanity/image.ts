import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from './env'

// Simple helper: urlForImage(doc.heroImage).width(1200).url()
export function urlForImage(source: unknown) {
  return createImageUrlBuilder({ projectId, dataset }).image(source).auto('format')
}