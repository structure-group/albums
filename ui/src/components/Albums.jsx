import { useQuery } from "@tanstack/react-query";
import { albumsQuery, contactsQuery, settingsQuery } from "../state/query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import useStorageState from "../state/storage";
export default function Albums({ shared = false }) {
  const { s3 } = useStorageState();
  const { credentials } = s3 ?? { credentials: { accessKeyId: "" } };
  const albums = useQuery({ queryKey: ["albums"], queryFn: albumsQuery });
  const contacts = useQuery({
    queryKey: ["contacts"],
    queryFn: () => contactsQuery(),
  });
  const settings = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsQuery(),
  });
  const disabledNicknames =
    settings.data?.calmEngine?.disableNicknames || false;
  const ourFilter = (album) => album?.[0]?.[1] === `~${window.ship}`;
  const sharedFilter = (album) => album?.[0]?.[1] !== `~${window.ship}`;
  return (
    <>
      <Helmet>
        <title>Albums</title>
      </Helmet>
      {credentials?.accessKeyId ? (
        <div className="p-8 flex justify-center md:justify-normal flex-wrap gap-8">
          {albums?.data
            ?.filter(shared ? sharedFilter : ourFilter)
            .map((album) => {
              if (!Array.isArray(album)) return null;
              const owner =
                contacts?.data?.[album?.[0]?.[1]] && !disabledNicknames
                  ? contacts?.data?.[album?.[0]?.[1]]?.nickname
                  : album?.[0]?.[1] || "";
              const id = album?.[0]?.[0] || "";
              const cover = album?.[1] || "";
              return (
                <Link
                  to={`/album/${album?.[0]?.[1]}/${id}`}
                  key={`${album?.[0]?.[1]}/${id}`}
                >
                  <div className="flex flex-col items-center w-64 space-y-2">
                    <div
                      className="w-64 h-64 bg-gray-200 rounded-xl flex flex-col items-center justify-center"
                      style={{
                        backgroundImage: cover
                          ? `url(${cover})`
                          : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                    </div>
                    <p className="font-semibold">{id}</p>
                  </div>
                </Link>
              );
            })}
        </div>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <p>
            <a
              className="font-semibold border-b border-black mr-1"
              href="https://operators.urbit.org/manual/os/s3"
              target="_blank"
            >
              Set up Amazon S3
            </a>
            to begin using Albums.
          </p>
        </div>
      )}
    </>
  );
}
