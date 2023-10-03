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

export const addPhotos = (selectedFiles, albumId, ship, setAddPhoto, queryClient) => {
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
    Promise.all(promises).then(() => {
        queryClient.invalidateQueries(["album", ship, albumId]);
        setAddPhoto(false);
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
}

export const inviteSelected = (selectedMembers, albumId, ship, queryClient) => {
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
    Promise.all(promises).then(() => {
        queryClient.invalidateQueries(["album", ship, albumId]);
    });
};

export const editMember = (member, albumId, ship, writePerm, queryClient) => {
    api
        .poke({
            app: "albums",
            mark: "albums-action",
            json: {
                share: {
                    "album-id": { name: albumId, owner: ship },
                    receiver: member,
                    "write-perm": Boolean(writePerm),
                },
            },
        })
        .then(() => {
            queryClient.invalidateQueries(["album", ship, albumId]);
        });
};

export const unshare = (member, albumId, ship, queryClient) => {
    api.poke({
        app: "albums",
        mark: "albums-action",
        json: {
            unshare: {
                "album-id": { name: albumId, owner: ship },
                receiver: member,
            },
        },
    }).then(() => {
        queryClient.invalidateQueries(["album", ship, albumId]);
    });
}