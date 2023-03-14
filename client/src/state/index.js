import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    expiresIn: null,
    accessToken: null,
    refreshToken: null,
    tracks: [],
    recommendations: [],
    darktheme: false
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
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken;
        },
        setExpiresIn: (state, action) => {
            state.expiresIn = action.payload.expiresIn;
        },
        setTracks: (state, action) => {
            state.tracks = action.payload.tracks;
        },
        setRecommendations: (state, action) => {
            state.recommendations = action.payload.recommendations;
        },
        setTheme: (state) => {
            state.darktheme = !state.darktheme;
        }
    }
})

export const {
    setLogin,
    setLogout,
    setAccessToken,
    setExpiresIn,
    setTracks,
    setRecommendations,
    setTheme,
} = authSlice.actions;
export default authSlice.reducer;