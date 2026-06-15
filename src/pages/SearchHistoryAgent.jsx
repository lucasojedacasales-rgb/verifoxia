import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Loader2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageBubble from "@/components/MessageBubble";

const SUGGESTIONS = [
  "¿Qué productos he buscado recientemente?",
  "Muéstrame búsquedas con veredicto 'comprar'",
  "¿Cuántas búsquedas tengo guardadas?",
  "Busca en mi historial 'iPhone'",
];

export default function SearchHistoryAgent() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [ready, setReady] = useState(false);
  const bottomRef = useRef(null);
  const unsubRef = useRef(null);

  useEffect(() => {
    initConversation();
    return () => unsubRef.current?.();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: "search_history_assistant",
      metadata: { name: "Asistente de historial" }
    });
    setConversation(conv);
    unsubRef.current = base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages || []);
    });
    setReady(true);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || !conversation || sending) return;
    setInput("");
    setSending(true);
    await base44.agents.addMessage(conversation, { role: "user", content: text });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isAgentTyping = messages.length > 0 && messages[messages.length - 1]?.role === "user";

  return (
    <div className="flex flex-col h-screen bg-slate-950">
      {/* Header */}
      <div className="shrink-0 bg-slate-900 border-b border-white/10 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <History className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-base">Asistente de Historial</h1>
            <p className="text-slate-400 text-xs">Busca y recupera tus búsquedas pasadas</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && ready && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center gap-3 py-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <History className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Tu asistente de historial</p>
                  <p className="text-slate-400 text-sm mt-1">Pregúntame sobre tus búsquedas anteriores</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left px-4 py-3 bg-slate-800/60 hover:bg-slate-800 border border-white/10 rounded-xl text-slate-300 text-sm transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {isAgentTyping && (
            <div className="flex gap-3">
              <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center mt-0.5 shrink-0">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              </div>
              <div className="bg-slate-800 border border-white/10 rounded-2xl px-4 py-2.5">
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 bg-slate-900 border-t border-white/10 px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Pregunta sobre tu historial de búsquedas..."
            rows={1}
            className="flex-1 resize-none bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px] max-h-32"
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || sending || !conversation}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 min-h-[44px]"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}