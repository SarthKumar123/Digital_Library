import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import "./ChatBot.css";

/**
 * FAQ_RULES: each entry has a list of keywords to look for in the
 * user's message (case-insensitive), and the canned answer to give
 * if any of them match. This is checked top to bottom -- the first
 * rule that matches wins. No AI, no API calls -- just simple string
 * matching, which is why this needs no API key at all.
 */
const FAQ_RULES = [
  {
    keywords: ["borrow", "how do i get a book", "checkout", "check out"],
    answer:
      "To borrow a book: open its detail page and click \"Borrow Book\". You'll need to be logged in first. Books are borrowed for 14 days by default.",
  },
  {
    keywords: ["return", "give back"],
    answer:
      "To return a book, go to My Books and click \"Return Book\" next to the title. If it's overdue, you'll see the late fine before confirming the return.",
  },
  {
    keywords: ["fine", "fee", "late", "penalty"],
    answer:
      "Late fines are ₹10 per day after the due date. You can view and pay any outstanding fines on the Fines page.",
  },
  {
    keywords: ["login", "log in", "sign in"],
    answer:
      "Click the Login button in the top-right corner. You can log in with your email and password, or use \"Continue with Google\".",
  },
  {
    keywords: ["signup", "sign up", "register", "create account", "new account"],
    answer:
      "Click Login, then \"Sign up\" at the bottom of the form. You'll need a name, email, and password.",
  },
  {
    keywords: ["google", "oauth"],
    answer:
      "Yes! Click Login, then \"Continue with Google\" to sign in instantly with your Google account.",
  },
  {
    keywords: ["password", "forgot"],
    answer:
      "Password reset isn't available in this demo yet — for now, please sign up again with a different email if you're testing.",
  },
  {
    keywords: ["hour", "open", "timing", "close"],
    answer: "This is a digital library, so it's open 24/7 — borrow and read anytime!",
  },
  {
    keywords: ["contact", "support", "help desk", "email address"],
    answer: "You can reach support at support@digitallibrary.com or +91 98765 43210.",
  },
  {
    keywords: ["search", "find a book", "find book"],
    answer:
      "Use the search bar at the top of the Home or Books page — you can search by title, author, category, or ISBN.",
  },
  {
    keywords: ["category", "categories", "genre"],
    answer:
      "Browse by category on the Books page — filters include Self Help, Fiction, Productivity, Personal Development, Finance, and more.",
  },
  {
    keywords: ["profile", "my account", "edit name", "phone number"],
    answer: "Go to the Profile page from the top nav to view and edit your name, phone, and address.",
  },
  {
    keywords: ["history", "past books", "what did i borrow"],
    answer: "Check Borrow History in the top nav to see every book you've borrowed, past and present.",
  },
  {
    keywords: ["hi", "hello", "hey"],
    answer: "Hi there! 👋 Ask me about borrowing, returning, fines, or logging in.",
  },
  {
    keywords: ["thank", "thanks"],
    answer: "You're welcome! Happy reading 📚",
  },
];

const FALLBACK_ANSWER =
  "I'm not sure about that one. Try asking about borrowing, returning, fines, login, or search — or contact support@digitallibrary.com for anything else.";

const QUICK_REPLIES = ["How do I borrow a book?", "What are the late fines?", "How do I return a book?"];

/**
 * Scans the user's message for any matching keyword across all
 * rules. Simple, predictable, and needs zero external services.
 */
function getBotReply(userText) {
  const text = userText.toLowerCase();
  for (const rule of FAQ_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.answer;
    }
  }
  return FALLBACK_ANSWER;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm the Library Assistant. Ask me about borrowing, returns, fines, or your account." },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = { from: "user", text: trimmed };
    const botMsg = { from: "bot", text: getBotReply(trimmed) };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <Bot size={16} />
              </div>
              <div>
                <div className="chatbot-title">Library Assistant</div>
                <div className="chatbot-subtitle">Usually replies instantly</div>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg-row ${m.from}`}>
                <div className="chatbot-msg-icon">
                  {m.from === "bot" ? <Bot size={13} /> : <User size={13} />}
                </div>
                <div className={`chatbot-bubble ${m.from}`}>{m.text}</div>
              </div>
            ))}
          </div>

          {messages.length === 1 && (
            <div className="chatbot-quick-replies">
              {QUICK_REPLIES.map((q) => (
                <button key={q} onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <form className="chatbot-input-row" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question…"
            />
            <button type="submit" aria-label="Send">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        className="chatbot-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}
