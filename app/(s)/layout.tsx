import "../globals.css";

import {SpeedInsights} from "@vercel/speed-insights/next";
import type {Metadata} from "next";
import {VisualEditing, toPlainText, type PortableTextBlock} from "next-sanity";
import {Inter} from "next/font/google";
import {draftMode} from "next/headers";
import {Fragment, Suspense} from "react";

import AlertBanner from "./alert-banner";
import PortableText from "./portable-text";

import type {SettingsQueryResult} from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import {sanityFetch} from "@/sanity/lib/fetch";
import {settingsQuery} from "@/sanity/lib/queries";
import {resolveOpenGraphImage} from "@/sanity/lib/utils";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SettingsQueryResult>({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

function Intro(props: {title: string | null | undefined; description: any}) {
  const title = props.title || demo.title;
  const description = props.description?.length ? props.description : "";
  return (
    <Fragment>
    <section className="fixed top-0 left-0 p-8">
      <h1 className="prose-lg text-lg font-medium">
        <Link href="/">{title || ""}</Link>
      </h1>
      </section>
      <section className='fixed bottom-0 right-0 p-8'>
      <h2 className="text-pretty font-extralight">
        <PortableText
          className="prose-lg"
          value={description?.length ? description : ""}
        />
      </h2>
    </section>
    </Fragment>
  );
}

async function Footer() {
  const data = await sanityFetch<SettingsQueryResult>({
    query: settingsQuery,
  });
  const footer = data?.footer || [];

  return (
    <footer className="bg-accent-1 border-accent-2 border-t min-h-screen flex justify-center place-items-center w-full">
      <div className="">
        {footer.length > 0 ? (
          <PortableText
            className="prose-sm text-pretty bottom-0 w-full max-w-none bg-white py-12 text-center md:py-10"
            value={footer as PortableTextBlock[]}
          />
        ) : (
          <span className="text-prose"></span>
        )}
      </div>
    </footer>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await sanityFetch<SettingsQueryResult>({
    query: settingsQuery,
  });
  return (
    <html lang="en" className={`${inter.variable} bg-white text-black`}>
      <body className="">
        <main className="mx-auto min-h-screen flex justify-center items-center">
          {/* <Intro
            title={settings?.title || ""}
            description={settings?.description}
          /> */}
          <section className="min-h-screen">
            {draftMode().isEnabled && <AlertBanner />}
            <main>{children}</main>
            {/* <Suspense>
              <Footer />
            </Suspense> */}
          </section>
          {draftMode().isEnabled && <VisualEditing />}
          <SpeedInsights />
        </main>
      </body>
    </html>
  );
}
