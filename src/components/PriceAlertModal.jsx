import { useState } from "react";
import { Bell, X, Mail, TrendingDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";

export default function PriceAlertModal({ product, country, onClose }) {
  const [email, setEmail] = useState("");
  const [targetPrice, setTargetPrice] = useState(() =>
    product?.stores?.length
      ? Math.round(Math.min(...product.stores.map(s => s.price || Infinity)) * 0.9)
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const bestStore = product?.stores?.length
    ? [...product.stores].sort((a, b) => (a.price || 0) - (b.price || 0))[0]
    : null;
  const currentMinPrice = bestStore?.price || 0;
  const currency = bestStore?.currency || country?.currency || "EUR";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !targetPrice) return;

    setLoading(true);
    setError("");

    await base44.entities.PriceAlert.create({
      email,
      product_name: product.name,
      search_query: product.search_query,
      target_price: Number(targetPrice),
      current_price: currentMinPrice,
      currency,
      country_code: country?.code || "ES",
      country_name: country?.name || "España",
      best_store: bestStore?.store_name || "",
      best_store_url: bestStore?.url || "",
      status: "active"
    });

    // Send confirmation email
    await base44.integrations.Core.SendEmail({
      to: email,
      subject: `✅ Alerta creada: ${product.name}`,
      body: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 26px;">🔔 Alerta configurada</h1>
      <p style="color: #bfdbfe; margin: 8px 0 0;">Te avisaremos cuando baje el precio</p>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #f1f5f9; margin-top: 0;">${product.name}</h2>
      <div style="background: #0f172a; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #94a3b8;">Precio actual más bajo:</span>
          <span style="color: #f1f5f9; font-weight: bold;">${currentMinPrice.toLocaleString()} ${currency}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #94a3b8;">Tu precio objetivo:</span>
          <span style="color: #34d399; font-weight: bold;">${Number(targetPrice).toLocaleString()} ${currency}</span>
        </div>
      </div>
      <p style="color: #94a3b8; font-size: 14px; text-align: center;">
        Te enviaremos un aviso a <strong style="color: #93c5fd;">${email}</strong> en cuanto el precio baje a tu objetivo.<br/>
        País configurado: ${country?.flag || ""} ${country?.name || "España"}
      </p>
      <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 20px; border-top: 1px solid #334155; padding-top: 20px;">
        <strong>PriceWise</strong> — Comparador inteligente de precios
      </p>
    </div>
  </div>
</body>
</html>`,
      from_name: "PriceWise Alertas"
    });

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">¡Alerta creada!</h3>
          <p className="text-slate-400 mb-2">
            Te avisaremos a <span className="text-blue-400">{email}</span> cuando <strong className="text-white">{product.name}</strong> baje de{" "}
            <span className="text-green-400 font-bold">{Number(targetPrice).toLocaleString()} {currency}</span>.
          </p>
          <p className="text-slate-500 text-sm mb-6">Revisa tu bandeja de entrada, te hemos enviado una confirmación.</p>
          <Button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 w-full">
            Entendido
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Alerta de precio</h3>
              <p className="text-slate-400 text-sm">Te avisamos cuando baje</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-4 mb-5">
          <p className="text-white font-medium text-sm mb-1 line-clamp-2">{product.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span className="text-slate-400 text-sm">
              Precio mínimo actual:{" "}
              <span className="text-white font-bold">{currentMinPrice.toLocaleString()} {currency}</span>
              {bestStore && <span className="text-slate-500"> en {bestStore.store_name}</span>}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm font-medium mb-1.5 block flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Tu email
            </label>
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm font-medium mb-1.5 block flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-green-400" /> Avísame cuando baje de...
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="Precio objetivo"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                required
                min={1}
                className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                {currency}
              </span>
            </div>
            {currentMinPrice > 0 && Number(targetPrice) > 0 && (
              <p className="text-slate-500 text-xs mt-1.5">
                Ahorro esperado: {((1 - Number(targetPrice) / currentMinPrice) * 100).toFixed(0)}% respecto al precio actual
              </p>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button
            type="submit"
            disabled={loading || !email || !targetPrice}
            className="w-full bg-blue-500 hover:bg-blue-600 h-11"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Configurando alerta...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Crear alerta de precio
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}