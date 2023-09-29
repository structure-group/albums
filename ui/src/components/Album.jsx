import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { albumQuery, contactsQuery, settingsQuery } from "../state/query";
import { useState } from "react";
import AddPhoto from "./AddPhoto";
import Contact from "./Contact";
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
    settings.data?.desk?.calmEngine?.disableNicknames || false;
  const disabledAvatars =
    settings.data?.desk?.calmEngine?.disableAvatars || false;
  const images =
    album?.data?.albums?.images?.sort((a, b) => Number(b[0]) - Number(a[0])) ||
    [];
  const shared = album?.data?.albums?.shared || [];
  console.log(album.data);
  return (
    <div className="w-full h-full min-h-0 flex flex-col">
      {addPhoto && <AddPhoto setAddPhoto={setAddPhoto} />}
      {lightboxPhoto !== null && (
        <Lightbox
          photo={images[lightboxPhoto]}
          setLightboxPhoto={setLightboxPhoto}
        />
      )}
      {subview === "shared" && (
        <div className="flex h-full">
          <div className="p-8 h-full min-h-0 bg-white basis-full lg:basis-1/2 flex flex-col space-y-8 border-r-2 border-indigo-gray">
            <Link to=".">
              <p className="font-semibold w-full truncate block lg:hidden">
                {"<-"} Back to {album?.data?.album?.name || albumId}
              </p>
            </Link>
            <div className="flex flex-col space-y-4 overflow-y-auto h-full w-full min-h-0 min-w-0 relative">
              <input
                type="text"
                className="p-2 w-full text-sm bg-indigo-white rounded-md "
                placeholder="Search for people to invite to album..."
              />
              {shared.map((share) => {
                console.log(contacts.data?.[share[0]])
                return (
                  <Contact
                    ship={share[0]}
                    contact={contacts.data?.[share[0]] || {}}
                    disabledNicknames={disabledNicknames}
                    disabledAvatars={disabledAvatars}
                  />
                );
              })}
            </div>
          </div>
          <div className="overflow-x-auto min-h-0 bg-indigo-white h-full lg:basis-1/2 p-8 hidden lg:flex flex-col">
            <Gallery
              ship={ship}
              albumId={albumId}
              subview={subview}
              setAddPhoto={setAddPhoto}
              setLightboxPhoto={setLightboxPhoto}
              images={images}
              album={album}
            />
          </div>
        </div>
      )}
      {!subview && (
        <div className="h-full bg-indigo-white flex flex-col min-h-0 p-8">
          <Gallery
            ship={ship}
            albumId={albumId}
            subview={subview}
            setAddPhoto={setAddPhoto}
            setLightboxPhoto={setLightboxPhoto}
            images={images}
            album={album}
          />
        </div>
      )}
    </div>
  );
}

function Gallery({ ship, albumId, subview, setAddPhoto, setLightboxPhoto, images, album }) {
  return (
    <div className="h-full w-full p-8 bg-white rounded-xl flex flex-col space-y-8 overflow-y-auto min-h-0">
      <div className="flex justify-between rounded-md bg-white">
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
      <div className="flex flex-wrap justify-center md:justify-normal gap-8 w-full max-h-full min-h-0">
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
    </div>
  )
}