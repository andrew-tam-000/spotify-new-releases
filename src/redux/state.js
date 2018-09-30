import spotifyApi from "../spotifyApi";

export default {
    app: {
        spotify: {
            nowPlaying: {}
        },
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
            artistData: [],
            songData: [],
            songs: []
        }
    }
};
