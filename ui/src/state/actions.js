import { api } from "./api";
import { decToUd, unixToDa } from "@urbit/api";

export const addComment = async (albumId, ship, photo, comment) => {
  await api.poke({
    app: "albums",
    mark: "albums-action",
    json: {
      comment: {
        "album-id": { name: albumId, owner: ship },
        "img-id": photo[0],
        comment: {
          who: `~${window.ship}`,
          when: decToUd(`${unixToDa(Date.now())}`),
          what: comment,
        },
      },
    },
  });
};

export const addPhotos = (selectedFiles, albumId, ship) => {
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
            when: decToUd(`${unixToDa(Date.now())}`),
            what: "",
          },
        },
      },
    });
  });
  return Promise.all(promises);
};

export const changeCover = async (name, ship, cover) => {
  await api.poke({
    app: "albums",
    mark: "albums-action",
    json: {
      cover: {
        "album-id": { name, owner: ship },
        cover,
      },
    },
  });
};

export const deletePhoto = async (albumId, ship, photo) => {
  await api.poke({
    app: "albums",
    mark: "albums-action",
    json: {
      del: {
        "album-id": { name: albumId, owner: ship },
        "img-id": photo[0],
      },
    },
  });
};

export const editAlbum = async (albumId, ship, title, comments) => {
  await api.poke({
    app: "albums",
    mark: "albums-action",
    json: {
      edit: {
        "album-id": { name: albumId, owner: ship },
        title,
        "comment-perm": comments,
      },
    },
  });
};

export const inviteSelected = (selectedMembers, albumId, ship) => {
  const promises = selectedMembers.map((member) => {
    return api.poke({
      app: "albums",
      mark: "albums-action",
      json: {
        share: {
          "album-id": { name: albumId, owner: ship },
          receiver: member[0],
          "write-perm": Boolean(member[1]),
        },
      },
    });
  });
  return Promise.all(promises);
};

export const editMember = (member, albumId, ship, writePerm) => {
  return api.poke({
    app: "albums",
    mark: "albums-action",
    json: {
      share: {
        "album-id": { name: albumId, owner: ship },
        receiver: member,
        "write-perm": Boolean(writePerm),
      },
    },
  });
};

export const unshare = (member, albumId, ship) => {
  return api.poke({
    app: "albums",
    mark: "albums-action",
    json: {
      unshare: {
        "album-id": { name: albumId, owner: ship },
        receiver: member,
      },
    },
  });
};
