import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { albumQuery, contactsQuery, settingsQuery } from "../state/query";
import useStorageState from "../state/storage";
import { useCallback, useEffect, useState, useRef } from "react";
import AddPhoto from "./AddPhoto";
import Contact from "./Contact";
import Lightbox from "./Lightbox";
import LoadWrapper from "./LoadWrapper";
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
import Foco from "react-foco";

const keyMap = {
  BACK: "ArrowLeft",
  FORWARD: "ArrowRight",
  ESCAPE: "Escape",
};

export default function Album() {
  const [addPhoto, setAddPhoto] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const { ship, albumId, subview } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: album, isLoading } = useQuery({
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

  useEffect(() => {
    if (subview !== "edit" && subview !== "share") {
      const photoMatch = images.findIndex((e) => e[0] === subview);
      if (photoMatch !== -1) {
        navigate(`/album/${ship}/${albumId}`)
        setLightboxPhoto(photoMatch);
      }
    }
  }, [subview, navigate, setLightboxPhoto, images, ship, albumId]);
  const addPhotosToAlbum = async (files) => {
    addPhotos(files, albumId, ship).then(() => {
      queryClient.invalidateQueries(["album", ship, albumId]);
      setAddPhoto(false);
    });
  };

  return (
    <LoadWrapper loaders={[isLoading]}>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges={true} />
      <div className="w-full h-full min-h-0 flex flex-col">
        {addPhoto && (
          <AddPhoto addPhotos={addPhotosToAlbum} setAddPhoto={setAddPhoto} />
        )}
        {lightboxPhoto !== null && (
          <Lightbox
            album={album}
            cover={album?.albums?.cover || null}
            disableComments={!album?.albums?.["comment-perm"] || false}
            handlers={handlers}
            first={lightboxPhoto === 0}
            last={lightboxPhoto === images.length - 1}
            photo={images[lightboxPhoto]}
            photoNumber={lightboxPhoto + 1}
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
          <div className="h-full dark:bg-[#252526] bg-indigo-white flex flex-col min-h-0 p-[30px]">
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
    </LoadWrapper>
  );
}

function EditFrame({ album, ship, albumId, queryClient, shareMode, children }) {
  const navigate = useNavigate();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [title, setTitle] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const panel = useRef(null);
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
      {showDelete && (
        <div className="fixed top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.25)] z-50 flex items-center justify-center">
          <Foco
            onClickOutside={() => setShowDelete(false)}
          >
            <div className="bg-white dark:bg-[#252526] text-black dark:text-white rounded-[10px] p-4 flex flex-col space-y-4">
              <h2 className="font-semibold text-lg">Delete album</h2>
              <p className="text-sm">Are you sure you want to delete this album? Current subscribers will retain an archived copy.</p>
              <div className="flex w-full justify-end space-x-[15px]">
                <button
                  className="dark:bg-[#252526] bg-indigo-white hover:bg-indigo-gray dark:hover:bg-indigo-black text-black dark:text-white text-sm px-4 py-2 rounded-md font-semibold"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white text-sm font-semibold rounded-md py-2 px-4 hover:brightness-110"
                  onClick={() => {
                    setShowDelete(false);
                    nuke();
                  }}>
                  Delete
                </button>
              </div>
            </div>
          </Foco>
        </div>
      )}
      <div
        className="p-[30px] h-full min-h-0 bg-white dark:bg-[#1E1E1E] basis-full lg:basis-1/2 flex flex-col border-r-2 border-indigo-gray dark:border-[#131314] slide-in"
        ref={panel}
      >
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
                className="dark:bg-[#252526] bg-indigo-white rounded-md p-1 py-2 text-sm w-full"
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
                onClick={() => setShowDelete(true)}
              >
                Delete album
              </a>
            </div>
            <div className="w-full flex justify-end space-x-2">
              <button
                className="dark:bg-[#252526] bg-indigo-white hover:bg-indigo-gray dark:hover:bg-indigo-black text-black dark:text-white text-sm px-4 py-2 rounded-md font-semibold"
                onClick={() => {
                  panel.current.classList.add("slide-out");
                  setTimeout(() => {
                    navigate(`/album/${ship}/${albumId}`);
                  }, 100);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-black text-white text-sm font-semibold rounded-md py-2 px-4 hover:brightness-110"
                onClick={() =>
                  editAlbum(albumId, ship, title, comments).then(() => {
                    queryClient.invalidateQueries(["album", ship, albumId]);
                    panel.current.classList.add("slide-out");
                    setTimeout(() => {
                      navigate(`/album/${ship}/${albumId}`, {
                        state: { saved: true },
                      });
                    }, 100);
                  })
                }
              >
                Save
              </button>
            </div>
          </div>
        )}
        {shareMode && (
          <div className="flex flex-col overflow-y-auto h-full w-full min-h-0 min-w-0 relative rounded-md">
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
            <div className="dark:bg-[#252526] bg-indigo-white mt-2 p-3 rounded-lg flex flex-col space-y-3 max-h-60 overflow-y-auto">
              {shared.map((share) => {
                return (
                  <div
                    className="flex w-full items-center justify-between space-x-2 bg-white dark:bg-[#1E1E1E] p-2 rounded-[4px]"
                    key={share[0]}
                  >
                    <Contact
                      ship={share[0]}
                      contact={contactsData?.[share[0]] || {}}
                      disableNicknames={disableNicknames}
                      disableAvatars={disableAvatars}
                      key={share[0]}
                    />
                    {ship !== share[0] ? (
                      <select
                        value={share[1]}
                        onChange={(e) => {
                          editMember(
                            share[0],
                            albumId,
                            ship,
                            e.target.value,
                          ).then(() => {
                            queryClient.invalidateQueries([
                              "album",
                              ship,
                              albumId,
                            ]);
                          });
                        }}
                        disabled={ship !== `~${window.ship}`}
                      >
                        <option value={false}>Viewer</option>
                        <option value={true}>Writer</option>
                      </select>
                    ) : (
                      <p className="font-semibold py-2 px-4 text-[#666666]">
                        Owner
                      </p>
                    )}
                    {ship === `~${window.ship}` && share[0] !== ship && (
                      <a
                        className="bg-red-500 text-white px-4 text-sm py-2 font-semibold rounded-lg cursor-pointer hover:bg-red-400"
                        onClick={() =>
                          unshare(share[0], albumId, ship).then(() => {
                            queryClient.invalidateQueries([
                              "album",
                              ship,
                              albumId,
                            ]);
                          })
                        }
                      >
                        Remove
                      </a>
                    )}
                  </div>
                );
              })}
              {selectedMembers.length > 0 &&
                selectedMembers.map((member) => {
                  return (
                    <div
                      className="flex items-center justify-between space-x-2 w-full bg-white dark:bg-[#1E1E1E] p-2 rounded-[4px]"
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
                  panel.current.classList.add("slide-out");
                  setTimeout(() => {
                    navigate(`/album/${ship}/${albumId}`);
                  }, 100);
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="overflow-x-auto min-h-0 dark:bg-[#252526] bg-indigo-white h-full lg:basis-1/2 p-[30px] hidden lg:flex flex-col">
        <div style={{ width: "calc(100% + 400px)" }}>{children}</div>
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
  const queryClient = useQueryClient();
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const location = useLocation();
  const { saved } = location.state || { saved: false };
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
    <>
      {saved && (
        <div className="fixed w-screen h-screen top-0 left-0 flex justify-center items-center wait-and-fade">
          <div className="bg-white dark:bg-[#1E1E1E] shadow-md rounded-md p-4 text-sm text-black dark:text-white">
            Changes saved!
          </div>
        </div>
      )}
      {showUnsubscribe && (
        <div className="fixed top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.25)] z-50 flex items-center justify-center">
          <Foco
            onClickOutside={() => setShowUnsubscribe(false)}
          >
            <div className="bg-white dark:bg-[#252526] text-black dark:text-white rounded-[10px] p-4 flex flex-col space-y-4">
              <h2 className="font-semibold text-lg">Unsubscribe "{album?.albums?.title || albumId}"</h2>
              <p className="text-sm max-w-prose">This will delete this album from your computer.  Other viewers will still retain access. This action is irreversible.</p>
              <div className="flex w-full justify-end space-x-[15px]">
                <button
                  className="font-semibold bg-indigo-white dark:bg-indigo-black dark:hover:bg-indigo-black dark:hover:brightness-110 text-black hover:bg-indigo-gray dark:text-white w-fit py-2 px-4 text-sm text-center rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowUnsubscribe(false)}
                >
                  Cancel
                </button>
                <button
                  className="font-semibold bg-indigo-black hover:brightness-110 text-white w-fit py-2 px-4 text-sm text-center rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    setShowUnsubscribe(false);
                    nuke();
                  }}>
                  Unsubscribe
                </button>
              </div>
            </div>
          </Foco>
        </div>
      )}
      <div className="h-full w-full p-[30px] bg-white dark:bg-[#1E1E1E] rounded-xl flex flex-col space-y-[30px] overflow-y-auto min-h-0">
        <div className="flex flex-col space-y-2 md:space-y-0 lg:flex-row lg:justify-between rounded-md bg-white dark:bg-[#1E1E1E]">
          <div className="flex items-center space-x-2">
            <Link to={`/album/${ship}/${albumId}`}>
              <p className="font-semibold">{album?.albums?.title || albumId}</p>
            </Link>
            {album?.albums?.archive && (
              <p className="text-sm dark:bg-[#252526] bg-indigo-white px-2 py-1 rounded-md text-[#666666]">Archive</p>
            )}
          </div>
          <div className="flex space-x-[15px] font-semibold text-[#666666] items-center">
            {(our || write) && credentials?.accessKeyId && !album?.albums?.archive && (
              <button
                className="cursor-pointer dark:bg-[#252526] dark:hover:bg-indigo-black bg-indigo-white text-indigo-black dark:text-white py-2 px-4 text-sm rounded-lg hover:bg-indigo-gray"
                onClick={() => setAddPhoto(true)}
              >
                Add Photos
              </button>
            )}
            {our && (
              <Link to={`/album/${ship}/${albumId}/edit`}>
                <button
                  className={cn(
                    "dark:bg-[#252526] dark:hover:bg-indigo-black bg-indigo-white text-indigo-black dark:text-white py-2 px-4 text-sm rounded-lg hover:bg-indigo-gray",
                  )}
                >
                  Edit
                </button>
              </Link>
            )}
            {!our && (
              <button
                className={cn(
                  "dark:bg-[#252526] bg-indigo-white text-indigo-black dark:text-white py-2 px-4 text-sm rounded-lg hover:bg-indigo-gray dark:hover:bg-indigo-black",
                )}
                onClick={() => setShowUnsubscribe(true)}
              >
                Unsubscribe
              </button>
            )}
            {!album?.albums?.archive && <Link to={`/album/${ship}/${albumId}/share`}>
              <button
                className={cn(
                  "bg-indigo-black text-white py-2 px-4 text-sm rounded-lg hover:brightness-110",
                )}
              >
                Share
              </button>
            </Link>}
          </div>
        </div>
        <div className="flex flex-wrap justify-center md:justify-normal gap-[30px] w-full max-h-full min-h-0">
          {images?.map((image, i) => {
            return (
              <div
                className="w-[200px] h-[200px] hover:bg-gray-100 hover:dark:bg-[rgba(0,0,0,0.1)] cursor-pointer"
                key={image[0]}
                onClick={() => setLightboxPhoto(i)}
              >
                <img
                  src={image[1]?.src}
                  alt=""
                  className="w-[200px] h-[200px] object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
