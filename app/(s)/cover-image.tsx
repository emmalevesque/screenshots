import { Image } from "next-sanity/image";

import { urlForImage } from "@/sanity/lib/utils";
import { useRef } from 'react';

interface CoverImageProps {
  image: any;
  priority?: boolean;
  sizes?: string;
}

export default function CoverImage(props: CoverImageProps) {
  const { image: source, priority, sizes = "100vw" } = props;
  const image = source?.asset?._ref ? (
    <Image
      className="static"
      width={2000}
      height={2000}
      alt={source?.alt || ""}
      src={urlForImage(source)?.height(2000).dpr(2).url() as string}
      sizes={sizes}
      priority={priority}
    />
  ) : (
    <div className="bg-slate-50" style={{ paddingTop: "50%" }} />
  );

  return (
    <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
      {image}
    </div>
  );
}
