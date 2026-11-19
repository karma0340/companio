"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Send,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Clock,
  Lock,
  ChevronLeft,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChatMessageRecord } from "@/lib/chat-store";
import { BookingRecord } from "@/lib/bookings";
import { filterChatMessage } from "@/lib/filters";

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = String(params.bookingId || "bkg_seed_01");

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [inputContent, setInputContent] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>("user_member_demo");
  const [preflightWarning, setPreflightWarning] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Fetch current session & booking details
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUserId(data.user.id);
        }
      })
      .catch(() => {});

    fetch(`/api/bookings/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.booking) {
          setBooking(data.booking);
        }
      })
      .catch(() => {});

    fetch(`/api/chat/${bookingId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.messages) {
          setMessages(data.messages);
        }
      })
      .catch(() => {});
  }, [bookingId]);

  // 2. Establish WebSocket connection with REST polling fallback
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;

    const pollMessages = () => {
      fetch(`/api/chat/${bookingId}/messages`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.messages)) {
            setMessages((prev) => {
              if (data.messages.length !== prev.length) {
                return data.messages;
              }
              return prev;
            });
          }
        })
        .catch(() => {});
    };

    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
    const protocol = isHttps ? "wss:" : "ws:";
    const port = isHttps ? "" : ":3001";
    const wsUrl = `${protocol}//${window.location.hostname}${port}?bookingId=${bookingId}&token=demo_token_bypass_${currentUserId}`;

    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "HISTORY_PAYLOAD" && Array.isArray(payload.messages)) {
            setMessages(payload.messages);
          } else if (payload.type === "MESSAGE_RECEIVED" && payload.message) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.message.id)) {
                return prev;
              }
              return [...prev, payload.message];
            });
          }
        } catch (err) {
          console.error("[WS Client] Error parsing packet:", err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (!pollingInterval) {
          pollingInterval = setInterval(pollMessages, 2500);
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
        if (!pollingInterval) {
          pollingInterval = setInterval(pollMessages, 2500);
        }
      };
    } catch {
      pollingInterval = setInterval(pollMessages, 2500);
    }

    return () => {
      if (ws) ws.close();
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [bookingId, currentUserId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputContent(text);

    if (text.trim().length > 3) {
      const audit = filterChatMessage(text);
      if (!audit.isClean) {
        setPreflightWarning(
          `Safety Shield: Your message contains off-platform contact info (${audit.violationsDetected.join(", ")}). It will be masked.`
        );
      } else {
        setPreflightWarning(null);
      }
    } else {
      setPreflightWarning(null);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    const rawMessage = inputContent.trim();
    setInputContent("");
    setPreflightWarning(null);

    try {
      const res = await fetch(`/api/chat/${bookingId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: rawMessage }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        {/* Chat Box Container */}
        <div className="border-3 border-ink shadow-brutal bg-white flex flex-col h-[75vh]">
          {/* Header */}
          <div className="border-b-3 border-ink bg-sunny p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/bookings"
                className="border-2 border-ink bg-white p-1 hover:bg-black/5"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-base font-black uppercase text-ink">
                  {booking?.companionName || "Companion Host"}
                </h1>
                <div className="flex items-center gap-2 text-xs font-bold text-ink/70">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {booking?.venueName || "Public Cafe"}
                  </span>
                  <span>-</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {booking?.scheduledDate
                      ? new Date(booking.scheduledDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "04:00 PM"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`border-2 border-ink px-2.5 py-0.5 text-xs font-black uppercase ${
                  isConnected ? "bg-lime text-ink" : "bg-paper text-ink"
                }`}
              >
                {isConnected ? "Live Chat" : "Polling"}
              </span>
              <span className="border-2 border-ink bg-white px-2.5 py-0.5 text-xs font-black font-mono">
                PIN: {booking?.verificationPin || "7492"}
              </span>
            </div>
          </div>

          {/* Safety Shield Banner */}
          <div className="border-b-2 border-ink bg-pink/20 px-4 py-2 text-xs font-bold text-ink flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>Contact Shield Active: Phone numbers and payment handles are automatically masked.</span>
            </div>
            <span className="hidden sm:inline border border-ink bg-white px-2 py-0.2 text-[10px] font-black uppercase">
              Monitored
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-paper">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-xs font-bold text-ink/50">
                No messages yet. Send a greeting to coordinate your arrival at the venue.
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                const isSystem = msg.senderRole === "SYSTEM";

                if (isSystem) {
                  return (
                    <div
                      key={msg.id}
                      className="mx-auto my-2 max-w-md border-2 border-ink bg-white px-3 py-1 text-center text-xs font-bold text-ink"
                    >
                      {msg.content}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="text-[10px] font-black uppercase text-ink/60 mb-1 px-1">
                      {msg.senderName} - {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div
                      className={`max-w-[80%] border-2 border-ink p-3 text-xs font-bold ${
                        isMe
                          ? "bg-sunny text-ink shadow-brutal"
                          : "bg-white text-ink shadow-brutal"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          {preflightWarning && (
            <div className="border-t-2 border-ink bg-danger/10 px-4 py-1.5 text-xs font-bold text-danger">
              {preflightWarning}
            </div>
          )}

          <form
            onSubmit={handleSendMessage}
            className="border-t-3 border-ink bg-white p-3 flex gap-2"
          >
            <input
              type="text"
              value={inputContent}
              onChange={handleInputChange}
              placeholder="Type a message to your companion..."
              className="flex-1 border-2 border-ink bg-paper px-3 py-2 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputContent.trim()}
              className="border-2 border-ink bg-ink px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-brutal btn-press disabled:opacity-40 flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
