import SpotifyWebApi from 'spotify-web-api-js';
import bluebird from 'bluebird'

const spotifyApi = new SpotifyWebApi();
spotifyApi.setPromiseImplementation(bluebird);

export default spotifyApi;
