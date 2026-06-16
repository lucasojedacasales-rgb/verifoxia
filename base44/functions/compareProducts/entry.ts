import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { queryA, queryB, countryName, countryCode, currency, symbol } = await req.json();

    if (!queryA || !queryB) {
      return Response.json({ error: 'Se requieren los dos productos' }, { status: 400 });
    }

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Eres un experto en comparación de productos. Compara estos dos productos para un usuario de ${countryName} (${countryCode}), moneda ${currency} (${symbol}).

PRODUCTO A: "${queryA}"
PRODUCTO B: "${queryB}"

INSTRUCCIONES:
1. Detecta si los productos son tecnológicos (teléfono, tablet, portátil, smartwatch, auriculares, GPU, CPU, cámara, etc.).
2. Si son tecnológicos, rellena "tech_specs" con especificaciones REALES y PRECISAS. Si no, devuelve arrays vacíos.
3. Todos los precios en ${currency}.

Devuelve exclusivamente el JSON con esta estructura:
{
  "is_tech": true,
  "product_a": {
    "name": "nombre completo y modelo exacto del producto A",
    "price_range": "rango de precios en ${currency}",
    "best_price": 999,
    "best_store": "tienda con mejor precio",
    "rating": 4.5,
    "pros": ["ventaja 1", "ventaja 2", "ventaja 3"],
    "cons": ["desventaja 1", "desventaja 2"],
    "best_for": "perfil de usuario ideal",
    "tech_specs": [
      { "label": "Procesador", "value": "valor exacto" },
      { "label": "Pantalla", "value": "valor exacto" },
      { "label": "RAM", "value": "valor exacto" },
      { "label": "Batería", "value": "valor exacto" }
    ]
  },
  "product_b": {
    "name": "nombre completo y modelo exacto del producto B",
    "price_range": "rango de precios en ${currency}",
    "best_price": 899,
    "best_store": "tienda con mejor precio",
    "rating": 4.3,
    "pros": ["ventaja 1", "ventaja 2", "ventaja 3"],
    "cons": ["desventaja 1", "desventaja 2"],
    "best_for": "perfil de usuario ideal",
    "tech_specs": [
      { "label": "Procesador", "value": "valor exacto" },
      { "label": "Pantalla", "value": "valor exacto" },
      { "label": "RAM", "value": "valor exacto" },
      { "label": "Batería", "value": "valor exacto" }
    ]
  },
  "head_to_head": [
    { "criterion": "Precio", "winner": "A", "detail": "detalle con datos concretos" },
    { "criterion": "Rendimiento", "winner": "B", "detail": "detalle" },
    { "criterion": "Pantalla", "winner": "empate", "detail": "detalle" },
    { "criterion": "Batería", "winner": "A", "detail": "detalle" },
    { "criterion": "Cámara", "winner": "B", "detail": "detalle" },
    { "criterion": "Relación calidad-precio", "winner": "A", "detail": "detalle" }
  ],
  "overall_winner": "A",
  "winner_reason": "Explicación clara de 2-3 oraciones de por qué es el ganador",
  "recommendation": "Consejo personalizado para el usuario en ${countryName}"
}`,
      response_json_schema: {
        type: "object",
        required: ["is_tech", "product_a", "product_b", "head_to_head", "overall_winner", "winner_reason", "recommendation"],
        properties: {
          is_tech: { type: "boolean" },
          product_a: {
            type: "object",
            required: ["name", "price_range", "best_price", "best_store", "rating", "pros", "cons", "best_for", "tech_specs"],
            properties: {
              name: { type: "string" },
              price_range: { type: "string" },
              best_price: { type: "number" },
              best_store: { type: "string" },
              rating: { type: "number" },
              pros: { type: "array", items: { type: "string" } },
              cons: { type: "array", items: { type: "string" } },
              best_for: { type: "string" },
              tech_specs: {
                type: "array",
                items: {
                  type: "object",
                  required: ["label", "value"],
                  properties: { label: { type: "string" }, value: { type: "string" } }
                }
              }
            }
          },
          product_b: {
            type: "object",
            required: ["name", "price_range", "best_price", "best_store", "rating", "pros", "cons", "best_for", "tech_specs"],
            properties: {
              name: { type: "string" },
              price_range: { type: "string" },
              best_price: { type: "number" },
              best_store: { type: "string" },
              rating: { type: "number" },
              pros: { type: "array", items: { type: "string" } },
              cons: { type: "array", items: { type: "string" } },
              best_for: { type: "string" },
              tech_specs: {
                type: "array",
                items: {
                  type: "object",
                  required: ["label", "value"],
                  properties: { label: { type: "string" }, value: { type: "string" } }
                }
              }
            }
          },
          head_to_head: {
            type: "array",
            items: {
              type: "object",
              required: ["criterion", "winner", "detail"],
              properties: {
                criterion: { type: "string" },
                winner: { type: "string" },
                detail: { type: "string" }
              }
            }
          },
          overall_winner: { type: "string" },
          winner_reason: { type: "string" },
          recommendation: { type: "string" }
        }
      }
    });

    return Response.json(result);
  } catch (error) {
    console.error("compareProducts error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});