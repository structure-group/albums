import { api } from "./api"
export const albumsQuery = async () => {
    const albums = (
        await api.scry({
            app: "albums",
            path: "/list",
        })
    )?.["album-ids"];
    return albums;
}

export const albumQuery = async (id, ship) => {
    const photos = (
        await api.scry({
            app: "albums",
            path: `/album/${id}/${ship}`,
        })
    );
    return photos;
}