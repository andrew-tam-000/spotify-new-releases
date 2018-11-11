import spotifyApi from "../spotifyApi";

export default {
    app: {
        // {
        // genre,
        // color
        // }
        genreColors: [],
        spotify: {
            albums: {},
            nowPlaying: {},
            artistData: [],
            newReleases: [],
            artistTopTracks: {},
            relatedArtists: {},
            songData: [],
            songs: []
        },
        discover: {
            nodes: {}
        },
        newReleases: {
            openAlbums: {},
            showColors: true,
            showAllTracks: false,
            modal: false,
            modalGenre: "",
            modalColor: "",
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
