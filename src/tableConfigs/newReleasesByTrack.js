import { map, get, join } from "lodash";

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
        label: "Track",
        dataKey: "track",
        getter: "track.name"
    },
    {
        label: "Track Popularity",
        dataKey: "trackPopularity",
        getter: "track.popularity"
    },
    {
        label: "Release Date",
        dataKey: "releaseDate",
        getter: "newReleaseMeta.release_date"
    },
    {
        label: "Artist",
        dataKey: "artist",
        getter: "artists.0.name"
    },
    {
        label: "Album Popularity",
        dataKey: "albumPopularity",
        getter: "album.popularity"
    },
    {
        label: "Artist Popularity",
        dataKey: "artistPopularity",
        getter: "artists.0.popularity"
    },
    {
        label: "Genre",
        dataKey: "genre",
        formatter: row => join(get(row, "artists.0.genres"), ", ")
    },
    {
        label: "Type",
        dataKey: "type",
        getter: "album.album_type"
    }
];
