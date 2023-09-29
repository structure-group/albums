import Foco from "react-foco";
import { useFileStore } from "../state/useFileStore";
import { daToDate } from "@urbit/api";
import { compareDesc } from "date-fns";
import { FixedSizeGrid as Grid } from "react-window";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import cn from "classnames";
import { api } from "../state/api";
import { v4 as uuidv4 } from "uuid";
import { albumQuery } from "../state/query";

export default function AddPhoto({ setAddPhoto }) {
  const { files } = useFileStore();
  const { ship, albumId } = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const queryClient = useQueryClient();
  const album = useQuery({
    queryKey: ["album", ship, albumId],
    queryFn: () => albumQuery(albumId, ship),
  }).data?.albums;
  const sortedFiles = files
    .filter((f) => imageExtensions.includes(f.extension))
    .sort((a, b) => {
      const dateA = a.date
        ? daToDate("~" + a.date)
        : new Date(a.data.LastModified || "");
      const dateB = b.date
        ? daToDate("~" + b.date)
        : new Date(b.data.LastModified || "");

      return compareDesc(dateA, dateB);
    });
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const url = sortedFiles[rowIndex * 5 + columnIndex].url;
    return (
      <div
        className={cn("p-1 cursor-pointer border", {
          "pointer-events-none opacity-25": album?.images?.some(
            (image) => image[1]?.src === url,
          ),
          "border-black": selectedFiles.some((file) => file === url),
          "border-transparent": !selectedFiles.some((file) => file === url),
        })}
        onClick={() => {
          if (selectedFiles.some((file) => file === url)) {
            setSelectedFiles((prev) => prev.filter((file) => file !== url));
          } else {
            setSelectedFiles((prev) => [...prev, url]);
          }
        }}
        style={{
          ...style,
          left: style.left + 1,
          top: style.top + 1,
          width: style.width - 1,
          height: style.height - 1,
        }}
      >
        <img src={url} className="h-full w-full object-contain" />
      </div>
    );
  };

  const addPhotos = () => {
    const promises = selectedFiles.map((url, i) => {
      return api.poke({
        app: "albums",
        mark: "albums-action",
        json: {
          add: {
            "album-id": { name: albumId, owner: ship },
            "img-id": String(Math.floor(Date.now() / 1000) + i),
            src: url,
            caption: {
              who: `~${window.ship}`,
              when: String(Math.floor(Date.now() / 1000) + i),
              what: "",
            },
          },
        },
      });
    });
    Promise.all(promises).then(() => {
      queryClient.invalidateQueries(["album", ship, albumId]);
      setAddPhoto(false);
    });
  };

  return (
    <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.25)] w-full h-full flex flex-col items-center justify-center">
      <Foco onClickOutside={() => setAddPhoto(false)}>
        <div className="bg-white rounded-xl w-[600px] h-[400px] flex flex-col items-center justify-center z-10 p-4">
          <p className="font-semibold">Your Images</p>
          <Grid
            className="self-center"
            columnCount={5}
            columnWidth={113}
            height={368}
            rowCount={sortedFiles.length / 3}
            rowHeight={100}
            width={568}
          >
            {Cell}
          </Grid>
          <div className="flex space-x-2 pt-2 w-full">
            <button
              className="text-sm font-semibold bg-white text-black w-full rounded-md py-1 hover:bg-gray-200"
              onClick={() => setAddPhoto(false)}
            >
              Cancel
            </button>
            <button
              className="text-sm font-semibold bg-black text-white w-full rounded-md py-1"
              onClick={() => addPhotos()}
            >
              Add
            </button>
          </div>
        </div>
      </Foco>
    </div>
  );
}

const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "webp",
  "avif",
  "apng",
];
