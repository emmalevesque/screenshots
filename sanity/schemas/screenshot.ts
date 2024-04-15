import {defineField, defineType} from "sanity";

export default defineType({
  liveEdit: false,
  name: "screenshot",
  type: "document",
  title: "Screenshot",
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
        defineField({
          name: "instructions",
          title: "Instructions",
          type: "text",
          rows: 2,
        }),
      ],
      options: {
        storeOriginalFilename: true,
        hotspot: true,
        accept: "image/*",
        aiAssist: {
          imageDescriptionField: "alt",
          imageInstructionField: "instructions",
        },
      },
    }),
    defineField({
      name: "title",
      title: "Slug",
      type: "slug",
      options: {
        source: "image.alt",
        maxLength: 96,
      },
    }),
    defineField({
      name: "related",
      title: "Related",
      type: "array",
      
      options: {
        // @ts-ignore
        embeddingsIndex: true
      },
      of: [
        {
          type: "reference",

          options: {
            aiAssist: {
              embeddingsIndex: "emma-screenshots",
            },
          },
          to: [{type: "screenshot"}],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "image.alt",
      media: "image",
    },
  },
});
