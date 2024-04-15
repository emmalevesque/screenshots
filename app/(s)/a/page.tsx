import Onboarding from "../onboarding";
import type {ScreenshotsQueryResult, SettingsQueryResult} from "@/sanity.types";
import {sanityFetch} from "@/sanity/lib/fetch";
import {latestScreenshotsQuery, settingsQuery} from "@/sanity/lib/queries";
import ImageArray from "../../image-array";
import ThreeCanvas from "../canvas";

export default async function Page() {
  const screenshots = await sanityFetch<ScreenshotsQueryResult>({
    query: latestScreenshotsQuery,
  });

  return (
    <div className="mx-auto min-h-screen w-screen">
      <ThreeCanvas />
      {screenshots ? <ImageArray images={screenshots} /> : <Onboarding />}
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
