import {defineType, defineField} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'clientIndustry',
      title: 'Client Industry',
      type: 'string',
    }),
    defineField({
      name: 'toolsUsed',
      title: 'Tools Used (e.g., CRM, Analytics, Books)',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'businessProblem',
      title: 'Business Problem',
      type: 'text',
    }),
    defineField({
      name: 'metricMoved',
      title: 'Metric Moved (e.g., $40K/mo revenue leak found)',
      type: 'string',
    }),
    defineField({
      name: 'liveDemoUrl',
      title: 'Live Demo URL',
      type: 'url',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
})