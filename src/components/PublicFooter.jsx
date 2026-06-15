import { Link } from "react-router-dom";

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 border-t border-white/10 px-4 py-8 text-center">
      <div className="max-w-4xl mx-auto">
        <nav className="flex flex-wrap justify-center gap-6 mb-4">
          <Link
            to="/about"
            className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium"
          >
            Acerca de
          </Link>
          <Link
            to="/contact"
            className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium"
          >
            Contacto
          </Link>
        </nav>
        <p className="text-slate-500 text-sm">
          © 2026 Trustify. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}