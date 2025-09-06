// src/sanity/schematypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import { sectionObjects } from './sections'
import county from './county'
import post from './post'
import { richText } from './blocks' // keep this if you actually use it

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // base/blocks
    richText,

    // register ALL section objects exactly once
    ...sectionObjects,

    // documents
    county,
    post,
  ],
}

