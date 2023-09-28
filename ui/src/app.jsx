import React, { useEffect, useCallback } from "react";
import { api } from "./state/api";
import useStorageState from "./state/storage";
import { useFileStore } from "./state/useFileStore";
import { useAsyncCall } from "./lib/useAsyncCall";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Albums from "./components/Albums";
import Album from "./components/Album";
import NewAlbum from "./components/New";

export function App() {
  const { s3 } = useStorageState();
  const credentials = s3.credentials;
  const configuration = s3.configuration;
  const { client, createClient, getFiles } = useFileStore();
  const { call: loadFiles } = useAsyncCall(
    useCallback(async (s3) => {
      return getFiles(s3);
    }, []),
    useFileStore,
  );

  useEffect(() => {
    async function init() {
      useStorageState.getState().initialize(api);
    }

    init();
  }, []);

  useEffect(() => {
    const hasCredentials =
      credentials?.accessKeyId &&
      credentials?.endpoint &&
      credentials?.secretAccessKey &&
      configuration;
    if (hasCredentials) {
      createClient(credentials, configuration.region);

      useStorageState.setState({ hasCredentials: true });
      console.log("client initialized");
    }
  }, [credentials, configuration]);

  useEffect(() => {
    loadFiles(s3);
  }, [loadFiles, s3, client]);

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "",
            element: <Albums />,
          },
          {
            path: "shared",
            element: <div>Shared with Me</div>,
          },
          {
            path: "new",
            element: <NewAlbum />,
          },
          {
            path: "album/:ship/:albumId",
            element: <Album />,
          },
        ],
      },
    ],
    {
      basename: "/apps/albums",
    },
  );

  return (
    <RouterProvider router={router} />
  );
}
