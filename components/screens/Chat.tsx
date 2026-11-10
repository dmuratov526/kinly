"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarPlus, ChevronLeft, Phone, Send, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { helper } from "../data";
import { Avatar, Tap, Verified } from "../kit";
import { useStore } from "../store";

type Msg = { who: "you" | "them"; text: string; time: string };

/** Sunita already knows the family; everyone else starts with a hello. */
const SEED: Record<string, Msg[]> = {
  sunita: [
    { who: "them", text: "Hi Rohan! See you at 2 today. Anything special Kamala would like?", time: "11:02 AM" },
    { who: "you", text: "She's been asking about the park. And the rummy rematch 😄", time: "11:10 AM" },
    { who: "them", text: "Ha! Park and rummy it is. I'll bring some ginger biscuits too.", time: "11:12 AM" },
  ],
};

const QUICK = ["What time will you arrive?", "Can you pick up groceries on the way?", "She takes her tea without sugar", "Are you free next week?"];

function replyTo(text: string, first: string) {
  const t = text.toLowerCase();
  if (/time|arrive|when|late/.test(t)) return "I'll be there on time, and I'll text you the moment I leave. 🙂";
  if (/grocer|pick up|pharmacy|buy/.test(t)) return "Of course! Send me the list and I'll grab it on the way, receipt included.";
  if (/tea|sugar|food|eat|allerg/.test(t)) return "Noted, thank you for telling me. Little things like that matter.";
  if (/free|next week|available|book/.test(t)) return "I have Thursday at 2 PM open next week. Want me to hold it for you?";
  if (/price|cost|\$/.test(t)) return "Everything goes through Kinly, so the price you see in the app is what you pay.";
  return `Got it, thank you! — ${first}`;
}

export function Chat() {
  const { chatWith, back, toast, go, setDraft } = useStore();
  const h = helper(chatWith);
  const [msgs, setMsgs] = useState<Msg[]>(() => SEED[chatWith] ?? [
    { who: "them", text: `Hi! I'm ${h.first}. Happy to answer any questions before you book. 🙂`, time: "now" },
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing]);

  const send = (t: string) => {
    const v = t.trim();
    if (!v) return;
    setMsgs((m) => [...m, { who: "you", text: v, time: "now" }]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { who: "them", text: replyTo(v, h.first), time: "now" }]);
    }, 1500);
  };

  return (
    <div className="screen chat">
      <div className="chat-head">
        <Tap className="icon-btn" onClick={back} aria-label="Back"><ChevronLeft size={22} /></Tap>
        <Avatar src={h.photo} size={40} online={h.today} />
        <div className="grow">
          <b className="row" style={{ gap: 4 }}>{h.first} <Verified size={14} /></b>
          <span>{typing ? "typing…" : "Usually replies in ~5 min"}</span>
        </div>
        <Tap className="round-btn" onClick={() => toast(`Calling ${h.first}…`, "info")} aria-label="Call"><Phone size={18} /></Tap>
        <Tap className="round-btn" onClick={() => { setDraft({ helperId: h.id }); go("book"); }} aria-label="Book"><CalendarPlus size={18} /></Tap>
      </div>

      <div className="chat-body scroll">
        <div className="chat-safe"><ShieldCheck size={14} /> Chats stay on Kinly. Helpers never ask for payment by message.</div>
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div key={i} className={`bubble ${m.who === "you" ? "you" : ""}`} initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
              <p>{m.text}</p>
              <span>{m.who === "you" ? "You" : h.first} · {m.time}</span>
            </motion.div>
          ))}
          {typing && (
            <motion.div key="typing" className="bubble typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <i /><i /><i />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={end} />
      </div>

      <div className="chat-foot">
        <div className="chat-quick">
          {QUICK.map((q) => <Tap key={q} className="chip" onClick={() => send(q)}>{q}</Tap>)}
        </div>
        <div className="composer">
          <input placeholder={`Message ${h.first}…`} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(text)} />
          <Tap className="send" onClick={() => send(text)} aria-label="Send"><Send size={17} /></Tap>
        </div>
      </div>
    </div>
  );
}
