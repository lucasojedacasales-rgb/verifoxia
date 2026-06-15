import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-3 mb-6">
            <img
              src="https://media.base44.com/images/public/6a2e1f2e45b60383a960c225/66d7c075b_UseAIImageJun16202600_47_52.png"
              alt="Verifox logo"
              className="w-20 h-20 rounded-2xl object-cover"
            />
            <span className="font-black text-2xl tracking-tight uppercase">
              <span className="text-white">VERI</span><span className="text-orange-500">FOX</span>
            </span>
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