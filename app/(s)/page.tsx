import Link from "next/link";
import {Suspense} from "react";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";
import PortableText from "./portable-text";

import type {HeroQueryResult, ScreenshotsQueryResult, SettingsQueryResult} from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import {sanityFetch} from "@/sanity/lib/fetch";
import {heroQuery, screenshotsQuery, settingsQuery} from "@/sanity/lib/queries";

function Intro(props: {title: string | null | undefined; description: any}) {
  const title = props.title || demo.title;
  const description = props.description?.length ? props.description : "";
  return (
    <section className="mt-16 mb-16 flex flex-col items-center lg:mb-12 lg:flex-row lg:justify-between">
      <h1 className="prose-lg text-lg font-extrabold">{title || ""}</h1>
      <h2 className="text-pretty text-center text-lg lg:pl-8 lg:text-left">
        <PortableText
          className="prose-lg"
          value={description?.length ? description : ""}
        />
      </h2>
    </section>
  );
}

function Screenshot({
  title,
  image,
}: Pick<
  Exclude<ScreenshotsQueryResult, null>,
  "image" | "title"
>) {
  console.log({title, image})
  return (
    <article>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <Link href={`/s/${title?.current}`} className="hover:underline">
          <CoverImage priority image={image}  />
        </Link>
        {/* <DateComponent dateString={date} />
        <div>
          {excerpt && (
            <p className="text-pretty mb-4 text-lg leading-relaxed">
              {excerpt}
            </p>
          )}
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div> */}
      </div>
    </article>
  );
}

export default async function Page() {
  const [settings, screenshot] = await Promise.all([
    sanityFetch<SettingsQueryResult>({
      query: settingsQuery,
    }),
    sanityFetch<ScreenshotsQueryResult>({query: screenshotsQuery}),
  ]);

  return (
    <div className="container mx-auto px-5">
      <Intro title={settings?.title} description={settings?.description} />
      {screenshot ? (
        <Screenshot
          title={screenshot.title}
          image={screenshot.image}
        />
      ) : (
        <Onboarding />
      )}
      {/* {screenshot?._id && (
        <aside>
          <Suspense>
            <MoreStories skip={screenshot._id} limit={100} />
          </Suspense>
        </aside>
      )} */}
    </div>
  );
}
