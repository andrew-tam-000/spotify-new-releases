const tableConfig = [
    {
        label: "Title",
        dataKey: "title",
        getter: () => "songDetails.track.name"
    },
    {
        dataKey: "uri",
        getter: () => "songDetails.track.uri",
        hidden: true
    },
    {
        dataKey: "id",
        getter: () => "songDetails.track.id",
        hidden: true
    },
    {
        label: "Artist",
        dataKey: "artist",
        getter: () => "songDetails.track.artists.0.name"
    },
    {
        label: "Popularity",
        dataKey: "popularity",
        getter: () => "songDetails.track.popularity",
        tunable: true,
        tolerance: 0,
        min: 0,
        max: 100
    },
    {
        label: "Genre",
        dataKey: "genre",
        getter: () => "artistDetails.genres.0"
    },
    {
        label: "Danceability",
        dataKey: "danceability",
        getter: () => "songAnalysis.danceability",
        tunable: true
    },
    {
        label: "Energy",
        dataKey: "energy",
        getter: () => "songAnalysis.energy",
        tunable: true
    },
    {
        label: "Loudness",
        dataKey: "loudness",
        getter: () => "songAnalysis.loudness",
        tunable: true,
        tolerance: 0,
        min: -60,
        max: 0
    },
    {
        label: "Speechiness",
        dataKey: "speechiness",
        getter: () => "songAnalysis.speechiness",
        tunable: true
    },
    {
        label: "Acousticness",
        dataKey: "acousticness",
        getter: () => "songAnalysis.acousticness",
        tunable: true
    },
    {
        label: "Instrumentalness",
        dataKey: "instrumentalness",
        getter: () => "songAnalysis.instrumentalness",
        tunable: true
    },
    {
        label: "Liveness",
        dataKey: "liveness",
        getter: () => "songAnalysis.liveness",
        tunable: true
    },
    {
        label: "Valence",
        dataKey: "valence",
        getter: () => "songAnalysis.valence",
        tunable: true
    },
    {
        label: "Tempo",
        dataKey: "tempo",
        getter: () => "songAnalysis.tempo",
        tunable: true,
        min: 0,
        max: 300
    }
];

export default tableConfig;
