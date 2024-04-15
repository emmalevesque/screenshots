import type {Metadata, ResolvingMetadata} from "next";
import {groq} from "next-sanity";
import Link from "next/link";
import {notFound} from "next/navigation";

import CoverImage from "../../cover-image";
import DateComponent from "../../date";

import type {
  PostQueryResult,
  PostSlugsResult,
  ScreenshotQueryResult,
  SettingsQueryResult,
} from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import {sanityFetch} from "@/sanity/lib/fetch";
import {screenshotQuery, settingsQuery} from "@/sanity/lib/queries";
import {resolveOpenGraphImage} from "@/sanity/lib/utils";

type Props = {
  params: {slug: string};
};

const screenshotSlugs = groq`*[_type == "screenshot"]{slug}`;

export async function generateStaticParams() {
  const params = await sanityFetch<PostSlugsResult>({
    query: screenshotSlugs,
    perspective: "published",
    stega: false,
  });
  return params.map(({slug}) => ({slug: slug?.current}));
}

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const screenshot = await sanityFetch<PostQueryResult>({
    query: screenshotQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(screenshot?.coverImage);

  return {
    authors: screenshot?.author?.name ? [{name: screenshot?.author?.name}] : [],
    title: screenshot?.title,
    description: screenshot?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage({params}: Props) {
  console.log({params});

  const [screenshot, settings] = await Promise.all([
    sanityFetch<ScreenshotQueryResult>({
      query: screenshotQuery,
      params,
    }),
    sanityFetch<SettingsQueryResult>({
      query: settingsQuery,
    }),
  ]);

  console.log({screenshot, settings});

  if (!screenshot) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-5">
      <h2 className="mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
        <Link href="/" className="hover:underline">
          {settings?.title || demo.title}
        </Link>
      </h2>
      <article>
        <h1 className="text-balance mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
          {screenshot?.title?.current}
        </h1>
        <div className="mb-8 sm:mx-0 md:mb-16">
          <CoverImage image={screenshot?.image} priority />
        </div>
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-lg">
            {screenshot?._createdAt && (
              <div className="mb-4 text-lg">
                <DateComponent dateString={screenshot._createdAt} />
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
