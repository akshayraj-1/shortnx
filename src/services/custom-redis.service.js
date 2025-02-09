/**
 * @description My own caching service similar to redis
 * @warning Please use it on your own risk; I am not responsible for any data loss
 *
 */

// TODO: Implement the server side logic
const SERVICE_ENABLED = false;

function getConfig() {
    return {
        CUSTOM_REDIS_API_KEY: process.env.CUSTOM_REDIS_API_KEY,
        CUSTOM_REDIS_SERVER_URL: process.env.CUSTOM_REDIS_SERVER_URL
    };
}

/**
 * @description Get data from CUSTOM_REDIS
 * @param {string} key
 * @returns {Promise<object | null>}
 */
async function get(key) {
    if (!SERVICE_ENABLED) return null;
    const { CUSTOM_REDIS_API_KEY, CUSTOM_REDIS_SERVER_URL } = getConfig();
    if (!key || typeof key !== "string") throw new Error("Invalid key format");
    try {
        const response = await fetch(`${CUSTOM_REDIS_SERVER_URL}?key=${key}`, {
            headers: { "Authorization": `Bearer ${CUSTOM_REDIS_API_KEY}` }
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.log(`CUSTOM_REDIS ERROR: ${error.message}`);
        return null;
    }
}

/**
 * @description Set data to CUSTOM_REDIS
 * @param key
 * @param value
 * @param ttl
 * @returns {Promise<object |null>}
 */
async function set(key, value, ttl = 3600) {
    if (!SERVICE_ENABLED) return null;
    const { CUSTOM_REDIS_API_KEY, CUSTOM_REDIS_SERVER_URL } = getConfig();
    if (!key || typeof key !== "string") throw new Error("Invalid key format");
    if (!value || typeof value !== "string") throw new Error("Invalid value format");
    if (typeof ttl !== "number" || ttl < 0) throw new Error("TTL must be a positive integer");
    if (ttl > 86400) throw new Error("TTL must be less than 24hrs or 86400 seconds");
    try {
        const response = await fetch(`${CUSTOM_REDIS_SERVER_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CUSTOM_REDIS_API_KEY}`
            },
            body: JSON.stringify({ key, value, ttl })
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.log(`CUSTOM_REDIS ERROR: ${error.message}`);
        return null;
    }
}

/**
 * @description Delete data from CUSTOM_REDIS
 * @param key
 * @returns {Promise<any|null>}
 */
async function del(key) {
    if (!SERVICE_ENABLED) return null;
    const { CUSTOM_REDIS_API_KEY, CUSTOM_REDIS_SERVER_URL } = getConfig();
    if (!key || typeof key !== "string") throw new Error("Invalid key format");
    try {
        const response = await fetch(`${CUSTOM_REDIS_SERVER_URL}?key=${key}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${CUSTOM_REDIS_API_KEY}` }
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.log(`CUSTOM_REDIS ERROR: ${error.message}`);
        return null;
    }
}

module.exports = { get, set, del };