import { ArrowLeft, Mail, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-slate-300 hover:text-white"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white font-bold text-lg">Contacto</h1>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Ponte en Contacto
              </h1>
              <p className="text-slate-300 text-lg">
                ¿Preguntas, sugerencias o reportar un problema? Nos encantaría escucharte. Elige tu método preferido para comunicarte con nosotros.
              </p>
            </div>

            {/* Email Contact */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Email</h3>
                  <a
                    href="mailto:contact@trustify.com"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    contact@trustify.com
                  </a>
                  <p className="text-slate-400 text-sm mt-2">
                    Responderemos en menos de 24 horas
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3">Redes Sociales</h3>
                  <div className="space-y-2">
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      Twitter / X →
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      LinkedIn →
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      Instagram →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Envíanos un Mensaje</h2>
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 font-medium">¡Mensaje enviado! Nos pondremos en contacto pronto.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                  Nombre
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-10"
                  aria-label="Nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-10"
                  aria-label="Email"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white text-sm font-medium mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aquí..."
                  required
                  rows="5"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Mensaje"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-all min-h-[44px]"
              >
                Enviar Mensaje
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}