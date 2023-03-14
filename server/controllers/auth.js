import spotifyWebApi from "spotify-web-api-node";
import NodeCache from "node-cache";
import dotenv from "dotenv";
import { getAllTracks } from "./tracks.js";

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
        const expirationTime = new Date(tokens.headers.date).getTime() + tokens.body.expires_in * 1000;
        const updatedTokens = { ...tokens.body, expires_in: expirationTime }
        const user = await spotifyApi.getMe();
        res.status(200).json({ user: user.body, tokens: updatedTokens });
        await getAllTracks(updatedTokens.access_token);
    } catch (error) {
        res.status(500).json({ error });
    }
}

export const logout = (_, res) => {
    try {
        myCache.flushAll()
        res.status(200).json({ response: "logged out" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
}

export const refresh = async (req, res) => {
    try {
        var spotifyApi = new spotifyWebApi(credentials);
        spotifyApi.setRefreshToken(req.body.token);
        const tokens = await spotifyApi.refreshAccessToken();
        const expirationTime = new Date(tokens.headers.date).getTime() + tokens.body.expires_in * 1000;
        const updatedTokens = { ...tokens.body, expires_in: expirationTime }
        res.status(200).json({ tokens: updatedTokens });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}