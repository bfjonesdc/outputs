export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'POSTMARK_SERVER_TOKEN environment variable not set' });
  }

  const headers = {
    'X-Postmark-Server-Token': token,
    'Accept': 'application/json',
  };

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const fromDate = sevenDaysAgo.toISOString().split('T')[0];
  const toDate = today.toISOString().split('T')[0];

  try {
    const [statsRes, bouncesRes, complaintsRes] = await Promise.all([
      fetch(`https://api.postmarkapp.com/stats/outbound?fromdate=${fromDate}&todate=${toDate}`, { headers }),
      fetch('https://api.postmarkapp.com/bounces?count=1&offset=0&type=All', { headers }),
      fetch('https://api.postmarkapp.com/messages/outbound/spam?count=1&offset=0', { headers }),
    ]);

    if (!statsRes.ok || !bouncesRes.ok || !complaintsRes.ok) {
      const errText = await (statsRes.ok ? (bouncesRes.ok ? complaintsRes : bouncesRes) : statsRes).text();
      return res.status(502).json({ error: 'Postmark API error', detail: errText });
    }

    const [stats, bounces, complaints] = await Promise.all([
      statsRes.json(),
      bouncesRes.json(),
      complaintsRes.json(),
    ]);

    res.status(200).json({
      sent: stats.Sent || 0,
      bounces: stats.Bounced || 0,
      complaints: stats.SpamComplaints || 0,
      opens: stats.Opens || 0,
      clicks: stats.Clicks || 0,
      recentBounceCount: bounces.TotalCount || 0,
      recentComplaintCount: complaints.TotalCount || 0,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Postmark data', detail: err.message });
  }
}
