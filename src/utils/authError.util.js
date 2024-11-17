function getFirebaseErrorMessage(error) {
    switch (error.code) {
        case "auth/email-already-in-use":
            return "This email is already registered";
        case "auth/wrong-password":
            return "Password is incorrect";
        case "auth/user-not-found":
            return "User not found";
        case "auth/user-disabled":
            return "User has been disabled";
        case "auth/too-many-requests":
            return "Too many requests";
        case "auth/operation-not-allowed":
            return "Operation is not allowed";
        case "auth/invalid-credential":
            return "Invalid credentials";
        case "auth/invalid-email":
            return "Invalid email address";
        case "auth/weak-password":
            return "Password is too weak";
        default:
            return "Something went wrong";
    }
}

module.exports = getFirebaseErrorMessage;