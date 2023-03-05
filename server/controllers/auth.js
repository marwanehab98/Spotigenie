import spotifyWebApi from "spotify-web-api-node";
import NodeCache from "node-cache";
import dotenv from "dotenv";

dotenv.config();

const myCache = new NodeCache();
const credentials = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
};



export const login = async (req, res) => {
    try {
        var spotifyApi = new spotifyWebApi(credentials);
        const code = req.body.code;
        const tokens = await spotifyApi.authorizationCodeGrant(code);
        spotifyApi.setAccessToken(tokens.body.access_token);
        const user = await spotifyApi.getMe();
        res.status(200).json({ user: user.body, tokens: tokens.body });
    } catch (error) {
        res.status(error.statusCode).json({ error: error });
    }
}

export const logout = (req, res) => {
    try {
        myCache.flushAll()
        res.status(200).json({ response: "logged out" });
    } catch (error) {
        res.status(error.statusCode).json({ error: error });
    }
}

export const refresh = async (req, res) => {
    try {
        var spotifyApi = new spotifyWebApi(credentials);
        spotifyApi.setRefreshToken(req.body.token);
        const tokens = await spotifyApi.refreshAccessToken();
        res.status(200).json({ tokens: tokens.body });
    } catch (error) {
        res.status(error.statusCode).json({ error: error });
    }
}