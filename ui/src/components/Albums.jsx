import { useQuery } from "@tanstack/react-query";
import { albumsQuery } from "../state/query";
import { Link } from "react-router-dom";
import useStorageState from "../state/storage";
export default function Albums() {
    const { s3 } = useStorageState();
    const { credentials } = s3;
    const albums = useQuery({ queryKey: ["albums"], queryFn: albumsQuery });
    console.log(albums.data)
    return credentials.accessKeyId ?
        <div className="p-8 flex flex-wrap gap-8">
            {albums.data?.map(([id, owner]) => {
                return <Link to={`/album/${owner}/${id}`} key={`${owner}/${id}`}>
                    <div className="w-64 h-64 bg-gray-200 rounded-xl flex flex-col items-center justify-center">
                        <p className="text-2xl font-semibold">{id}</p>
                        <p className="text-sm">{owner}</p>
                    </div>
                </Link>
            })}
        </div>
        : <div className="h-full w-full flex flex-col items-center justify-center">
            <p><a className="font-semibold border-b border-black mr-1" href="https://operators.urbit.org/manual/os/s3" target="_blank">Set up Amazon S3</a>to begin using Albums.</p>
        </div>
}