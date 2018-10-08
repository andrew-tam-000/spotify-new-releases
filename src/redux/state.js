import spotifyApi from "../spotifyApi";

export default {
    app: {
        spotify: {
            nowPlaying: {},
            artistData: [],
            artistTopTracks: {},
            relatedArtists: {},
            songData: [],
            songs: []
        },
        discover: {
            tree: "spotify:artist:0A0FS04o6zMoto8OKPsDwY"
        },
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
        user: {},
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
            songs: []
        }
    }
};
