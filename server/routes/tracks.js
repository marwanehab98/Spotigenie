import express from "express";
import {
    getTopTracks,
    getRecommendations,
    searchSongs,
    likeTrack,
    unlikeTrack,
    checkSimilarity,
} from "../controllers/tracks.js";

const router = express.Router();

router.post("/toptracks", getTopTracks);
router.post("/recommendations", getRecommendations);
router.post("/search", searchSongs);
router.post("/similarity", checkSimilarity);
router.post("/like", likeTrack);
router.post("/unlike", unlikeTrack);

export default router;