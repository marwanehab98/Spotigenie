import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
// import cache from "persistent-cache";
import authRoutes from "./routes/auth.js";
import tracksRoutes from "./routes/tracks.js";
import NodeCache from "node-cache";

// CONFIGURATIONS
dotenv.config();
const app = express();
const myCache = new NodeCache();

app.use(express.json());
// use(express.static(__dirname + '/public'))
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());
// app.use(cookieParser());

const PORT = process.env.PORT || 6001;


app.use("/auth", authRoutes);
app.use("/tracks", tracksRoutes);


app.listen(PORT, () => {
    console.log(`SpotiGenie is listening at http://localhost:${PORT}`);
});