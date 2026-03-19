export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API Endpoint: /api/earthquakes
    if (url.pathname.endsWith('/api/earthquakes')) {
      const KANDILLI_API = 'https://api.orhanaydogdu.com.tr/deprem/kandilli/live';
      const cacheKey = new Request(url.toString(), request);
      const cache = caches.default;

      // Try to serve from cache
      let response = await cache.match(cacheKey);

      if (!response) {
        try {
          const apiResponse = await fetch(KANDILLI_API, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
          });
          const data = await apiResponse.json();
          const earthquakes = data.result || [];

          response = new Response(JSON.stringify(earthquakes), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=60',
            },
          });

          // Store in cache for 60 seconds
          ctx.waitUntil(cache.put(cacheKey, response.clone()));
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Failed to fetch', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
      return response;
    }

    // Otherwise, serve static assets (HTML, CSS, JS) from the public folder
    // Cloudflare Workers with Assets handles this automatically if configured in wrangler.toml
    return env.ASSETS.fetch(request);
  },
};
