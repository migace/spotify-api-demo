import SpotifyWebApi from 'spotify-web-api-js';

class Spotify {
    constructor(access_token) {
        this.spotifyApi = new SpotifyWebApi();
        this.spotifyApi.setAccessToken(access_token);
    }

    getTracks(name) {
        this.spotifyApi.searchTracks(name)
            .then(data => {
                console.log(data);
            }, err => {
                console.error(err);
            });
    }
}

export default Spotify;
