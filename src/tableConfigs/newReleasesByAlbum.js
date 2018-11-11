import React from "react";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import PersonIcon from "@material-ui/icons/Person";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { get, join } from "lodash";
//const star = String.fromCharCode(parseInt(2605, 16));

export default [
    {
        dataKey: "uri",
        formatter: row => (!get(row, "track") ? get(row, "album.uri") : get(row, "track.uri")),
        hidden: true
    },
    {
        dataKey: "id",
        formatter: row => (!get(row, "track") ? get(row, "album.id") : get(row, "track.id")),
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
        label: "Track",
        dataKey: "track",
        hidden: true,
        getter: "track.name"
    },
    {
        label: <CalendarTodayIcon />,
        dataKey: "releaseDate",
        getter: "newReleaseMeta.release_date",
        width: 80
    },
    {
        label: "Artist",
        dataKey: "artist",
        hidden: true,
        getter: "artists.0.name"
    },
    {
        label: <LibraryMusicIcon />,
        dataKey: "albumPopularity",
        formatter: row =>
            !get(row, "track") ? get(row, "album.popularity") : get(row, "track.popularity"),
        width: 40
    },
    {
        label: <PersonIcon />,
        dataKey: "artistPopularity",
        getter: "artists.0.popularity",
        width: 40
    },
    {
        label: "Genres",
        dataKey: "genres",
        formatter: row => join(get(row, "genres"), ", "),
        hidden: true
    },
    {
        label: "Type",
        dataKey: "type",
        getter: "album.album_type",
        hidden: true
    },
    {
        label: "noop",
        dataKey: "isTrack",
        formatter: row => !!get(row, "track"),
        hidden: true
    }
];
