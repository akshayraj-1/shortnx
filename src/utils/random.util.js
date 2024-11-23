function generateRandomString(length, options) {
    options = {
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
        ...options
    };
    let result = "";
    const characters = [];
    if (options.lowercase) characters.push(..."abcdefghijklmnopqrstuvwxyz");
    if (options.uppercase) characters.push(..."ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if (options.numbers) characters.push(..."0123456789");
    if (options.symbols) characters.push(..."!@#$%^&*()_+-=[]{}|;:,.<>?/\\");
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) result += characters[(Math.floor(Math.random() * charactersLength))];
    return result;
}

function generateRandomNumber(length) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
}


module.exports = { generateRandomString, generateRandomNumber };