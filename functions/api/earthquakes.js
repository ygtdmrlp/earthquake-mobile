export async function onRequest(context) {
    // Static test data to bypass external API call for debugging
    const staticData = [
        {
            "earthquake_id": "test-1",
            "title": "TEST DEPREM - MARMARA DENIZI",
            "mag": 4.5,
            "depth": 10.2,
            "geojson": { "type": "Point", "coordinates": [28.8, 40.9] },
            "date_time": "2026-03-19 12:00:00"
        },
        {
            "earthquake_id": "test-2",
            "title": "TEST DEPREM - EGE DENIZI",
            "mag": 3.2,
            "depth": 5.0,
            "geojson": { "type": "Point", "coordinates": [26.5, 39.5] },
            "date_time": "2026-03-19 11:30:00"
        }
    ];

    return new Response(JSON.stringify(staticData), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    });
}
