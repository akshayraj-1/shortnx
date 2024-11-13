function getClientBrowser(req) {
     const browser = req.headers['sec-ch-ua'] || req.headers['user-agent'];
    // [HTTP_USER_AGENT] => Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36
    // [HTTP_USER_AGENT] => Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0
    // [HTTP_SEC_CH_UA] => Not.A/Brand; v="8",Chromium; v="126",Google Chrome; v="126"
    // [HTTP_SEC_CH_UA] => "Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"
    if (new RegExp(/Chrome/gi).test(browser)) {
        return "Google Chrome";
    } else if (new RegExp(/Firefox/gi).test(browser)) {
        return "Firefox";
    } else if (new RegExp(/Safari/gi).test(browser)) {
        return "Safari";
    } else if (new RegExp(/Edge/gi).test(browser)) {
        return "MS Edge";
    } else if (new RegExp(/OPERA|OPR/gi).test(browser)) {
        return "Opera";
    } else if (new RegExp(/Brandi/gi).test(browser)) {
        return "Brave";
    } else {
        return "Unknown";
    }
}

function getClientPlatform(req) {
    const platform = req.headers['sec-ch-ua-platform'] || req.headers['user-agent'];
    // [HTTP_SEC_CH_UA_PLATFORM] => "Windows"
    // [HTTP_USER_AGENT] => Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36
    if (new RegExp(/Windows/gi).test(platform)) {
        return "Windows";
    } else if (new RegExp(/Linux/gi).test(platform)) {
        return "Linux";
    } else if (new RegExp(/Mac/gi).test(platform)) {
        return "Mac";
    } else if (new RegExp(/Android/gi).test(platform)) {
        return "Android";
    } else if (new RegExp(/iOS/gi).test(platform)) {
        return "iOS";
    } else {
        return "Unknown";
    }
}

function getClientDevice(req) {
    const device = getClientPlatform(req);
    if (device === "Windows" || device === "Linux" || device === "Mac") {
        return "Desktop";
    } else if (device === "Android" || device === "iOS") {
        return "Mobile";
    } else {
        return "Unknown";
    }
}

async function clientRequestInfo(req) {
    const ip = req.ip === "::1" ? "127.0.0.1" : req.ip;
    const info = await fetch("https://ipinfo.io/" + ip + "/json");
    const data = await info.json();
    const browser = getClientBrowser(req);
    const platform = getClientPlatform(req);
    const deviceType = getClientDevice(req);
    return {
        ip,
        hostname: req.hostname,
        city: data.city || "Unknown",
        region: data.region || "Unknown",
        country: data.country || "Unknown",
        location: data.loc || "Unknown",
        timezone: data.timezone || "Unknown",
        deviceType,
        platform,
        browser,
        timestamp: Date.now()
    };
}

module.exports = clientRequestInfo;

