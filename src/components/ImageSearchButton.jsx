import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { useCountry } from "@/hooks/useCountry";

export default function ImageSearchButton() {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { selectedCountry } = useCountry();

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      // Upload image
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Use Google Vision API via backend function
      const response = await base44.functions.invoke("analyzeImage", { image_url: file_url });
      const productName = response?.data?.product_name;

      if (productName) {
        navigate(`/search?q=${encodeURIComponent(productName)}&country=${selectedCountry.code}`);
      } else {
        setError("No se pudo identificar el producto.");
      }
    } catch {
      setError("No se pudo analizar la imagen.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        title="Buscar por foto"
        className="h-14 px-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl transition-all flex items-center gap-2 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Camera className="w-5 h-5" />
        )}
        <span className="text-sm font-medium hidden sm:block">
          {loading ? "Identificando..." : "Buscar por foto"}
        </span>
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-300" role="status">
          {error}
        </p>
      )}
    </>
  );
}
