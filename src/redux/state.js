import spotifyApi from "../spotifyApi";

export default {
    app: {
        playlist: {},
        search: {
            artists: [],
            tracks: [],
            albums: [],
            text: ""
        },
        user: {},
        analyzer: {
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
                attributes: {},
                activeTab: 0
            }
        }
    }
};
