import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { albumQuery } from "../state/query";
import { useState } from "react";
import AddPhoto from "./AddPhoto";
export default function Album() {
  const [addPhoto, setAddPhoto] = useState(false);
  const { ship, albumId } = useParams();
  const album = useQuery({
    queryKey: ["album", ship, albumId],
    queryFn: () => albumQuery(albumId, ship),
  });
  const images = album?.data?.albums?.images?.sort((a, b) => Number(b[0]) - Number(a[0])) || [];
  console.log(album.data);
  return (
    <div className="p-8 w-full h-full">
      {addPhoto && <AddPhoto setAddPhoto={setAddPhoto} />}
      <div className="h-full w-full p-8 bg-white rounded-xl flex flex-col space-y-8">
        <div className="flex justify-between">
          <p className="font-semibold">{album?.data?.album?.name || albumId}</p>
          <div className="flex space-x-8 font-semibold text-[#666666]">
            <p>Edit</p>
            <p>Viewers</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center md:justify-normal gap-8 w-full h-full min-h-0 overflow-y-auto">
          {ship === `~${window.ship}` && (
            <div
              className="flex flex-col items-center justify-center border-[#999999] border rounded-lg w-32 h-32 font-semibold cursor-pointer"
              onClick={() => setAddPhoto(true)}
            >
              + Add Photo
            </div>
          )}
          {images?.map((image) => {
            return (
              <div className="w-32 h-32" key={image[0]}>
                <img
                  src={image[1]?.src}
                  alt=""
                  className="w-32 h-32 object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
