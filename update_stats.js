const fs = require('fs');
const https = require('https');

// Account configurations
const username = 'camposderap';
const statsFilePath = './stats.json';

// Helper function to make HTTPS GET requests with a browser-like User Agent
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
            }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Format numbers nicely (e.g. 1361 -> 1,361)
function formatNumber(numStr) {
    const num = parseInt(numStr.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num)) return numStr;
    return num.toLocaleString('en-US');
}

async function updateStats() {
    console.log('--- CAMPOS DE RAP METRICS UPDATER ---');
    
    // 1. Load current stats to use as fallback
    let stats = {
        instagram_followers: "1,361",
        tiktok_followers: "281",
        facebook_likes: "20",
        videos: [
            { id: "gona", views: "34.2K", likes: "4.1K", comments: "285" },
            { id: "sabia_escuela", views: "22.5K", likes: "2.9K", comments: "198" },
            { id: "rapiam", views: "19.1K", likes: "1.9K", comments: "142" }
        ]
    };

    if (fs.existsSync(statsFilePath)) {
        try {
            const rawData = fs.readFileSync(statsFilePath, 'utf8');
            stats = JSON.parse(rawData);
            console.log('Loaded existing stats.json successfully.');
        } catch (e) {
            console.log('Could not parse existing stats.json, using default template.');
        }
    }

    // 2. Fetch TikTok Followers count (TikTok is bot-friendly)
    try {
        console.log('Fetching TikTok followers count...');
        const tiktokHtml = await fetchUrl(`https://www.tiktok.com/@${username}`);
        const match = tiktokHtml.match(/"followerCount"\s*:\s*(\d+)/);
        if (match && match[1]) {
            stats.tiktok_followers = formatNumber(match[1]);
            console.log(`TikTok followers updated: ${stats.tiktok_followers}`);
        } else {
            console.log('TikTok followerCount key not found in HTML, keeping previous value.');
        }
    } catch (error) {
        console.error('Error updating TikTok stats:', error.message);
    }

    // 3. Fetch Instagram Followers count (Attempts to scrape profile, handles block)
    try {
        console.log('Fetching Instagram followers count...');
        const instaHtml = await fetchUrl(`https://www.instagram.com/${username}/`);
        
        // Match regex: "1,361 Followers" or similar
        const followersRegex = /([0-9.,KMB]+)\s*Followers/i;
        const match = instaHtml.match(followersRegex);
        
        if (match && match[1]) {
            stats.instagram_followers = match[1];
            console.log(`Instagram followers updated: ${stats.instagram_followers}`);
        } else {
            console.log('Instagram request blocked or redirected (standard cloud-IP defense), keeping previous value.');
        }
    } catch (error) {
        console.error('Error updating Instagram stats:', error.message);
    }

    // 4. Save updated stats to stats.json
    try {
        fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2), 'utf8');
        console.log('Saved updated stats to stats.json successfully.');
    } catch (error) {
        console.error('Error writing stats.json:', error.message);
    }
}

updateStats();
