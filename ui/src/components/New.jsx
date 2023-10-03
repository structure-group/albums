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

export default function NewAlbum() {
  const [title, setTitle] = useState("");
  const [addPhoto, setAddPhoto] = useState(false);
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
  const stripTitle = title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();

  const addPhotos = (photos) => {
    setSelectedPhotos([...selectedPhotos, ...photos]);
    setAddPhoto(false);
  }

  const createAlbum = async () => {
    try {
      await api.poke({
        app: "albums",
        mark: "albums-action",
        json: {
          "create": { name: stripTitle }
        }
      })
    } catch (e) {
      console.error(e);
    } finally {
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
  }

  return (
    <div className="flex w-full h-full">
      {addPhoto && <AddPhoto addPhotos={addPhotos} setAddPhoto={setAddPhoto} />}
      <div className="p-8 h-full bg-white basis-full md:basis-1/2 flex flex-col space-y-8 border-r-2 border-indigo-gray overflow-y-auto pb-24">
        {!shareStep ? <>
          <h2 className="font-semibold text-lg">New Album</h2>
          <div className="flex flex-col space-y-1">
            <h3 className="text-sm font-semibold">Album Title</h3>
            <input
              type="text"
              className="bg-indigo-white rounded-md p-1 py-2 text-sm"
              placeholder="My Great Photos"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-start space-y-1">
            <h3 className="text-sm font-semibold">Images</h3>
            <div className="bg-indigo-white rounded-md border-2 border-dashed border-indigo-gray w-full p-2 flex flex-wrap gap-4 overflow-y-auto max-h-48">
              {selectedPhotos.length === 0 && <p className="text-sm">No photos selected</p>}
              {selectedPhotos.map((photo) => (
                <img
                  src={photo}
                  alt="selected"
                  className="h-20 w-20 object-cover rounded-md cursor-pointer border border-transparent hover:border-red-500"
                  onClick={() => setSelectedPhotos(selectedPhotos.filter((p) => p !== photo))}
                />
              ))}
            </div>
            <a
              className="font-semibold text-sm bg-black hover:bg-indigo-black text-white w-full py-1 px-2 text-center rounded-md cursor-pointer"
              onClick={() => setAddPhoto(true)}
            >
              Select or upload photos
            </a>
          </div>
          <button
            className="font-semibold bg-black hover:bg-indigo-black text-white w-full py-1 px-2 text-center rounded-md"
            onClick={createAlbum}
          >Create Album
          </button>
        </>
          :
          <>
            <h2 className="font-semibold text-lg">Share Album</h2>
            <div className="w-full relative">
              <ContactSearch
                contacts={contacts}
                disabledNicknames={disabledNicknames}
                disabledAvatars={disabledAvatars}
                group={[]}
                selectedMembers={selectedMembers}
                setSelectedMembers={setSelectedMembers}
              />
            </div>
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
                        contact={contacts.data?.[member[0]] || {}}
                        disabledNicknames={disabledNicknames}
                        disabledAvatars={disabledAvatars}
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
                    inviteSelected(selectedMembers, stripTitle, `~${window.ship}`).then(() => {
                      queryClient.invalidateQueries(["album", `~${window.ship}`, stripTitle]);
                    });
                    navigate(`/album/~${window.ship}/${stripTitle}`)
                  }}
                >
                  Invite
                </button>
              </div>
            )}
            {selectedMembers.length === 0 && (
              <button
                className="font-semibold text-sm bg-black hover:bg-indigo-black text-white w-full py-1 px-2 text-center rounded-md"
                onClick={() => navigate(`/album/~${window.ship}/${stripTitle}`)}
              >
                Finish
              </button>
            )}
          </>
        }
      </div>
      <div className="overflow-x-auto basis-1/2 hidden md:block">
        <Albums />
      </div>
    </div>
  );
}
