import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import { albumQuery, contactsQuery, settingsQuery } from "../state/query";
import { useCallback, useState } from "react";
import AddPhoto from "./AddPhoto";
import Contact from "./Contact";
import Lightbox from "./Lightbox";
import cn from "classnames";
import ContactSearch from "./ContactSearch";
import { api } from "../state/api";
import { GlobalHotKeys } from "react-hotkeys";
import { addPhotos, editMember, inviteSelected, unshare } from "../state/actions";

const keyMap = {
  BACK: "ArrowLeft",
  FORWARD: "ArrowRight",
  ESCAPE: "Escape",
};


export default function Album() {
  const [addPhoto, setAddPhoto] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { ship, albumId, subview } = useParams();
  const queryClient = useQueryClient();
  const { data: album } = useQuery({
    queryKey: ["album", ship, albumId],
    queryFn: () => albumQuery(albumId, ship),
  });
  const { data: contactsData } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => contactsQuery(),
  });
  const { data: settingsData } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsQuery(),
  });
  const { disableNicknames } = settingsData?.desk?.calmEngine || false;
  const { disableAvatars } = settingsData?.desk?.calmEngine || false;
  const images =
    album?.albums?.images?.sort((a, b) => Number(b[0]) - Number(a[0])) ||
    [];
  const shared = album?.albums?.shared || [];
  const our = ship === `~${window.ship}`;
  const write = album?.albums?.shared.find((e) => e[0] === `~${window.ship}`)?.[1] || false;

  const handlers = {
    BACK: useCallback(() => {
      if (lightboxPhoto !== null && lightboxPhoto > 0) {
        setLightboxPhoto((prev) => prev - 1);
      }
    }, [lightboxPhoto]),
    FORWARD: useCallback(() => {
      if (lightboxPhoto !== null && lightboxPhoto < images.length - 1) {
        setLightboxPhoto((prev) => prev + 1);
      }
    }, [lightboxPhoto]),
    ESCAPE: useCallback(() => {
      setLightboxPhoto(null);
    }, []),
  };

  const addPhotosToAlbum = async (files) => {
    addPhotos(files, albumId, ship).then(() => {
      queryClient.invalidateQueries(["album", ship, albumId]);
      setAddPhoto(false);
    });
  }
  return (
    <>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges={true} />
      <div className="w-full h-full min-h-0 flex flex-col">
        {addPhoto && <AddPhoto addPhotos={addPhotosToAlbum} setAddPhoto={setAddPhoto} />}
        {lightboxPhoto !== null && (
          <Lightbox
            photo={images[lightboxPhoto]}
            setLightboxPhoto={setLightboxPhoto}
            write={our || write}
          />
        )}
        {subview === "shared" && (
          <div className="flex h-full">
            <div className="p-8 h-full min-h-0 bg-white basis-full lg:basis-1/2 flex flex-col border-r-2 border-indigo-gray">
              <Link to=".">
                <p className="font-semibold w-full truncate block lg:hidden">
                  {"<-"} Back to {album?.albums?.name || albumId}
                </p>
              </Link>
              <div className="flex flex-col space-y-4 overflow-y-auto h-full w-full min-h-0 min-w-0 relative">
                {ship === `~${window.ship}` && (
                  <ContactSearch
                    contacts={contactsData}
                    disableNicknames={disableNicknames}
                    disableAvatars={disableAvatars}
                    group={shared}
                    selectedMembers={selectedMembers}
                    setSelectedMembers={setSelectedMembers}
                  />
                )}
                {selectedMembers.length > 0 && (
                  <div className="flex flex-col space-y-4 p-4 border rounded-md">
                    <h2 className="font-semibold text-sm">Members to Invite</h2>
                    {selectedMembers.map((member) => {
                      return (
                        <div
                          className="flex items-center justify-between space-x-2 w-full"
                          key={member[0]}
                        >
                          <Contact
                            ship={member[0]}
                            contact={contactsData?.[member[0]] || {}}
                            disableNicknames={disableNicknames}
                            disableAvatars={disableAvatars}
                          />
                          <select
                            className="bg-indigo-white border border-indigo-gray rounded-md text-xs font-semibold px-2 py-1"
                            value={member[1]}
                            onChange={(e) => {
                              setSelectedMembers((prev) =>
                                prev.map((m) =>
                                  m[0] === member[0]
                                    ? [m[0], e.target.value]
                                    : [m[0], m[1]],
                                ),
                              );
                            }}
                          >
                            <option value={false}>Viewer</option>
                            <option value={true}>Writer</option>
                          </select>
                          <button
                            className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md"
                            onClick={() =>
                              setSelectedMembers((prev) =>
                                prev.filter((m) => m[0] !== member[0]),
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                    <button
                      className="w-full bg-black text-white text-sm font-semibold rounded-md py-1 hover:bg-indigo-black"
                      onClick={() => {
                        inviteSelected(selectedMembers, albumId, ship).then(() => {
                          queryClient.invalidateQueries(["album", ship, albumId]);
                          setSelectedMembers([]);
                        });
                      }}
                    >
                      Invite
                    </button>
                  </div>
                )}
                {shared.map((share) => {
                  return (
                    <div className="flex w-full items-center justify-between space-x-2" key={share[0]}>
                      <Contact
                        ship={share[0]}
                        contact={contactsData?.[share[0]] || {}}
                        disableNicknames={disableNicknames}
                        disableAvatars={disableAvatars}
                        key={share[0]}
                      />
                      <select
                        className="bg-indigo-white border border-indigo-gray rounded-md text-xs font-semibold px-2 py-1"
                        value={share[1]}
                        onChange={(e) => {
                          editMember(share[0], albumId, ship, e.target.value).then(() => {
                            queryClient.invalidateQueries(["album", ship, albumId]);
                          });
                        }}
                        disabled={ship !== `~${window.ship}`}
                      >
                        <option value={false}>Viewer</option>
                        <option value={true}>Writer</option>
                      </select>
                      {ship === `~${window.ship}` && share[0] !== ship && (
                        <a
                          className="bg-red-500 text-white px-2 text-xs py-1 font-semibold rounded-md cursor-pointer hover:bg-red-400"
                          onClick={() => unshare(share[0], albumId, ship).then(() => {
                            queryClient.invalidateQueries(["album", ship, albumId]);
                          })}
                        >
                          Remove
                        </a>
                      )}
                    </div>
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
                our={our}
                write={write}
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
              our={our}
              write={write}
            />
          </div>
        )}
      </div>
    </>
  );
}

function Gallery({
  ship,
  albumId,
  subview,
  setAddPhoto,
  setLightboxPhoto,
  images,
  album,
  our,
  write
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const nuke = async () => {
    await api.poke({
      app: "albums",
      mark: "albums-action",
      json: { nuke: { name: albumId, owner: ship } },
    });
    queryClient.invalidateQueries(["albums"]);
    navigate("/");
  };
  return (
    <div className="h-full w-full p-8 bg-white rounded-xl flex flex-col space-y-8 overflow-y-auto min-h-0">
      <div className="flex justify-between rounded-md bg-white">
        <Link to={`/album/${ship}/${albumId}`}>
          <p className="font-semibold">{album?.album?.name || albumId}</p>
        </Link>
        <div className="flex space-x-8 font-semibold text-[#666666] items-center">
          <Link to={`/album/${ship}/${albumId}/shared`}>
            <p
              className={cn({
                "text-indigo-black": subview === "shared",
              })}
            >
              Participants
            </p>
          </Link>
          <button
            className="text-red-500 font-semibold rounded-md"
            onClick={() => nuke()}
          >
            {our ? "Delete" : "Remove"}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center md:justify-normal gap-8 w-full max-h-full min-h-0">
        {(our || write) && (
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
  );
}
