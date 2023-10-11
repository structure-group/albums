import Albums from "./Albums";
import { useState } from "react";
import AddPhoto from "./AddPhoto";
import { api } from "../state/api";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { decToUd, unixToDa } from "@urbit/api";
import ContactSearch from "./ContactSearch";
import Contact from "./Contact";
import { contactsQuery, settingsQuery } from "../state/query";
import { useNavigate } from "react-router-dom";
import { inviteSelected } from "../state/actions";
import cn from "classnames";

export default function NewAlbum() {
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState(true);
  const [clickMode, setClickMode] = useState("cover");
  const [addPhoto, setAddPhoto] = useState(false);
  const [cover, setCover] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [shareStep, setShareStep] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const contacts = useQuery({
    queryKey: ["contacts"],
    queryFn: () => contactsQuery(),
  });
  const settings = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsQuery(),
  });
  const disabledNicknames =
    settings.data?.desk?.calmEngine?.disableNicknames || false;
  const disabledAvatars =
    settings.data?.desk?.calmEngine?.disableAvatars || false;
  const stripTitle = title
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  const addPhotos = (photos) => {
    setSelectedPhotos([...selectedPhotos, ...photos]);
    setAddPhoto(false);
  };

  const createAlbum = async () => {
    try {
      await api.poke({
        app: "albums",
        mark: "albums-action",
        json: {
          create: {
            name: stripTitle,
            title,
            "comment-perm": Boolean(comments),
          },
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      if (cover) {
        await api.poke({
          app: "albums",
          mark: "albums-action",
          json: {
            cover: {
              "album-id": { name: stripTitle, owner: `~${window.ship}` },
              cover,
            },
          },
        });
      }
      const promises = selectedPhotos.map((url, i) => {
        return api.poke({
          app: "albums",
          mark: "albums-action",
          json: {
            add: {
              "album-id": { name: stripTitle, owner: `~${window.ship}` },
              "img-id": String(Math.floor(Date.now() / 1000) + i),
              src: url,
              caption: {
                who: `~${window.ship}`,
                when: decToUd(`${unixToDa(Date.now())}`),
                what: "",
              },
            },
          },
        });
      });
      Promise.all(promises).then(() => {
        queryClient.invalidateQueries(["albums"]);
        queryClient.invalidateQueries(["album", `~${window.ship}`, stripTitle]);
        setShareStep(true);
      });
    }
  };

  return (
    <div className="flex w-full h-full">
      {addPhoto && <AddPhoto addPhotos={addPhotos} setAddPhoto={setAddPhoto} />}
      <div className="p-[30px] h-full bg-white basis-full md:basis-1/2 flex flex-col border-r-2 border-indigo-gray overflow-y-auto pb-24">
        {!shareStep ? (
          <>
            <h2 className="font-semibold text-lg mb-2">New Album</h2>
            <div className="flex flex-col space-y-1 mb-8">
              <h3 className="text-sm font-semibold">Album Title</h3>
              <input
                type="text"
                className="bg-indigo-white rounded-md p-1 py-2 text-sm"
                placeholder="My Great Photos"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start space-y-2 text-sm mb-8">
              <h3 className="text-sm font-semibold">Images</h3>
              <div className="flex justify-between w-full">
                <div className="flex space-x-2">
                  <a
                    className="font-semibold text-sm bg-indigo-black hover:bg-brightness-110 text-white py-1 px-2 text-center rounded-md cursor-pointer"
                    onClick={() => setAddPhoto(true)}
                  >
                    Select Photos
                  </a>
                  <a
                    className={cn(
                      "font-semibold text-sm hover:bg-brightness-110 py-1 px-2 text-center rounded-md cursor-pointer",
                      {
                        "bg-indigo-black text-white": clickMode === "cover",
                        "bg-indigo-white text-black": clickMode !== "cover",
                      },
                    )}
                    onClick={() => setClickMode("cover")}
                  >
                    Select Cover
                  </a>
                </div>
                <a
                  className={cn(
                    "font-semibold text-sm hover:bg-brightness-110 py-1 px-2 text-center rounded-md cursor-pointer",
                    {
                      "bg-indigo-red text-white": clickMode === "delete",
                      "bg-indigo-white text-black": clickMode !== "delete",
                    },
                  )}
                  onClick={() => setClickMode("delete")}
                >
                  Delete
                </a>
              </div>
              <div className="bg-indigo-white rounded-md border-2 border-dashed border-indigo-gray w-full p-2 flex flex-wrap gap-4 overflow-y-auto max-h-48">
                {selectedPhotos.length === 0 && (
                  <p className="text-sm">No photos selected</p>
                )}
                {selectedPhotos.map((photo) => {
                  return (
                    <div
                      className={cn(
                        "h-20 w-20 relative rounded-md overflow-hidden",
                        {
                          "badge-it": cover === photo,
                          "": cover !== photo,
                        },
                      )}
                      onClick={() => {
                        if (clickMode === "delete") {
                          setSelectedPhotos((prev) =>
                            prev.filter((p) => p !== photo),
                          );
                          if (cover === photo) {
                            setCover(null);
                          }
                        } else if (clickMode === "cover") {
                          setCover(photo);
                        }
                      }}
                    >
                      <img
                        src={photo}
                        alt="selected"
                        className="h-full w-full object-cover cursor-pointer overflow-hidden"
                      />
                    </div>
                  );
                })}
              </div>
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
            <div className="flex justify-end w-full space-x-2">
              <button
                className="font-semibold bg-indigo-white hover:bg-indigo-gray w-fit py-2 px-4 text-center text-sm rounded-md"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              <button
                className="font-semibold bg-black hover:bg-indigo-black text-white w-fit py-2 px-4 text-sm text-center rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => createAlbum()}
                disabled={title.length === 0}
              >
                Create Album
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-semibold text-lg">Share Album</h2>
            <div className="w-full relative my-2">
              <ContactSearch
                contacts={contacts.data}
                disabledNicknames={disabledNicknames}
                disabledAvatars={disabledAvatars}
                group={[]}
                selectedMembers={selectedMembers}
                setSelectedMembers={setSelectedMembers}
              />
            </div>
            <div className="bg-indigo-white mt-2 p-3 rounded-lg flex flex-col space-y-3 max-h-60 overflow-y-auto mb-4">
              {selectedMembers.length > 0 &&
                selectedMembers.map((member) => {
                  return (
                    <div
                      className="flex items-center justify-between space-x-2 w-full bg-white p-2 rounded-[4px]"
                      key={member[0]}
                    >
                      <Contact
                        ship={member[0]}
                        contact={contacts.data?.[member[0]] || {}}
                        disabledNicknames={disabledNicknames}
                        disabledAvatars={disabledAvatars}
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
            <div className="flex w-full justify-end">
              <button
                className="bg-indigo-black text-white text-sm font-semibold rounded-md py-2 px-4 hover:brightness-110"
                onClick={() => {
                  if (selectedMembers.length > 0) {
                    inviteSelected(
                      selectedMembers,
                      stripTitle,
                      `~${window.ship}`,
                    ).then(() => {
                      queryClient.invalidateQueries([
                        "album",
                        `~${window.ship}`,
                        stripTitle,
                      ]);
                    });
                  }
                  navigate(`/album/~${window.ship}/${stripTitle}`);
                }}
              >
                Finish
              </button>
            </div>
          </>
        )}
      </div>
      <div className="basis-1/2 hidden md:block overflow-x-auto">
        <div style={{ width: "calc(100% + 340px)" }}>
          <Albums />
        </div>
      </div>
    </div>
  );
}
