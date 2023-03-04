import express from "express";
import { getTopTracks, getRecommendations, searchSongs, checkSimilarity, getAllTracks } from "../controllers/tracks.js";

const router = express.Router();

router.post("/toptracks", getTopTracks);
router.post("/recommendations", getRecommendations);
router.post("/search", searchSongs);
router.post("/alltracks", getAllTracks);
router.post("/similarity", checkSimilarity);

export default router;