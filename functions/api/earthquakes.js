export async function onRequest(context) {
    const KANDILLI_API = 'https://api.orhanaydogdu.com.tr/deprem/kandilli/live';
    const cacheKey = new Request(KANDILLI_API);
    const cache = caches.default;

    // Try to find in cache
    let response = await cache.match(cacheKey);

    if (!response) {
        console.log('Fetching from API...');
        try {
            const apiResponse = await fetch(KANDILLI_API);
            const data = await apiResponse.json();
            const earthquakes = data.result || [];

            // Create new response for cache and client
            response = new Response(JSON.stringify(earthquakes), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, max-age=60', // 1 minute cache for Cloudflare
                },
            });

            // Cache it for 1 minute
            context.waitUntil(cache.put(cacheKey, response.clone()));
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } else {
        console.log('Serving from cache');
    }

    return response;
}
