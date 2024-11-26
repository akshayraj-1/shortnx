const jsonwebtoken = require("jsonwebtoken");

function generateToken(data, expiresIn) {
    const secret = process.env.JWT_SECRET;
    return jsonwebtoken.sign({ iss: "url-shortener", ...data }, secret, expiresIn && { expiresIn });
}

function decodeToken(token) {
    return jsonwebtoken.decode(token);
}

/**
 * Generates a refresh token for the given user ID.
 *
 * @param {string} userId - The user ID to generate a refresh token for.
 * @returns {Promise<string>} - A promise that resolves to the generated refresh token.
 * @throws {Promise<{code: "NO_USER_ID", message: string}>} - Rejects with an error code and message if there is no user ID.
 */
function getRefreshToken(userId) {
    if (!userId) return Promise.reject({ code: "NO_USER_ID", message: "No user ID" });
    return Promise.resolve(generateToken({ userId }));
}

/**
 * Generates an access token using a refresh token.
 * Since the refreshToken are not exposed to the client they can be just decoded to get the userId.
 * No need to verify the signature of the refreshToken in this case.
 *
 * @param {string} refreshToken - The refresh token to decode for user information.
 * @returns {Promise<string>} - A promise that resolves to the generated access token.
 */
function getAccessToken(refreshToken) {
    const { userId } = decodeToken(refreshToken);
    return Promise.resolve(generateToken({ userId }, "1d"));
}

/**
 * Validates the access token.
 *
 * @param {string} accessToken - The access token to validate.
 * @returns {Promise<{userId: string}>} - A promise that resolves with the user ID if the token is valid.
 * @throws {Promise<{code: "INVALID_ACCESS_TOKEN" | "ACCESS_TOKEN_EXPIRED", message: string}>} - Rejects with an error code and message if the token is invalid or expired.
 */
function validateAccessToken(accessToken) {
    try {
        const { userId, iss } = jsonwebtoken.verify(accessToken, process.env.JWT_SECRET);
        if (!userId || iss !== "url-shortener") throw { code: "INVALID_ACCESS_TOKEN", message: "Invalid access token" };
        return Promise.resolve({ userId });
    } catch (error) {
        return Promise.reject({
            code: error instanceof jsonwebtoken.TokenExpiredError ? "ACCESS_TOKEN_EXPIRED" : "INVALID_ACCESS_TOKEN",
            message: error instanceof jsonwebtoken.TokenExpiredError ? "Access token expired" : "Invalid access token"
        });
    }
}

module.exports = { getAccessToken, getRefreshToken, decodeToken, validateAccessToken };