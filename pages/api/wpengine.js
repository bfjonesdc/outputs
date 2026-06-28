export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = process.env.WPENGINE_USER_ID;
  const password = process.env.WPENGINE_PASSWORD;

  if (!userId || !password) {
    return res.status(500).json({
      error: 'WPENGINE_USER_ID and WPENGINE_PASSWORD environment variables not set',
    });
  }

  const credentials = Buffer.from(`${userId}:${password}`).toString('base64');
  const headers = {
    Authorization: `Basic ${credentials}`,
    Accept: 'application/json',
  };

  try {
    // Fetch installs from WP Engine API v1
    const installsRes = await fetch('https://api.wpengineapi.com/v1/installs', { headers });

    if (!installsRes.ok) {
      const errText = await installsRes.text();
      return res.status(502).json({ error: 'WP Engine API error', detail: errText });
    }

    const installsData = await installsRes.json();
    const installs = installsData.results || [];

    // Derive a simple status from install data
    const allRunning = installs.every((i) => i.status === 'running');
    const status = installs.length === 0 ? 'unknown' : allRunning ? 'operational' : 'degraded';

    // WP Engine API doesn't expose uptime % or response times directly;
    // return what's available and let the UI handle nulls gracefully.
    res.status(200).json({
      status,
      installCount: installs.length,
      installs: installs.map((i) => ({
        name: i.name,
        environment: i.environment,
        status: i.status,
        primaryDomain: i.primary_domain,
      })),
      uptime: null,
      pageLoadTime: null,
      coreWebVitals: { lcp: null, fid: null, cls: null },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch WP Engine data', detail: err.message });
  }
}
