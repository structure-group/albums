import React, { useEffect, useState, useCallback } from "react";
import { api } from "./state/api";
import useStorageState from "./state/storage";
import { useFileStore } from "./state/useFileStore";
import { useAsyncCall } from "./lib/useAsyncCall";

export function App() {
  const { s3 } = useStorageState();
  const credentials = s3.credentials;
  const configuration = s3.configuration;
  const { client, createClient, getFiles } = useFileStore();
  const { call: loadFiles } = useAsyncCall(
    useCallback(async (s3) => {
      return getFiles(s3);
    }, []),
    useFileStore
  );
  const [albums, setAlbums] = useState();


  useEffect(() => {
    async function init() {
      useStorageState.getState().initialize(api);
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
      const photos = (
        await api.scry({
          app: "albums",
          path: "/album/string/~zod",
        })
      );
      console.log(photos);
    }

    init();
  }, []);

  useEffect(() => {
    const hasCredentials =
      credentials?.accessKeyId &&
      credentials?.endpoint &&
      credentials?.secretAccessKey && configuration;
    if (hasCredentials) {
      createClient(credentials, configuration.region);

      useStorageState.setState({ hasCredentials: true });
      console.log("client initialized");
    }
  }, [credentials, configuration]);

  useEffect(() => {
    loadFiles(s3);
  }, [loadFiles, s3, client]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={() => {
        api.poke({
          app: "albums",
          mark: "albums-action",
          json: { "create": { "name": "string", "owner": "~zod" } }
        })
      }}>
        make the album
      </button>
      <button onClick={() => {
        api.poke({
          app: "albums",
          mark: "albums-action",
          json: { "add": { "album-id": { "name": "string", "owner": "~zod" }, "img-id": "test", "src": "https://s3.us-east-1.amazonaws.com/haddefsigwen1/2023.5.25..16.56.30-hachikuji_waifu2x_art_scale.png", "caption": { "who": "~nec", "when": "1694190024", "what": "caption" } } }
        })
      }}>
        add the photo
      </button>
      <button onClick={() => {
        api.poke({
          app: "albums",
          mark: "albums-action",
          json: { "nuke": { "name": "string", "owner": "~zod" } }

        })
      }}>
        nuke the album
      </button>
      <button onClick={() => {
        api.poke({
          app: "albums",
          mark: "albums-action",
          json: { "comment": { "album-id": { "name": "string", "owner": "~zod" }, "img-id": "test", "comment": { "who": "~nec", "when": "1694190024", "what": "comment" } } }
        })
      }}>
        comment on the photo
      </button>
      <button onClick={() => {
        api.poke({
          app: "albums",
          mark: "albums-action",
          json: { "share": { "album-id": { "name": "string", "owner": "~wex" }, "img-id": "test", "receiver": "~zod" } }
        })
      }}>
        share the photo with someone
      </button>
    </main>
  );
}
