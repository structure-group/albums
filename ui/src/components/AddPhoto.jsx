import Foco from "react-foco";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { useFileStore } from "../state/useFileStore";
import { daToDate, dateToDa, deSig } from "@urbit/api";
import { compareDesc } from "date-fns";
import { FixedSizeGrid as Grid } from "react-window";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import cn from "classnames";
import { albumQuery } from "../state/query";
import useStorageState from "../state/storage";

export default function AddPhoto({ setAddPhoto, addPhotos }) {
  const { files, client, getFiles } = useFileStore();
  const { s3 } = useStorageState();
  const { ship, albumId } = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [columns, setColumns] = useState(5);
  const [promptWidth, setPromptWidth] = useState(568);
  const [promptHeight, setPromptHeight] = useState(368);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["album", ship, albumId],
    queryFn: () => (albumId ? albumQuery(albumId, ship) : null),
  });
  const album = data?.albums;

  useEffect(() => {
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    const resize = () => {
      if (clientWidth < 424) {
        setColumns(2);
        setPromptWidth(clientWidth - 128);
        setPromptHeight(clientHeight - 128);
      } else if (clientWidth < 768) {
        setColumns(3);
        setPromptWidth(clientWidth - 72);
        setPromptHeight(clientHeight - 72);
      } else if (clientWidth < 1024) {
        setColumns(3);
        setPromptWidth(340);
      } else {
        setColumns(5);
        setPromptWidth(568);
      }
    };
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

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
    const url = sortedFiles[rowIndex * 5 + columnIndex]?.url || "";
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
        {url ? (
          <img src={url} className="h-full w-full object-contain" />
        ) : (
          <div className="pointer-events-none h-full w-full" />
        )}
      </div>
    );
  };
  return (
    <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.25)] w-full h-full flex flex-col items-center justify-center z-40">
      <Foco onClickOutside={() => setAddPhoto(false)}>
        <div
          className="bg-white rounded-xl flex flex-col items-center justify-center z-10 p-4"
          style={{
            width: promptWidth + 32,
            height: promptHeight + 32,
          }}
        >
          <div className="w-full flex items-center justify-between mb-2">
            <p className="font-semibold">Your Images</p>
            <button
              className="bg-black text-white p-1 rounded-md text-sm font-semibold hover:bg-indigo-black"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.accept = "image/*";
                input.onchange = (e) => {
                  const files = Array.from(e.target.files);
                  const promises = files.map(async (file) => {
                    await client.send(
                      new PutObjectCommand({
                        Bucket: s3.configuration.currentBucket,
                        Key: `/structure-albums/${deSig(
                          dateToDa(new Date()),
                        )}-${file.name}`,
                        Body: file,
                        ACL: "public-read",
                        ContentType: file.type,
                      }),
                    );
                  });
                  Promise.allSettled(promises).then(() => {
                    getFiles(s3);
                  });
                };
                try {
                  input.click();
                } catch (e) {
                  console.log(e);
                } finally {
                  getFiles(s3);
                }
              }}
            >
              Upload
            </button>
          </div>
          <Grid
            className="self-center"
            columnCount={columns}
            columnWidth={113}
            height={promptHeight}
            rowCount={sortedFiles.length / 3}
            rowHeight={100}
            width={columns * 113}
          >
            {Cell}
          </Grid>
          <div className="flex space-x-2 pt-2 w-full">
            <button
              className="text-sm font-semibold bg-white text-black w-full rounded-md py-1 hover:bg-indigo-white"
              onClick={() => setAddPhoto(false)}
            >
              Cancel
            </button>
            <button
              className="text-sm font-semibold bg-black hover:bg-indigo-black text-white w-full rounded-md py-1 disabled:bg-indigo-white disabled:text-indigo-gray"
              disabled={selectedFiles.length === 0}
              onClick={() => addPhotos(selectedFiles, queryClient)}
            >
              Add to Album
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
