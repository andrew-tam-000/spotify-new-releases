import spotifyApi from "../spotifyApi";

export default {
    app: {
        // {
        // genre,
        // color
        // }
        genreColors: [
            {
                genre: "pop",
                color: "#d32f2f"
            },
            {
                genre: "dance pop",
                color: "#c2185b"
            },
            {
                genre: "rap",
                color: "#7b1fa2"
            },
            {
                genre: "pop rap",
                color: "#512da8"
            },
            {
                genre: "trap music",
                color: "#303f9f"
            },
            {
                genre: "hip hop",
                color: "#1976d2"
            },
            {
                genre: "indie r&b",
                color: "#0288d1"
            },
            {
                genre: "modern rock",
                color: "#0097a7"
            },
            {
                genre: "edm",
                color: "#00796b"
            },
            {
                genre: "southern hip hop",
                color: "#388e3c"
            }
        ],
        spotify: {
            albums: {},
            nowPlaying: {},
            artistData: [],
            newReleases: [],
            artistTopTracks: {},
            relatedArtists: {},
            songData: [],
            songs: [],
            library: []
        },
        discover: {
            nodes: {}
        },
        newReleases: {
            openAlbums: {},
            openSongs: {},
            showColors: false,
            showAllTracks: false,
            modal: false,
            modalGenre: "",
            modalColor: "",
            loading: false
        },
        // has 'type' and 'data' as keys
        showSideBar: false,
        // Let's sync this with firebase
        // but this will contian ID's for all
        // songs we'd like
        playlist: [],
        search: {
            isOpen: false,
            artists: [],
            tracks: [],
            albums: [],
            text: ""
        },
        user: {
            accessToken: null
        },
        analyzer: {
            openSearchPanel: false,
            searchTerm: "",
            sort: {
                sortBy: ["artist", "popularity"],
                sortDirection: {
                    popularity: "DESC",
                    artist: "ASC"
                }
            },
            advancedSearch: {
                genres: [],
                tracks: [],
                artists: [],
                attributes: {},
                activeTab: 0
            },
            // This will just be id's that are populated
            // from the spotify core data
            artistData: [],
            songs: [],
            loading: false
        },
        error: {
            message: "",
            show: false
        }
    }
};
