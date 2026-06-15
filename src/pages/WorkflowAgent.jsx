import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Loader2, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageBubble from "@/components/MessageBubble";

export default function WorkflowAgent() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: "workflow_optimizer",
      metadata: { name: "Sesión de optimización" }
    });
    setConversation(conv);

    const unsub = base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages || []);
    });

    // Kick off with an automatic greeting analysis
    await base44.agents.addMessage(conv, {
      role: "user",
      content: "Analiza mi historial de búsquedas y alertas activas, y dame recomendaciones para optimizar mi flujo de compras."
    });

    return () => unsub();
  };

  const handleSend = async () => {
    if (!input.trim() || !conversation || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    await base44.agents.addMessage(conversation, { role: "user", content: text });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isAgentTyping = messages.length > 0 && messages[messages.length - 1]?.role === "user";

  return (
    <div className="flex flex-col h-screen bg-slate-950">
      {/* Header */}
      <div className="shrink-0 bg-slate-900 border-b border-white/10 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-base">Optimizador de Flujo</h1>
            <p className="text-slate-400 text-xs">Analiza tus búsquedas y recomienda mejoras</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Analizando tu historial...</p>
                <p className="text-slate-400 text-sm mt-1">El agente está revisando tus datos</p>
              </div>
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {isAgentTyping && (
            <div className="flex gap-3">
              <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5">
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 bg-slate-900 border-t border-white/10 px-4 py-4 pb-safe">
        <div className="max-w-2xl mx-auto flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Pregunta al agente sobre tus hábitos de compra..."
            rows={1}
            className="flex-1 resize-none bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-32"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || sending || !conversation}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 min-h-[44px]"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}