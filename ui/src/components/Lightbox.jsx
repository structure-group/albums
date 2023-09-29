import Foco from "react-foco";
import { useState } from "react";
import { api } from "../state/api";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
export default function Lightbox({ photo, setLightboxPhoto }) {
  const [comment, setComment] = useState("");
  const { ship, albumId } = useParams();
  const queryClient = useQueryClient();
  console.log(photo);
  const addComment = async () => {
    await api.poke({
      app: "albums",
      mark: "albums-action",
      json: {
        comment: {
          "album-id": { name: albumId, owner: ship },
          "img-id": photo[0],
          comment: { who: `~${window.ship}`, when: String(Math.floor(Date.now() / 1000)), what: comment },
        },
      },
    });
    setComment("");
    queryClient.invalidateQueries(["album", ship, albumId]);
  };
  return (
    <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.25)] w-full h-full flex flex-col items-center justify-center space-y-8">
      <Foco
        className="flex flex-col items-center justify-center p-8"
        onClickOutside={() => setLightboxPhoto(null)}
      >
        <div className="absolute top-0 right-0 w-full flex justify-end space-x-4 z-20 p-4">
          <a
            className="bg-indigo-black text-xs font-semibold px-2 py-1 rounded-md text-white"
            href={photo[1]?.src}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            Source
          </a>
        </div>
        <div className="h-full w-full flex flex-col lg:flex-row justify-center shadow-md">
          <img
            src={photo[1]?.src}
            alt=""
            className="min-w-0 min-h-0 max-h-[90vh] object-contain"
          />
          <div className="bg-white relative rounded-tr-md rounded-br-md p-4 flex flex-col justify-end lg:w-full max-h-32 lg:max-h-[90vh] overflow-y-auto basis-1/3">
            <textarea
              className="w-full sticky bottom-0 h-16 resize-none border border-indigo-gray p-2 rounded-md"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addComment();
                }
              }}
            />
          </div>
        </div>
      </Foco>
    </div>
  );
}
