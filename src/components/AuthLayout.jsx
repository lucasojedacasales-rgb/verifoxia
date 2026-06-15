import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 justify-center mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-white font-bold text-xl">Trustify</span>
          </div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 mb-4">
            <Icon className="w-6 h-6 text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-slate-400 mt-1.5 text-sm">{subtitle}</p>}
        </div>
        <div className="bg-slate-900 rounded-2xl border border-white/10 p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-slate-400 mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}