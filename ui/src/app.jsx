import React, { useEffect, useState } from "react";
import { api } from "./state/api";
import useStorageState from "./state/storage";

export function App() {
  const { s3 } = useStorageState();
  const credentials = s3.credentials;
  const configuration = s3.configuration;
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
    }

    init();
  }, []);

  useEffect(() => {
    const hasCredentials =
      credentials?.accessKeyId &&
      credentials?.endpoint &&
      credentials?.secretAccessKey && configuration;
    if (hasCredentials) {
      // createClient(credentials, configuration.region);

      useStorageState.setState({ hasCredentials: true });
      console.log("client initialized");
    }
  }, [credentials, configuration]);

  return (
    <main className="flex items-center justify-center min-h-screen"></main>
  );
}
