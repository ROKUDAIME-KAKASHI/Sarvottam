"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Send, Sparkles, Loader2, Bot, User, HelpCircle } from "lucide-react";

interface AIStudioTerminalProps {
  userRole: string;
  userName: string;
}

const PRESET_QUERIES = [
  "Calculate and interpret Cp and Cpk for manufacturing yield",
  "How can students qualify for fast-track IFQM industry placement?",
  "Explain the 5 phases of DMAIC in quality management",
  "What criteria define institutional excellence under NAAC & NIRF?",
];

export function AIStudioTerminal({ userRole, userName }: AIStudioTerminalProps) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: `**Sarvottam AI Intelligence Node Active**\n\nGreetings **${userName}** (${userRole}). How can I assist you today? You can inquire about Six Sigma metrics, project matching protocols, placement criteria, or institutional quality governance.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMsg = queryText.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMsg }],
          userContext: { name: userName, role: userRole },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Telemetry returned no response. Please try rephrasing your inquiry.",
          },
        ]);
      }
    } catch (error) {
      console.error("AI Terminal query error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Node communication error. Please verify network access.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <Card className="border-primary/30 bg-card shadow-sm overflow-hidden">
      <CardHeader className="bg-primary/[0.03] border-b border-border/60 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Interactive Copilot Terminal</CardTitle>
              <CardDescription className="text-xs">
                Real-time quality engineering & academic-industry reasoning
              </CardDescription>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
            NODE LIVE
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Preset query chips */}
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-border/40">
          <span className="text-[11px] font-medium text-muted-foreground self-center mr-1">
            Suggested Prompts:
          </span>
          {PRESET_QUERIES.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendMessage(q)}
              disabled={loading}
              className="text-xs px-2.5 py-1 rounded-md border border-border/80 bg-muted/30 hover:bg-primary/10 hover:border-primary/40 text-foreground transition-all text-left cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 text-xs md:text-sm ${
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground border border-border"
                }`}
              >
                {m.role === "user" ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>
              <div
                className={`rounded-xl px-4 py-2.5 max-w-[85%] whitespace-pre-line leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 border border-border/70 text-foreground"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Analyzing ecosystem knowledge graph...</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-muted/20 border-t border-border/50">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask anything about quality frameworks, research matching, or placements...`}
            disabled={loading}
            className="h-10 text-xs md:text-sm rounded-lg bg-background"
          />
          <Button type="submit" disabled={loading || !input.trim()} className="h-10 px-4 shrink-0">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
