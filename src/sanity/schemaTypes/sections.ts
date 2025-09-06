// src/sanity/schematypes/sections.ts
import { defineType, defineField, defineArrayMember } from 'sanity'
import { type SchemaTypeDefinition } from 'sanity'

// --- Compatibility shims for older object names ---
// If some schemas still reference these, keep them registered so Studio doesn't error.

// 1) imageWithCaption (same shape as imageWithMeta)
export const imageWithCaption = defineType({
  name: 'imageWithCaption',
  title: 'Image with caption',
  type: 'object',
  fields: [
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'alt', type: 'string' }),
    defineField({ name: 'caption', type: 'string' }),
  ],
})

/** Reusable image object with alt/caption */
const imageWithMeta = defineType({
  name: 'imageWithMeta',
  title: 'Image with meta',
  type: 'object',
  fields: [
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'alt', type: 'string' }),
    defineField({ name: 'caption', type: 'string' }),
  ],
})

/* ---- Individual section object types (shared) ---- */

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'heading', type: 'string', validation: r => r.required() }),
    defineField({ name: 'subheading', type: 'text' }),
    defineField({ name: 'image', type: 'imageWithMeta' }),
  ],
})

export const textSection = defineType({
  name: 'textSection',
  title: 'Rich Text',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      type: 'array',
      of: [{ type: 'block' }],
      validation: r => r.required(),
    }),
  ],
})

export const imageSection = defineType({
  name: 'imageSection',
  title: 'Image',
  type: 'object',
  fields: [defineField({ name: 'media', type: 'imageWithMeta', validation: r => r.required() })],
})

export const statsSection = defineType({
  name: 'statsSection',
  title: 'Stats',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', validation: r => r.required() }),
            defineField({ name: 'value', type: 'string', validation: r => r.required() }),
          ],
        }),
      ],
    }),
  ],
})

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', type: 'string', validation: r => r.required() }),
            defineField({
              name: 'answer',
              type: 'array',
              of: [{ type: 'block' }],
              validation: r => r.required(),
            }),
          ],
        }),
      ],
    }),
  ],
})

export const calloutSection = defineType({
  name: 'calloutSection',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'tone',
      type: 'string',
      options: {
        list: [
          { title: 'Info', value: 'info' },
          { title: 'Success', value: 'success' },
          { title: 'Warning', value: 'warning' },
        ],
        layout: 'radio',
      },
      initialValue: 'info',
    }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
  ],
})

export const twoColSection = defineType({
  name: 'twoColSection',
  title: 'Two Columns',
  type: 'object',
  fields: [
    defineField({ name: 'left', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'right', type: 'array', of: [{ type: 'block' }] }),
  ],
})

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'buttonLabel', type: 'string' }),
    defineField({ name: 'buttonHref', type: 'string' }),
    defineField({ 
      name: 'showAddressSearch', 
      type: 'boolean', 
      title: 'Show Address Search',
      description: 'Include Google Maps autocomplete for property address'
    }),
  ],
})

export const textWithImageSection = defineType({
  name: 'textWithImageSection',
  title: 'Text with Image',
  type: 'object',
  fields: [
    defineField({ 
      name: 'body', 
      type: 'array', 
      of: [{ type: 'block' }],
      title: 'Text Content'
    }),
    defineField({ 
      name: 'image', 
      type: 'image', 
      options: { hotspot: true },
      title: 'Side Image'
    }),
    defineField({ 
      name: 'imageAlt', 
      type: 'string', 
      title: 'Image Alt Text' 
    }),
    defineField({ 
      name: 'caption', 
      type: 'string', 
      title: 'Image Caption' 
    }),
    defineField({
      name: 'imagePosition',
      type: 'string',
      title: 'Image Position',
      options: {
        list: [
          { title: 'Right', value: 'right' },
          { title: 'Left', value: 'left' }
        ]
      },
      initialValue: 'right'
    })
  ],
  preview: {
    select: {
      title: 'body',
      media: 'image'
    },
    prepare(selection) {
      const { title } = selection
      const block = title?.[0]
      return {
        title: block ? 'Text with Image' : 'Text with Image (empty)',
        subtitle: block?.children?.[0]?.text || 'No content'
      }
    }
  }
})

/** Register all section objects here */
export const sectionObjects: SchemaTypeDefinition[] = [
  imageWithMeta,
  heroSection,
  textSection,
  imageSection,
  faqSection,
  calloutSection,
  twoColSection,
  ctaSection,
  imageWithCaption,
  statsSection,
  textWithImageSection,
]

/** Reusable sections[] field for any document */
export const sectionsField = defineField({
  name: 'sections',
  title: 'Page Sections',
  type: 'array',
  of: [
    defineArrayMember({ type: 'heroSection' }),
    defineArrayMember({ type: 'textSection' }),
    defineArrayMember({ type: 'imageSection' }),
    defineArrayMember({ type: 'statsSection' }),
    defineArrayMember({ type: 'faqSection' }),
    defineArrayMember({ type: 'calloutSection' }),
    defineArrayMember({ type: 'twoColSection' }),
    defineArrayMember({ type: 'ctaSection' }),
    defineArrayMember({ type: 'textWithImageSection' }),
  ],
})

