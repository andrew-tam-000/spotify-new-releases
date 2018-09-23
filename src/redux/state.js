import spotifyApi from "../spotifyApi";

export default {
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
        sort: {},
        advancedSearch: {
            genres: [],
            tracks: [],
            attributes: {},
            activeTab: 0
        }
    }
};
