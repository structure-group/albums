import { useQuery } from "@tanstack/react-query";
import { albumsQuery } from "../state/query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import useStorageState from "../state/storage";
export default function Albums() {
  const { s3 } = useStorageState();
  const { credentials } = s3 ?? { credentials: { accessKeyId: "" } };
  const albums = useQuery({ queryKey: ["albums"], queryFn: albumsQuery });
  console.log(albums.data);
  return <>
    <Helmet>
      <title>Albums</title>
    </Helmet>
    {credentials?.accessKeyId ? (
      <div className="p-8 flex flex-wrap gap-8">
        {albums?.data?.map((album) => {
          const owner = album?.[0]?.[1] || "";
          const id = album?.[0]?.[0] || "";
          const cover = album?.[1] || "";
          return (
            <Link to={`/album/${owner}/${id}`} key={`${owner}/${id}`}>
              <div className="w-64 h-64 bg-gray-200 rounded-xl flex flex-col items-center justify-center"
                style={{
                  backgroundImage: cover ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${cover})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
                <p className="text-2xl font-semibold text-white">{id}</p>
                <p className="text-sm text-white">{owner}</p>
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
}
