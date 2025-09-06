import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'county',
  title: 'County Article',
  type: 'document',
  fields: [
    // Core Content
    defineField({ name: 'title', type: 'string', title: 'Page Title' }),
    defineField({ name: 'slug', type: 'slug', title: 'URL Slug', options: { source: 'title', maxLength: 96 } }),
    defineField({ name: 'excerpt', type: 'text', title: 'Page Description', description: 'Brief summary for SEO and social sharing' }),

    // SEO Overrides
    defineField({ 
      name: 'seoTitle', 
      type: 'string', 
      title: 'SEO Title Override',
      description: 'Custom page title for search engines (50-60 chars)',
      validation: Rule => Rule.max(60)
    }),
    defineField({ 
      name: 'seoDescription', 
      type: 'text', 
      title: 'SEO Description Override',
      description: 'Custom meta description for search results (150-160 chars)',
      validation: Rule => Rule.max(160)
    }),

    // Timestamps
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'updatedAt', type: 'datetime' }),

    // Content Builder
    defineField({
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
    }),
  ],
})

