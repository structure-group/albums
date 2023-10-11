import Foco from "react-foco";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { contactsQuery, settingsQuery } from "../state/query";
import { daToDate } from "@urbit/api";
import Contact from "./Contact";
import { addComment, changeCover, deletePhoto } from "../state/actions";
import cn from 'classnames'

export default function Lightbox({
  cover,
  photo,
  first,
  last,
  handlers,
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
    <div className="fixed top-0 left-0 bg-indigo-black w-full h-full flex flex-col items-center justify-center space-y-[30px] p-[14px] z-40">
      <div className="h-full w-full flex flex-col lg:flex-row justify-center">
        <div className="min-w-0 min-h-0 flex justify-between basis-1/2 lg:basis-3/4 lg:pr-[14px]">
          {!first ? <div
            className={cn("bg-[rgba(0,0,0,0.3)] hover:bg-[rgba(0,0,0,0.1)] flex flex-col justify-center h-full rounded-[10px] px-8")}
            onClick={() => handlers.BACK()}
          >
            <svg width="14" height="28" viewBox="0 0 14 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.0718949 14.0863C0.0965044 14.4215 0.231271 14.7379 0.456256 14.9863L11.2563 26.9863C11.5223 27.2828 11.8949 27.4609 12.2922 27.482C12.6894 27.5031 13.0797 27.3648 13.375 27.0988C13.6715 26.8328 13.8496 26.4602 13.8707 26.0629C13.8918 25.6656 13.7535 25.2766 13.4875 24.9801L3.5875 13.9833L13.4875 2.98649C13.7535 2.69117 13.8918 2.30213 13.8707 1.90367C13.8496 1.50641 13.6715 1.13375 13.375 0.867735C13.0797 0.601719 12.6894 0.464596 12.2922 0.485716C11.8949 0.506809 11.5223 0.684934 11.2563 0.980236L0.456256 12.9802C0.183208 13.2826 0.044925 13.6809 0.0718949 14.0863Z" fill="white" />
            </svg>
          </div> : <div className="px-8 h-full" />}
          <img
            src={photo[1]?.src}
            alt=""
            className="min-w-0 min-h-0 object-contain select-none"
          />
          {!last ? <div
            className={cn("bg-[rgba(0,0,0,0.3)] hover:bg-[rgba(0,0,0,0.1)] flex flex-col justify-center h-full rounded-[10px] px-8")}
            onClick={() => handlers.FORWARD()}
          >
            <svg width="14" height="28" viewBox="0 0 14 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8988 13.8802C13.8742 13.5451 13.7394 13.2286 13.5144 12.9802L2.71445 0.980215C2.44843 0.683731 2.07578 0.505615 1.67852 0.484525C1.28126 0.463431 0.891018 0.601711 0.595698 0.867715C0.299214 1.13373 0.121098 1.50639 0.100008 1.90365C0.0789183 2.30091 0.217194 2.68998 0.483198 2.98646L10.3832 13.9833L0.483198 24.9801C0.217182 25.2754 0.0788883 25.6644 0.100008 26.0629C0.121102 26.4601 0.299226 26.8328 0.595698 27.0988C0.891012 27.3648 1.28126 27.502 1.67852 27.4808C2.07578 27.4597 2.44844 27.2816 2.71445 26.9863L13.5144 14.9863C13.7875 14.684 13.9258 14.2857 13.8988 13.8802Z" fill="white" />
            </svg>
          </div> : <div className="px-8" />}
        </div>
        <div
          className="bg-white relative rounded-[10px] p-4 flex flex-col min-h-0 justify-end lg:w-full max-h-96 lg:max-h-full basis-1/2 lg:basis-1/4 space-y-4"
        >
          <div className="grow">
            <div className="border-b pb-2 space-y-2">
              <div className="flex w-full justify-end">
                <Contact
                  ship={photo[1]?.caption?.who || "~zod"}
                  contact={contactsData?.[photo[1]?.caption?.who] || {}}
                  disableNicknames={disableNicknames}
                  disableAvatars={disableAvatars}
                />
                <p className="text-xs font-semibold cursor-pointer" onClick={() => handlers.ESCAPE()}>Close</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-[#999999]">{daToDate(photo[1]?.caption?.when).toLocaleString("en-us", { weekday: "long", hour12: false, hour: "2-digit", minute: "2-digit" })}</p>
                <div className="flex justify-end space-x-4 items-center">
                  <a
                    className="text-xs font-semibold"
                    href={photo[1]?.src}
                    target="_blank"
                  >
                    Download
                  </a>
                  {ship === `~${window.ship}` && (
                    <a
                      className="text-xs font-semibold cursor-pointer"
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
                      className="text-indigo-red text-xs font-semibold cursor-pointer"
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
              </div>
            </div>
          </div>
          {!disableComments && <>
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
            /></>}
        </div>
      </div>
    </div>
  );
}
