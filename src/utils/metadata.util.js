/**
 * @description Helper function to get metadata of a given url
 *
 */

const metaScrapper = require("metadata-scraper");
const customRedis = require("../services/custom-redis.service");

async function getMetaData(url) {
    try {
        // Check for the cached result and return if found
        const cachedResult = await customRedis.get(url);
        if (cachedResult) return cachedResult;

        const meta = await metaScrapper(url);
        await customRedis.set(url, JSON.stringify(meta));
        return meta;

    } catch (error) {
        console.log(error.message);
        return {};
    }
}

async function getMetaTitle(url) {
    try {
        const meta = await getMetaData(url);
        return meta.title;
    } catch (error) {
        console.log(error.message);
        return "";
    }
}

async function getMetaDescription(url) {
    try {
        const meta = await getMetaData(url);
        return meta.description;
    } catch (error) {
        console.log(error.message);
        return "";
    }
}


module.exports = { getMetaTitle, getMetaDescription, getMetaData };