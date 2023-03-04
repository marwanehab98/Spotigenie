const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = process.env.REDIRECT_URI;
const clientId = process.env.CLIENT_ID;

const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-top-read",
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}`;
