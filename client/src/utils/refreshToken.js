import axios from "axios";

export async function refreshAccessToken(token) {
    try {
        const response = await axios.post("http://localhost:3001/auth/refresh", { token })
        const accessToken = response.data.tokens.access_token;
        return accessToken;
    } catch (error) {
        console.log(error)
    }
}