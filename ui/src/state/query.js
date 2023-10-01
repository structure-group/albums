import { api } from "./api";
export const albumsQuery = async () => {
  const albums = (
    await api.scry({
      app: "albums",
      path: "/list",
    })
  )?.["album-id"];
  return albums || [];
};

export const albumQuery = async (id, ship) => {
  const photos = await api.scry({
    app: "albums",
    path: `/album/${id}/${ship}`,
  });
  return photos || [];
};

export const contactsQuery = async () => {
  const contacts = await api.scry({
    app: "contacts",
    path: "/all",
  });
  return contacts || {};
};

export const settingsQuery = async () => {
  const settings = await api.scry({
    app: "settings",
    path: "/desk/landscape",
  });
  return settings || [];
};
