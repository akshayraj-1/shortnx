/**
 * @description Helper function to get metadata of a given url
 *
 */

// TODO: Implement caching for better performance
//  Since vercel only provides cloud version of redis and other caching services,
//  I need to build my own caching service using my cdn hosting,
//  but you are free to use redis or any other caching service

const getMeta = require("metadata-scraper");

async function getMetaData(url) {
    try {
        return await getMeta(url);
    } catch (error) {
        console.log(error.message);
        return {};
    }
}


module.exports = { getMetaData };