import Foco from "react-foco";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { contactsQuery, settingsQuery } from "../state/query";
import { daToDate } from "@urbit/api";
import Contact from "./Contact";
import { addComment, changeCover, deletePhoto } from "../state/actions";

export default function Lightbox({
  cover,
  photo,
  disableComments,
  setLightboxPhoto,
  write,
}) {
  const [comment, setComment] = useState("");
  const { ship, albumId } = useParams();
  const commentBox = useRef(null);
  const queryClient = useQueryClient();
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
  const comments = photo[1]?.comments;

  useEffect(() => {
    if (commentBox.current) {
      commentBox.current.scrollTop = commentBox.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.25)] w-full h-full flex flex-col items-center justify-center space-y-8 p-8 z-40">
      <Foco
        className="flex flex-col items-center justify-center"
        onClickOutside={() => setLightboxPhoto(null)}
      >
        <div className="absolute top-0 right-0 w-full flex justify-end space-x-4 z-20 p-4 items-center">
          <a
            className="bg-indigo-black text-xs font-semibold px-2 py-1 rounded-md text-white"
            href={photo[1]?.src}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            Source
          </a>
          {ship === `~${window.ship}` && (
            <a
              className="bg-indigo-black text-xs font-semibold px-2 py-1 rounded-md text-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                changeCover(albumId, ship, photo[1]?.src).then(() => {
                  queryClient.invalidateQueries(["album", ship, albumId]);
                  setLightboxPhoto(null);
                });
              }}
            >
              Set Cover
            </a>
          )}
          {write && (
            <a
              className="bg-red-500 text-xs font-semibold px-2 py-1 rounded-md text-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (photo[1]?.src === cover) {
                  changeCover(albumId, ship, "").then(() => {
                    queryClient.invalidateQueries(["album", ship, albumId]);
                  });
                }
                deletePhoto(albumId, ship, photo).then(() => {
                  setLightboxPhoto(null);
                  queryClient.invalidateQueries(["album", ship, albumId]);
                });
              }}
            >
              Delete
            </a>
          )}
        </div>
        <div className="h-full w-full flex flex-col lg:flex-row justify-center shadow-md">
          <img
            src={photo[1]?.src}
            alt=""
            className="min-w-0 min-h-0 max-h-[90vh] object-contain"
          />
          {!disableComments && (
            <div className="bg-white relative rounded-tr-md rounded-br-md p-4 flex flex-col min-h-0 justify-end lg:w-full max-h-96 lg:max-h-[90vh] basis-1/3 space-y-4">
              <div
                className="flex flex-col min-h-0 overflow-y-auto space-y-8"
                ref={commentBox}
              >
                {comments?.map((comment) => {
                  const { who, when, what } = comment[1] || {
                    who: "~hastuc-dibtux",
                    when: "~2018.7.17..23.15.09..5be5",
                    what: "unknown",
                  };
                  return (
                    <div className="flex flex-col space-y-1" key={when}>
                      <Contact
                        ship={who}
                        contact={contactsData?.[who] || {}}
                        disableNicknames={disableNicknames}
                        disableAvatars={disableAvatars}
                      />
                      <p className="text-xs text-gray-400">
                        {daToDate(
                          when || "~2018.7.17..23.15.09..5be5",
                        ).toLocaleString()}
                      </p>
                      <p className="text-sm">{what}</p>
                    </div>
                  );
                })}
              </div>
              <textarea
                className="w-full sticky bottom-0 h-16 resize-none border border-indigo-gray p-2 rounded-md shrink-0"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addComment(albumId, ship, photo, comment).then(() => {
                      setComment("");
                      queryClient.invalidateQueries(["album", ship, albumId]);
                    });
                  }
                }}
              />
            </div>
          )}
        </div>
      </Foco>
    </div>
  );
}
