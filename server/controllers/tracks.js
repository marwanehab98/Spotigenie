import spotifyWebApi from "spotify-web-api-node";
import similarity from "cosine-similarity"
import NodeCache from "node-cache";
import dotenv from "dotenv";

dotenv.config();

const myCache = new NodeCache();
const credentials = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
};

const checkSavedTracks = async (token, tracks) => {
    try {
        var spotifyApi = new spotifyWebApi(credentials);
        spotifyApi.setAccessToken(token);
        const trackIds = tracks.map((track) => track.id);
        const isSaved = await spotifyApi.containsMySavedTracks(trackIds)
        return isSaved.body;
    } catch (error) {
        throw error
    }
}

const getArtistImage = async (token, tracks) => {
    try {
        var spotifyApi = new spotifyWebApi(credentials);
        spotifyApi.setAccessToken(token);
        const artistIds = tracks.map((track) => track.artists[0].id);
        const response = await spotifyApi.getArtists(artistIds);
        // console.log(response);
        const imageURLs = response.body.artists.map((artist) => artist.images[0].url);
        return imageURLs;
    } catch (error) {
        throw error
    }
}

export const getTopTracks = async (req, res) => {
    try {
        var spotifyApi = new spotifyWebApi(credentials);
        spotifyApi.setAccessToken(req.body.token);
        const topTracks = await spotifyApi.getMyTopTracks({ limit: 48 });
        const isSaved = await checkSavedTracks(req.body.token, topTracks.body.items);
        const artistImages = await getArtistImage(req.body.token, topTracks.body.items);
        const topTracksUpdated = topTracks.body.items.map((track, index) => {
            return { ...track, is_saved: isSaved[index], artistImage: artistImages[index] }
        });
        res.status(200).json({ topTracksUpdated });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const getRecommendations = async (req, res) => {
    try {
        var spotifyApi = new spotifyWebApi(credentials);
        spotifyApi.setAccessToken(req.body.token);
        const recommendations = await spotifyApi.getRecommendations({ seed_tracks: req.body.trackIds, limit: 48 })
        const isSaved = await checkSavedTracks(req.body.token, recommendations.body.tracks);
        const artistImages = await getArtistImage(req.body.token, recommendations.body.tracks);
        const recommendationsUpdated = recommendations.body.tracks.map((track, index) => {
            return { ...track, is_saved: isSaved[index], artistImage: artistImages[index] }
        });
        res.status(200).json({ recommendationsUpdated });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const searchSongs = async (req, res) => {
    try {
        var spotifyApi = new spotifyWebApi(credentials);
        spotifyApi.setAccessToken(req.body.token);
        const results = await spotifyApi.searchTracks(req.body.searchQuery, { limit: 4 })
        const isSaved = await checkSavedTracks(req.body.token, results.body.tracks.items);
        const artistImages = await getArtistImage(req.body.token, results.body.tracks.items);
        const resultsUpdated = results.body.tracks.items.map((track, index) => {
            return { ...track, is_saved: isSaved[index], artistImage: artistImages[index] }
        });
        res.status(200).json({ resultsUpdated });
    } catch (error) {
        res.status(500).json({ error: error });
    }

}

export const likeTrack = async (req, res) => {
    try {
        var spotifyApi = new spotifyWebApi(credentials);
        spotifyApi.setAccessToken(req.body.token);
        const response = await spotifyApi.addToMySavedTracks(req.body.track);
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}


export const unlikeTrack = async (req, res) => {
    try {
        var spotifyApi = new spotifyWebApi(credentials);
        spotifyApi.setAccessToken(req.body.token);
        const response = await spotifyApi.removeFromMySavedTracks(req.body.track);
        // console.log(response);
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const getAllTracks = async (req, res) => {
    try {
        var offset = 0;
        var limit = 50;
        var next = true;
        var tracks = [];
        var spotifyApi = new spotifyWebApi(credentials);
        spotifyApi.setAccessToken(req.body.token);
        do {
            const myTracks = await spotifyApi.getMySavedTracks({
                limit: limit,
                offset: offset,
            });
            const trackIds = myTracks.body.items.map((track) => track.track.id);
            const audioFeatures = await spotifyApi.getAudioFeaturesForTracks(trackIds);
            const audioFeaturesFiltered = audioFeatures.body.audio_features.map(({ key, loudness, mode, tempo, type, id, uri, track_href, analysis_url, duration_ms, time_signature, ...item }) => item);
            tracks = [...tracks, ...audioFeaturesFiltered];
            next = myTracks.body.next;
            offset = offset + limit;
        } while (next);
        const success = myCache.set("tracks", tracks);
        res.status(200).json({ success });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}

export const checkSimilarity = async (req, res) => {
    try {
        const tracks = myCache.get("tracks");
        console.log(tracks)
        if (tracks == undefined) {
            res.status(500).json({ results: "Something went wrong!" });
            return;
        }
        var spotifyApi = new spotifyWebApi(credentials);
        spotifyApi.setAccessToken(req.body.token);
        const audioFeatures = await spotifyApi.getAudioFeaturesForTrack(req.body.selectedTrack)
        var r = 0;
        var { danceability, energy, speechiness, acousticness, instrumentalness, liveness, valence } = audioFeatures.body;
        tracks.every(track => {
            let sim = similarity(
                track,
                { danceability, energy, speechiness, acousticness, instrumentalness, liveness, valence }
            ).toFixed(3);
            if (parseFloat(sim) === 1) {
                r = parseInt(sim) * 100 * tracks.length;
                return false;
            }
            r = r + parseFloat(sim) * 100;
            return true
        });
        res.status(200).json({ results: Math.round(r / (tracks.length !== 0 ? tracks.length : 1)) });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}