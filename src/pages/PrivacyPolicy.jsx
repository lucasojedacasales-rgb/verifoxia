import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import useSEO from "@/hooks/useSEO";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useSEO({
    title: "Política de Privacidad — VERIFOX",
    description: "Lee la política de privacidad de VERIFOX. Información sobre cómo recopilamos, usamos y protegemos tus datos personales conforme al RGPD.",
    canonical: "https://verifoxia.com/privacy",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <h1 className="text-white font-semibold text-base">Política de Privacidad</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8 pb-24">
        {/* Brand */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            <span className="text-white">VERI</span><span className="text-orange-500">FOX</span>
          </h2>
          <p className="text-slate-400 mt-1 text-sm">Última actualización: 16 de junio de 2026</p>
        </div>

        <Section title="1. Introducción">
          <p>
            En <strong>VERIFOX</strong> ("nosotros", "nuestro" o "la plataforma"), nos comprometemos a proteger tu
            privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos tu información
            personal cuando utilizas nuestra aplicación web y servicios de comparación de precios.
          </p>
          <p className="mt-3">
            Al usar VERIFOX, aceptas las prácticas descritas en esta política.
          </p>
        </Section>

        <Section title="2. Información que recopilamos">
          <ul className="space-y-2 list-disc list-inside text-slate-300">
            <li><strong>Datos de cuenta:</strong> nombre, dirección de correo electrónico y contraseña (cifrada) al registrarte.</li>
            <li><strong>Historial de búsquedas:</strong> consultas que realizas dentro de la plataforma para mejorar tu experiencia.</li>
            <li><strong>Alertas de precio:</strong> productos y precios objetivo que configuras para recibir notificaciones.</li>
            <li><strong>Favoritos:</strong> productos que guardas para consultar más adelante.</li>
            <li><strong>Preferencias:</strong> país, idioma y moneda seleccionados.</li>
            <li><strong>Imágenes subidas:</strong> fotos que compartes para búsquedas visuales de productos.</li>
            <li><strong>Datos de uso:</strong> páginas visitadas, búsquedas realizadas y acciones en la app (de forma anonimizada).</li>
          </ul>
        </Section>

        <Section title="3. Cómo usamos tu información">
          <ul className="space-y-2 list-disc list-inside text-slate-300">
            <li>Proporcionar y mejorar el servicio de comparación de precios.</li>
            <li>Enviar alertas de precio cuando un producto baje al precio objetivo.</li>
            <li>Personalizar resultados según tu región e idioma.</li>
            <li>Analizar búsquedas para mejorar la relevancia de los resultados.</li>
            <li>Garantizar la seguridad y prevenir el uso fraudulento de la plataforma.</li>
            <li>Enviarte comunicaciones relacionadas con tu cuenta (no publicidad no solicitada).</li>
          </ul>
        </Section>

        <Section title="4. Servicios de terceros">
          <p className="text-slate-300">VERIFOX utiliza los siguientes servicios externos que pueden procesar tus datos:</p>
          <ul className="space-y-2 list-disc list-inside text-slate-300 mt-3">
            <li><strong>Google Shopping / SerpAPI:</strong> para obtener precios y disponibilidad de productos cuando hay resultados para tu búsqueda.</li>
            <li><strong>Google Vision API:</strong> para analizar imágenes en búsquedas visuales.</li>
            <li><strong>Google AdSense:</strong> para mostrar publicidad relevante. Google puede usar cookies propias.</li>
            <li><strong>Google OAuth:</strong> si inicias sesión con Google, se comparte tu nombre y correo con nosotros.</li>
          </ul>
          <p className="mt-3 text-slate-400 text-sm">
            Cada servicio tiene su propia política de privacidad. Te recomendamos consultarlas.
          </p>
        </Section>

        <Section title="5. Cookies y tecnologías similares">
          <p className="text-slate-300">
            Usamos <strong>almacenamiento local (localStorage)</strong> del navegador para guardar tus preferencias
            (país, idioma, aceptación del aviso legal) sin necesidad de cookies de rastreo propias.
          </p>
          <p className="mt-3 text-slate-300">
            Los anuncios de Google AdSense pueden usar cookies de terceros para personalizar publicidad.
            Puedes gestionar tus preferencias de anuncios en{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              adssettings.google.com
            </a>.
          </p>
        </Section>

        <Section title="6. Retención de datos">
          <p className="text-slate-300">
            Conservamos tus datos mientras mantengas una cuenta activa en VERIFOX. Puedes eliminar tu cuenta en
            cualquier momento desde <strong>Ajustes → Eliminar cuenta</strong>, lo que borrará permanentemente
            todos tus datos personales, historial, alertas y favoritos.
          </p>
        </Section>

        <Section title="7. Tus derechos (RGPD)">
          <p className="text-slate-300">Si resides en la Unión Europea, tienes derecho a:</p>
          <ul className="space-y-2 list-disc list-inside text-slate-300 mt-3">
            <li><strong>Acceso:</strong> solicitar una copia de tus datos personales.</li>
            <li><strong>Rectificación:</strong> corregir datos incorrectos.</li>
            <li><strong>Supresión:</strong> eliminar tus datos ("derecho al olvido").</li>
            <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado.</li>
            <li><strong>Oposición:</strong> oponerte al procesamiento de tus datos.</li>
          </ul>
          <p className="mt-3 text-slate-300">
            Para ejercer estos derechos, contáctanos en{" "}
            <a href="mailto:privacy@verifoxia.com" className="text-blue-400 underline">
              privacy@verifoxia.com
            </a>.
          </p>
        </Section>

        <Section title="8. Seguridad">
          <p className="text-slate-300">
            Implementamos medidas técnicas y organizativas para proteger tu información: cifrado HTTPS,
            contraseñas hasheadas y acceso restringido a los datos. Sin embargo, ningún sistema es 100% seguro,
            por lo que te recomendamos usar contraseñas seguras y únicas.
          </p>
        </Section>

        <Section title="9. Menores de edad">
          <p className="text-slate-300">
            VERIFOX no está dirigido a menores de 16 años. No recopilamos conscientemente datos de menores.
            Si crees que un menor ha creado una cuenta, contáctanos para eliminarla.
          </p>
        </Section>

        <Section title="10. Cambios en esta política">
          <p className="text-slate-300">
            Podemos actualizar esta política ocasionalmente. Te notificaremos mediante un aviso en la app cuando
            se realicen cambios significativos. La fecha de "última actualización" al inicio del documento
            indica cuándo fue revisada por última vez.
          </p>
        </Section>

        <Section title="11. Contacto">
          <p className="text-slate-300">
            Si tienes preguntas sobre esta Política de Privacidad, contáctanos:
          </p>
          <ul className="mt-3 space-y-1 text-slate-300">
            <li>📧 <a href="mailto:privacy@verifoxia.com" className="text-blue-400 underline">privacy@verifoxia.com</a></li>
            <li>🌐 <a href="/contact" className="text-blue-400 underline">verifoxia.com/contact</a></li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
