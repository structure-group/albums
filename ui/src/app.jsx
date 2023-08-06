import React, { useEffect, useState } from "react";
import Urbit from "@urbit/http-api";

const api = new Urbit("", "", window.desk);
api.ship = window.ship;

export function App() {
  const [albums, setAlbums] = useState();

  useEffect(() => {
    async function init() {
      // albums are an array of arrays, each sub-array is a tuple of album id and owner
      // eg. [['beach', '~zod'], ...]
      const albums = (
        await api.scry({
          app: "albums",
          path: "/list",
        })
      )?.["album-ids"];
      setAlbums(albums);
      console.log(albums);
    }

    init();
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen"></main>
  );
}
