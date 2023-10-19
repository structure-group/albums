import { useQuery } from "@tanstack/react-query";
import { albumsQuery } from "../state/query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import useStorageState from "../state/storage";
import { DefaultAlbum } from "./icons/DefaultAlbum";
export default function Albums({ shared = false }) {
  const { s3 } = useStorageState();
  const { credentials } = s3 ?? { credentials: { accessKeyId: "" } };
  const albums = useQuery({ queryKey: ["albums"], queryFn: albumsQuery });
  const ourFilter = (album) => album?.owner === `~${window.ship}`;
  const sharedFilter = (album) => album?.owner !== `~${window.ship}`;
  // console.log(albums.data)
  return (
    <>
      <Helmet>
        <title>Albums</title>
      </Helmet>
      {credentials?.accessKeyId || shared ? (
        <div className="p-[30px] flex justify-center md:justify-normal flex-wrap gap-[30px] overflow-y-auto">
          {albums?.data
            ?.filter(shared ? sharedFilter : ourFilter)
            .map((album) => {
              const { name, title, owner, cover, archive } = album;
              return (
                <Link to={`/album/${owner}/${name}`} key={`${owner}/${name}`}>
                  <div className="flex flex-col items-center w-64 space-y-2">
                    <div
                      className="w-[270px] h-[270px] bg-gray-200 rounded-xl flex flex-col items-center justify-center relative"
                      style={{
                        backgroundImage: cover ? `url(${cover})` : DefaultAlbum,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {archive && <div className="rounded-[10px] bg-[rgba(30,30,30,0.5)] text-white text-xs font-semibold absolute bottom-4 right-4 px-2 py-1">ARCHIVE</div>}
                    </div>
                    <p className="font-semibold text-sm w-full text-center">
                      {title}
                    </p>
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
