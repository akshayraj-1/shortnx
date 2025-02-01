/**
 * @description Helper function to get metadata of a given url
 *
 */

const getMeta = require("metadata-scraper");
const customRedis = require("../services/customRedis.service");

async function getMetaData(url) {
    try {
        // Check for the cached result and return if found
        const cachedResult = await customRedis.get(url);
        if (cachedResult) return cachedResult;

        const meta = await getMeta(url);
        await customRedis.set(url, JSON.stringify(meta));
        return meta;

    } catch (error) {
        console.log(error.message);
        return {};
    }
}


module.exports = getMetaData;