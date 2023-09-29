import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { albumQuery, contactsQuery, settingsQuery } from "../state/query";
import { useState } from "react";
import AddPhoto from "./AddPhoto";
import Lightbox from "./Lightbox";
import cn from 'classnames'

export default function Album() {
  const [addPhoto, setAddPhoto] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const { ship, albumId, subview } = useParams();
  const album = useQuery({
    queryKey: ["album", ship, albumId],
    queryFn: () => albumQuery(albumId, ship),
  });
  const contacts = useQuery({
    queryKey: ["contacts"],
    queryFn: () => contactsQuery(),
  });
  const settings = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsQuery(),
  });
  console.log(settings.data);
  const disabledNicknames =
    settings.data?.calmEngine?.disableNicknames || false;
  const images =
    album?.data?.albums?.images?.sort((a, b) => Number(b[0]) - Number(a[0])) ||
    [];
  const shared = album?.data?.albums?.shared || [];
  console.log(album.data);
  return (
    <div className="p-8 w-full h-full">
      {addPhoto && <AddPhoto setAddPhoto={setAddPhoto} />}
      {lightboxPhoto !== null && (
        <Lightbox
          photo={images[lightboxPhoto]}
          setLightboxPhoto={setLightboxPhoto}
        />
      )}
      <div className="h-full w-full p-8 bg-white rounded-xl flex flex-col space-y-8">
        <div className="flex justify-between">
          <Link to={`/album/${ship}/${albumId}`}>
            <p className="font-semibold">
              {album?.data?.album?.name || albumId}
            </p>
          </Link>
          <div className="flex space-x-8 font-semibold text-[#666666]">
            <p>Edit</p>
            <Link to={`/album/${ship}/${albumId}/shared`}>
              <p className={cn({
                "text-indigo-black": subview === "shared",
              })}>Participants</p>
            </Link>
          </div>
        </div>
        {!subview && (
          <div className="flex flex-wrap justify-center md:justify-normal gap-8 w-full h-full min-h-0 overflow-y-auto">
            {ship === `~${window.ship}` && (
              <div
                className="flex flex-col items-center justify-center border-[#999999] border rounded-lg w-32 h-32 font-semibold cursor-pointer"
                onClick={() => setAddPhoto(true)}
              >
                + Add Photo
              </div>
            )}
            {images?.map((image, i) => {
              return (
                <div
                  className="w-32 h-32 hover:bg-gray-100 cursor-pointer"
                  key={image[0]}
                  onClick={() => setLightboxPhoto(i)}
                >
                  <img
                    src={image[1]?.src}
                    alt=""
                    className="w-32 h-32 object-contain"
                  />
                </div>
              );
            })}
          </div>
        )}
        {subview === "shared" && (
          <div className="flex flex-col space-y-4 overflow-y-auto min-h-0">
            {shared.map((share) => {
              const contact = contacts.data?.[share[0]]?.nickname;
              return (
                <div key={share} className="flex space-x-4 w-full">
                  <p className="font-semibold w-full truncate">
                    {contact || share[0]}
                  </p>
                  {!disabledNicknames && contact && (
                    <p className="text-[#666666]">({share[0]})</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
