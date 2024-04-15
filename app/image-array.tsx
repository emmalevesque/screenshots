import {SanityImageAsset, ScreenshotsQueryResult} from "@/sanity.types";
import CoverImage from "./(s)/cover-image";
import Link from "next/link";
import RandomSize from "./(s)/random-size";
import {Fragment} from "react";

function Screenshot({
  title,
  image,
}: Pick<Exclude<ScreenshotsQueryResult, null>, "image" | "title">) {
  console.log({title, image});
  return (
      <Link href={`/s/${title?.current}`} className=" w-full">
        <CoverImage priority image={image} />
      </Link>
    
  );
}

export default function ImageArray({images}: {images: ScreenshotsQueryResult}) {
  return (
    Array.isArray(images) &&
    images?.length > 0 &&
    images.map((image) => (
      <Screenshot key={image._id} title={image.title} image={image.image} />
    ))
  );
}
