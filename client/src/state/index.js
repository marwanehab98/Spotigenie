import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    expiresIn: null,
    accessToken: null,
    refreshToken: null,
    tracks: [],
    recommendations: [],
    allTracks: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.expiresIn = action.payload.expiresIn;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        setLogout: (state) => {
            state.user = null;
            state.expiresIn = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.tracks = [];
            state.allTracks = false;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken;
        },
        setTracks: (state, action) => {
            state.tracks = action.payload.tracks;
        },
        setRecommendations: (state, action) => {
            state.recommendations = action.payload.recommendations;
        },
        setAllTracks: (state, action) => {
            state.allTracks = action.payload.allTracks;
        },
    }
})

export const {
    setLogin,
    setLogout,
    setAccessToken,
    setTracks,
    setRecommendations,
    setAllTracks,
} = authSlice.actions;
export default authSlice.reducer;