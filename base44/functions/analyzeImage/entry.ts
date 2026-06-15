import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { image_url } = await req.json();
    if (!image_url) {
      return Response.json({ error: 'image_url is required' }, { status: 400 });
    }

    const apiKey = Deno.env.get('GOOGLE_VISION_API_KEY');

    // Fetch image and convert to base64
    const imageResponse = await fetch(image_url);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

    // Call Google Vision API
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: base64Image },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 5 },
              { type: 'WEB_DETECTION', maxResults: 5 },
            ]
          }]
        })
      }
    );

    const visionData = await visionResponse.json();

    if (!visionResponse.ok) {
      return Response.json({ error: visionData.error?.message || 'Vision API error' }, { status: 500 });
    }

    const response = visionData.responses?.[0];

    // Extract best product name from Vision results
    const webEntities = response?.webDetection?.webEntities || [];
    const objects = response?.localizedObjectAnnotations || [];
    const labels = response?.labelAnnotations || [];

    // Priority: web entities (most specific) > objects > labels
    const topWebEntity = webEntities.find(e => e.score > 0.5 && e.description)?.description;
    const topObject = objects[0]?.name;
    const topLabel = labels[0]?.description;

    const product_name = topWebEntity || topObject || topLabel || null;

    // Also return web best guess labels for context
    const bestGuessLabels = response?.webDetection?.bestGuessLabels?.map(l => l.label) || [];

    return Response.json({
      product_name: bestGuessLabels[0] || product_name,
      alternatives: [product_name, ...bestGuessLabels].filter(Boolean),
      labels: labels.slice(0, 5).map(l => l.description),
      objects: objects.map(o => o.name),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});