import React from "react";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import Stars from "@material-ui/icons/Stars";
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
        label: <CalendarTodayIcon fontSize="small" />,
        dataKey: "releaseDate",
        formatter: row => {
            const releaseDate = get(row, "meta.release_date");

            if (!releaseDate) {
                return "";
            }

            const date = new Date(releaseDate);
            const year = date.getFullYear();
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const day = ("0" + date.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        },
        width: 70
    },
    {
        label: "Artist",
        dataKey: "artist",
        hidden: true,
        getter: "artists.0.name"
    },
    {
        label: <Stars fontSize="small" />,
        dataKey: "albumPopularity",
        formatter: row =>
            !get(row, "track") ? get(row, "album.popularity") : get(row, "track.popularity"),
        width: 35
    },
    {
        label: <PersonIcon fontSize="small" />,
        dataKey: "artistPopularity",
        getter: "artists.0.popularity",
        width: 35
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
