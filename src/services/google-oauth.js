const { OAuth2Client } = require("google-auth-library");

function getOAuthClientInstance() {
    return new OAuth2Client({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: `${process.env.SERVER_BASE_URL}/api/auth/google/callback`
    });
}

// Get the authentication URL
function getGoogleOAuthURL() {
    return getOAuthClientInstance().generateAuthUrl({
        prompt: "consent",
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"
        ]
    });
}

// Get the user info from the code in the callback
async function getUserFromAuthCode(code) {
    if (!code) return null;
    const instance = getOAuthClientInstance();
    const { tokens } = await instance.getToken(code);
    const { id_token } = tokens;
    const ticket = await instance.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
}


module.exports = { getGoogleOAuthURL, getUserFromAuthCode };