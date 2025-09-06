import { defineType, defineField } from 'sanity'
import { sectionsField } from './sections'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: r => r.required(),
    }),

    // Feature flags for the homepage/hero rail
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Show in the featured rail on the Resources page',
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Featured Order',
      type: 'number',
      description: 'Lower numbers appear first among featured posts (optional)',
    }),

    defineField({ name: 'excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'coverImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'categories', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'publishedAt', type: 'datetime' }),

    // ✅ Flexible sections shared with County
    sectionsField,

    // ✅ Legacy fallbacks to silence “Unknown field” warnings
    // Keep these defined so old documents with `content` render without errors.
    defineField({
      name: 'content',
      title: 'Body (legacy: content)',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
      hidden: true, // keep out of the editor UI, but schema knows about it
    }),
    defineField({
      name: 'body',
      title: 'Body (legacy)',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: true, // optional: hide if you only want sections going forward
    }),

    // SEO
    defineField({ name: 'seoTitle', type: 'string' }),
    defineField({ name: 'seoDescription', type: 'text' }),
  ],
  preview: { select: { title: 'title', media: 'coverImage' } },
})


