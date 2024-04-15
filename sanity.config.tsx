"use client";
/**
 * This config is used to set up Sanity Studio that's mounted on the `app/(sanity)/studio/[[...tool]]/page.tsx` route
 */
import {visionTool} from "@sanity/vision";
import {PluginOptions, defineConfig} from "sanity";
import {unsplashImageAsset} from "sanity-plugin-asset-source-unsplash";
import {presentationTool} from "sanity/presentation";
import {structureTool} from "sanity/structure";
import {
  embeddingsIndexDashboard,
  embeddingsIndexReferenceInput, 
} from "@sanity/embeddings-index-ui";
import {Text} from "@sanity/ui";

import {apiVersion, dataset, projectId, studioUrl} from "@/sanity/lib/api";
import {locate} from "@/sanity/plugins/locate";
import {pageStructure, singletonPlugin} from "@/sanity/plugins/settings";
import {assistWithPresets} from "@/sanity/plugins/assist";
import settings from "@/sanity/schemas/singletons/settings";
import screenshot from "./sanity/schemas/screenshot";
import post from "./sanity/schemas/documents/post";
import author from "./sanity/schemas/documents/author";

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: [
      // Singletons
      settings,
      // Documents
      post,
      author,
      screenshot,
    ],
  },
  
  plugins: [
    embeddingsIndexDashboard(),
    structureTool({structure: pageStructure([settings])}),
    embeddingsIndexReferenceInput({
      indexName: "emma-screenshots", // Name of the embeddings index
      maxResults: 10, // Maximum number of returned results per request. Default: 10
      searchMode: "embeddings", // Sets default search mode for the field. Enables toggling between 'embeddings' (semantic search) and 'default' (default search based on GROQ filter)
    }),
    presentationTool({
      locate,
      previewUrl: {previewMode: {enable: "/api/draft"}},
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([settings.name]),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Sets up AI Assist with preset prompts
    // https://www.sanity.io/docs/ai-assist
    assistWithPresets(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    process.env.NODE_ENV === "development" &&
      visionTool({defaultApiVersion: apiVersion}),
  ].filter(Boolean) as PluginOptions[],
});
