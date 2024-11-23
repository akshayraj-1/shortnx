/**
 * @note
 * The firebase sdk is meant to be used on the client side not the server side
 * For server side you should use firebase-admin sdk only,
 * but since I didn't want to share the firebase config data with the client side
 * I am using both firebase (auth) and firebase-admin (generating access tokens) sdk on the server side to authenticate the user
 */

const app = require("firebase/app");
const auth = require("firebase/auth");
const admin = require("firebase-admin");
const serviceAccount = require("../configs/firebase-service-account.json");
const firebaseConfig = require("../configs/firebase-config.json");

const appInstance = app.initializeApp(firebaseConfig);
const authInstance = auth.getAuth(appInstance);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function getUserByEmail(email) {
    return await admin.auth().getUserByEmail(email);
}

async function signInWithEmail(email, password) {
    const response = await auth.signInWithEmailAndPassword(authInstance, email, password);
    await auth.signOut(authInstance); // Clearing the session
    return response;
}

async function signUpWithEmail(email, password) {
    const response = await auth.createUserWithEmailAndPassword(authInstance, email, password);
    await auth.signOut(authInstance); // Clearing the session
    return response;
}

async function createUser({ uid, displayName, email, photoURL, emailVerified, providerId }) {
    return await admin.auth().createUser({
        uid,
        displayName,
        email,
        emailVerified,
        photoURL,
        providerData: [{ uid, providerId, displayName, email, photoURL }]
    });
}

async function createCustomToken(uid) {
    return await admin.auth().createCustomToken(uid);
}

// Verify the user's id token
async function verifyIdToken(idToken) {
    const response = await admin.auth().verifyIdToken(idToken);
    return {
        uid: response.uid,
        email: response.email,
        exp: response.exp * 1000
    }
}

// Regenerate the user's id token if the token is expired
async function refreshIdToken(refreshToken) {
    const url = `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: refreshToken
        })
    });
    const data = await response.json();
    return {
        uid: data.user_id,
        refresh_token: data.refresh_token,
        exp: Date.now() + (data.expires_in * 1000)
    }
}

module.exports = { getUserByEmail, createUser, createCustomToken, signInWithEmail, signUpWithEmail, verifyIdToken, refreshIdToken };
