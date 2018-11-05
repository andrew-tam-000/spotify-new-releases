import { get, join } from "lodash";

export default [
    {
        dataKey: "uri",
        getter: "album.uri",
        hidden: true
    },
    {
        dataKey: "id",
        getter: "album.id",
        hidden: true
    },
    {
        dataKey: "image",
        hidden: true,
        getter: "album.images[2].url"
    },
    {
        label: "Album",
        dataKey: "album",
        hidden: true,
        getter: "album.name"
    },
    {
        label: "Release Date",
        dataKey: "releaseDate",
        getter: "newReleaseMeta.release_date",
        width: 140
    },
    {
        label: "Artist",
        dataKey: "artist",
        hidden: true,
        getter: "artists.0.name"
    },
    {
        label: "Album Popularity",
        dataKey: "albumPopularity",
        getter: "album.popularity",
        width: 50
    },
    {
        label: "Artist Popularity",
        dataKey: "artistPopularity",
        getter: "artists.0.popularity",
        width: 50
    },
    {
        label: "Genres",
        dataKey: "genres",
        formatter: row => join(get(row, "genres"), ", ")
    },
    {
        label: "Type",
        dataKey: "type",
        getter: "album.album_type",
        hidden: true
    }
];
