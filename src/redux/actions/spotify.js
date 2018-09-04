export function createPlaylist() {
    return {
        type: 'CREATE_PLAYLIST',
    }
}

export function setPlaylist(playlist) {
    return {
        type: 'SET_PLAYLIST',
        payload: playlist
    }
}
