import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-4 mb-8">
            <img
              src="https://media.base44.com/images/public/6a2e1f2e45b60383a960c225/d049c4265_UseAIImageJun16202600_47_52.png"
              alt="Verifox logo"
              className="w-24 h-24 rounded-2xl object-cover shadow-lg"
            />
            <div className="font-black text-3xl tracking-tight uppercase leading-none">
              <div className="text-white">VERI</div>
              <div className="text-orange-500">FOX</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-slate-400 mt-1.5 text-sm">{subtitle}</p>}
        </div>
        <div className="bg-slate-900 rounded-2xl border border-white/10 p-8">
          {children}
        </div>
        {footer &&
        <p className="text-center text-sm text-slate-400 mt-6">{footer}</p>
        }
      </div>
    </div>);

}