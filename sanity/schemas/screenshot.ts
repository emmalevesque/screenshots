import {defineField, defineType} from "sanity";

export default defineType({
  name: "screenshot",
  type: "document",
  title: 'Screenshot',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
      options: {
        storeOriginalFilename: true,
        hotspot: true,
        accept: "image/*",
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
    }),
    defineField({
      name: 'title',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'image.alt',
        maxLength: 96,
      },
    })
  ],
  preview: {
    select: {
      title: "alt",
      media: "asset",
    },
  },
});
