import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import tracksRoutes from "./routes/tracks.js";

// CONFIGURATIONS
dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());


const PORT = process.env.PORT || 6001;


app.use("/auth", authRoutes);
app.use("/tracks", tracksRoutes);


app.listen(PORT, () => {
    console.log(`SpotiGenie is listening at http://localhost:${PORT}`);
});