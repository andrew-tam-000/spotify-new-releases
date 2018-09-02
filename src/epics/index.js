import { merge } from 'rxjs/observable/merge';
import fetchAccessToken from './fetchAccessToken';
import initializeConnections from './initializeConnections';

export default (...args) => merge(
    initializeConnections(...args),
    fetchAccessToken(...args),
);

/*
{
    connections: {
        [key]: {
            id
            token:
            playlistUri
            refreshPlaylist
            isPlaying
            hostHash: Store cookie and pass it to server (potential to transfer ownership)
        }
    }
}
*/
