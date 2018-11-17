import SpotifyWebApi from "./spotify-web-api-js";
import bluebird from "bluebird";

const spotifyApi = new (SpotifyWebApi())();
spotifyApi.setPromiseImplementation(bluebird);

const basicSpotifyApi = new (SpotifyWebApi())();
basicSpotifyApi.setPromiseImplementation(bluebird);

export { basicSpotifyApi };
export default spotifyApi;
