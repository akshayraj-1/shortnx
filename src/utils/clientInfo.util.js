function getClientBrowser(req) {
     const browser = req.headers['sec-ch-ua'] || req.headers['user-agent'];
    // [HTTP_USER_AGENT] => Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36
    // [HTTP_USER_AGENT] => Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0
    // [HTTP_SEC_CH_UA] => Not.A/Brand; v="8",Chromium; v="126",Google Chrome; v="126"
    // [HTTP_SEC_CH_UA] => "Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"
    switch (true) {
        case /\bChrome\b/gi.test(browser):
            return "Google Chrome";
        case /\bFirefox\b/gi.test(browser):
            return "Firefox";
        case /\bSafari\b/gi.test(browser):
            return "Safari";
        case /\bEdge\b/gi.test(browser):
            return "MS Edge";
        case /\b(OPERA|OPR)\b/gi.test(browser):
            return "Opera";
        case /\bBrave\b/gi.test(browser):
            return "Brave";
        default:
            return "Unknown";
    }
}

function getClientPlatform(req) {
    const platform = req.headers['sec-ch-ua-platform'] || req.headers['user-agent'];
    // [HTTP_SEC_CH_UA_PLATFORM] => "Windows"
    // [HTTP_USER_AGENT] => Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36
    switch (true) {
        case /\bWindows\b/gi.test(platform):
            return "Windows";
        case /\bLinux\b/gi.test(platform):
            return "Linux";
        case /\bMac\b/gi.test(platform):
            return "Mac";
        case /\bAndroid\b/gi.test(platform):
            return "Android";
        case /\biOS\b/gi.test(platform):
            return "iOS";
        default:
            return "Unknown";
    }
}

function getClientDevice(req) {
    const device = getClientPlatform(req);
    switch (device) {
        case "Windows":
        case "Linux":
        case "Mac":
            return "Desktop";
        case "Android":
        case "iOS":
            return "Mobile";
        default:
            return "Unknown";
    }
}

async function clientRequestInfo(req) {
    const ip = req.headers['x-forwarded-for']?.split(",")[0] || req.ip;
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

