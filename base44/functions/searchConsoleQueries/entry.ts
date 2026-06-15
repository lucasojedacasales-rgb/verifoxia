import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');

    const body = await req.json().catch(() => ({}));
    const { siteUrl, startDate, endDate, rowLimit = 25 } = body;

    if (!siteUrl) {
      return Response.json({ error: 'siteUrl is required' }, { status: 400 });
    }

    // Fetch top queries
    const queriesRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: startDate || getDateDaysAgo(28),
          endDate: endDate || getDateDaysAgo(1),
          dimensions: ['query'],
          rowLimit,
          orderType: 'RANKING'
        })
      }
    );

    if (!queriesRes.ok) {
      const err = await queriesRes.json();
      return Response.json({ error: err.error?.message || 'Search Console API error' }, { status: queriesRes.status });
    }

    const queriesData = await queriesRes.json();

    // Fetch sites list
    const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const sitesData = sitesRes.ok ? await sitesRes.json() : { siteEntry: [] };

    return Response.json({
      rows: queriesData.rows || [],
      sites: sitesData.siteEntry || []
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}