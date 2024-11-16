/**
 * NOTE: The firebase sdk is meant to be used on the client side not the server side
 *       For server side you should use firebase-admin sdk only,
 *       but since I didn't want to share the firebase config data with the client side
 *       I am using both firebase (auth) and firebase-admin (generating access tokens) sdk on the server side to authenticate the user
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

async function signInWithEmail(email, password) {
    const response = await auth.signInWithEmailAndPassword(authInstance, email, password);
    await auth.signOut(authInstance); // Clearing the session
    console.log(response);
    return response;
}

async function signUpWithEmail(email, password) {
    const response = await auth.createUserWithEmailAndPassword(authInstance, email, password);
    await auth.signOut(authInstance); // Clearing the session
    console.log(response);
    return response;
}

module.exports = { signInWithEmail, signUpWithEmail };
