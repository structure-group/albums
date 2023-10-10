import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import { albumQuery, contactsQuery, settingsQuery } from "../state/query";
import useStorageState from "../state/storage";
import { useCallback, useEffect, useState } from "react";
import AddPhoto from "./AddPhoto";
import Contact from "./Contact";
import Lightbox from "./Lightbox";
import cn from "classnames";
import ContactSearch from "./ContactSearch";
import { api } from "../state/api";
import { GlobalHotKeys } from "react-hotkeys";
import {
  addPhotos,
  editAlbum,
  editMember,
  inviteSelected,
  unshare,
} from "../state/actions";

const keyMap = {
  BACK: "ArrowLeft",
  FORWARD: "ArrowRight",
  ESCAPE: "Escape",
};

export default function Album() {
  const [addPhoto, setAddPhoto] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const { ship, albumId, subview } = useParams();
  const queryClient = useQueryClient();
  const { data: album } = useQuery({
    queryKey: ["album", ship, albumId],
    queryFn: () => albumQuery(albumId, ship),
  });
  const images =
    album?.albums?.images?.sort((a, b) => Number(b[0]) - Number(a[0])) || [];
  const our = ship === `~${window.ship}`;
  const write =
    album?.albums?.shared.find((e) => e[0] === `~${window.ship}`)?.[1] || false;

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
  };
  return (
    <>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges={true} />
      <div className="w-full h-full min-h-0 flex flex-col">
        {addPhoto && (
          <AddPhoto addPhotos={addPhotosToAlbum} setAddPhoto={setAddPhoto} />
        )}
        {lightboxPhoto !== null && (
          <Lightbox
            cover={album?.albums?.cover || null}
            disableComments={!album?.albums?.["comment-perm"] || false}
            photo={images[lightboxPhoto]}
            setLightboxPhoto={setLightboxPhoto}
            write={our || write}
          />
        )}
        {(subview === "edit" || subview === "share") && (
          <EditFrame
            album={album}
            ship={ship}
            albumId={albumId}
            queryClient={queryClient}
            shareMode={subview === "share"}
          >
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
          </EditFrame>
        )}
        {!subview && (
          <div className="h-full bg-indigo-white flex flex-col min-h-0 p-[30px]">
            <Gallery
              ship={ship}
              albumId={albumId}
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

function EditFrame({ album, ship, albumId, queryClient, shareMode, children }) {
  const navigate = useNavigate();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState(false);
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
  const shared = album?.albums?.shared || [];

  useEffect(() => {
    setTitle(album?.albums?.title || albumId);
    setComments(album?.albums?.["comment-perm"] || false);
  }, [albumId, album]);

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
    <div className="flex h-full">
      <div className="p-[30px] h-full min-h-0 bg-white basis-full lg:basis-1/2 flex flex-col border-r-2 border-indigo-gray">
        <Link to={`/album/${ship}/${albumId}`}>
          <p className="font-semibold w-full truncate block lg:hidden mb-8">
            {"<-"} Back to {album?.albums?.name || albumId}
          </p>
        </Link>
        {ship === `~${window.ship}` && !shareMode && (
          <div className="space-y-[30px]">
            <p className="font-semibold text-lg">Edit Album</p>
            <div className="w-full space-y-2">
              <h3 className="text-sm font-semibold">Album Title</h3>
              <input
                type="text"
                className="bg-indigo-white rounded-md p-1 py-2 text-sm w-full"
                placeholder="My Great Photos"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2" onClick={() => setComments(!comments)}>
              <p className="font-semibold text-sm">Comments</p>
              <div className="flex items-center">
                <input className="toggle" type="checkbox" checked={comments} />
                <label className="ml-2 text-sm font-semibold">
                  {comments ? "Enabled" : "Disabled"}
                </label>
              </div>
            </div>
            <div className="space-y-2 flex flex-col">
              <p className="font-semibold text-sm">Delete</p>
              <a
                className="text-indigo-red font-semibold border-b border-indigo-red w-fit text-xs cursor-pointer"
                onClick={() => nuke()}
              >
                Delete album
              </a>
            </div>
            <div className="w-full flex justify-end space-x-2">
              <Link to={`/album/${ship}/${albumId}`}>
                <button
                  className="bg-indigo-white hover:bg-indigo-gray text-black text-sm px-4 py-2 rounded-md font-semibold"
                >
                  Cancel
                </button>
              </Link>
              <button
                className="bg-indigo-black text-white text-sm font-semibold rounded-md py-2 px-4 hover:brightness-110"
                onClick={() =>
                  editAlbum(albumId, ship, title, comments).then(() => {
                    queryClient.invalidateQueries(["album", ship, albumId]);
                  })
                }
              >
                Save
              </button>
            </div>
          </div>
        )}
        {shareMode && <div className="flex flex-col overflow-y-auto h-full w-full min-h-0 min-w-0 relative rounded-md">
          <p className="text-lg font-semibold mb-[30px]">Share</p>
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
          <div className="bg-indigo-white mt-2 p-3 rounded-lg flex flex-col space-y-3 max-h-60 overflow-y-auto">
            {shared.map((share) => {
              return (
                <div
                  className="flex w-full items-center justify-between space-x-2 bg-white p-2 rounded-[4px]"
                  key={share[0]}
                >
                  <Contact
                    ship={share[0]}
                    contact={contactsData?.[share[0]] || {}}
                    disableNicknames={disableNicknames}
                    disableAvatars={disableAvatars}
                    key={share[0]}
                  />
                  {ship !== share[0] ? <select
                    value={share[1]}
                    onChange={(e) => {
                      editMember(share[0], albumId, ship, e.target.value).then(
                        () => {
                          queryClient.invalidateQueries(["album", ship, albumId]);
                        },
                      );
                    }}
                    disabled={ship !== `~${window.ship}`}
                  >
                    <option value={false}>Viewer</option>
                    <option value={true}>Writer</option>
                  </select> : <p className="font-semibold py-2 px-4 text-[#666666]">Owner</p>}
                  {ship === `~${window.ship}` && share[0] !== ship && (
                    <a
                      className="bg-red-500 text-white px-4 text-sm py-2 font-semibold rounded-lg cursor-pointer hover:bg-red-400"
                      onClick={() =>
                        unshare(share[0], albumId, ship).then(() => {
                          queryClient.invalidateQueries(["album", ship, albumId]);
                        })
                      }
                    >
                      Remove
                    </a>
                  )}
                </div>
              );
            })}
            {selectedMembers.length > 0 && selectedMembers.map((member) => {
              return (
                <div
                  className="flex items-center justify-between space-x-2 w-full bg-white p-2 rounded-[4px]"
                  key={member[0]}
                >
                  <Contact
                    ship={member[0]}
                    contact={contactsData?.[member[0]] || {}}
                    disableNicknames={disableNicknames}
                    disableAvatars={disableAvatars}
                  />
                  <select
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
                    className="bg-red-500 text-white px-4 text-sm py-2 font-semibold rounded-lg cursor-pointer hover:bg-red-400"
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
          </div>
          <div className="w-full flex justify-end mt-2">
            <button
              className="bg-indigo-black text-white text-sm font-semibold rounded-md py-2 px-4 hover:brightness-110"
              onClick={() => {
                if (selectedMembers.length > 0) {
                  inviteSelected(selectedMembers, albumId, ship).then(() => {
                    queryClient.invalidateQueries(["album", ship, albumId]);
                    setSelectedMembers([]);
                  });
                }
                navigate(`/album/${ship}/${albumId}`)
              }}
            >Done</button>
          </div>
        </div>}
      </div>
      <div className="overflow-x-auto min-h-0 bg-indigo-white h-full lg:basis-1/2 p-[30px] hidden lg:flex flex-col">
        <div style={{ width: "calc(100% + 400px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Gallery({
  ship,
  albumId,
  setAddPhoto,
  setLightboxPhoto,
  images,
  album,
  our,
  write,
}) {
  const { s3 } = useStorageState();
  const { credentials } = s3 ?? { credentials: { accessKeyId: "" } };

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
    <div className="h-full w-full p-[30px] bg-white rounded-xl flex flex-col space-y-[30px] overflow-y-auto min-h-0">
      <div className="flex justify-between rounded-md bg-white">
        <Link to={`/album/${ship}/${albumId}`}>
          <p className="font-semibold">{album?.albums?.title || albumId}</p>
        </Link>
        <div className="flex space-x-[30px] font-semibold text-[#666666] items-center">
          {(our || write) && credentials?.accessKeyId && (
            <button
              className="cursor-pointer bg-indigo-white text-indigo-black py-2 px-4 text-sm rounded-lg hover:bg-indigo-gray"
              onClick={() => setAddPhoto(true)}
            >
              Add Photos
            </button>
          )}
          {our && <Link to={`/album/${ship}/${albumId}/edit`}>
            <button
              className={cn("bg-indigo-white text-indigo-black py-2 px-4 text-sm rounded-lg hover:bg-indigo-gray")}
            >
              Edit
            </button>
          </Link>}
          {!our && <button
            className={cn("bg-indigo-white text-indigo-black py-2 px-4 text-sm rounded-lg hover:bg-indigo-gray")}
            onClick={() => nuke()}
          >
            Unsubscribe
          </button>}
          <Link to={`/album/${ship}/${albumId}/share`}>
            <button
              className={cn("bg-indigo-black text-white py-2 px-4 text-sm rounded-lg hover:brightness-110")}
            >
              Share
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap justify-center md:justify-normal gap-[30px] w-full max-h-full min-h-0">
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
