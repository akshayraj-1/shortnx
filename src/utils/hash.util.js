const bcrypt = require("bcrypt");

async function hashPassword(password) {
    if (!password) throw new Error("Password is required");
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hash) {
    if (!password || !hash) return false;
    return await bcrypt.compare(password, hash);
}



module.exports = { hashPassword, comparePassword };