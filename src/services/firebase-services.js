const { credential } = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const serviceAccount = require("../configs/firebase-service-account.json")

initializeApp({
    credential: credential.cert(serviceAccount),
});


exports.signUpWithEmail = (email, password) => {
    // TODO: Implement signup
}

exports.signInWithEmail = (email, password) => {
    // TODO: Implement login
}

exports.loginWithGoogle = () => {
    // TODO: Implement google auth
}