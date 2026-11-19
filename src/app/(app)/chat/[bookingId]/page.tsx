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
  Info,
  Calendar,
} from "lucide-react";
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
  const [token, setToken] = useState<string>("");
  const [preflightWarning, setPreflightWarning] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Fetch current session & booking details
  useEffect(() => {
    // Get session
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUserId(data.user.id);
        }
      })
      .catch(() => {});

    // Get booking
    fetch(`/api/bookings/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.booking) {
          setBooking(data.booking);
        }
      })
      .catch(() => {});

    // Load initial messages via REST
    fetch(`/api/chat/${bookingId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.messages) {
          setMessages(data.messages);
        }
      })
      .catch(() => {});
  }, [bookingId]);

  // 2. Establish WebSocket connection with HTTPS & Vercel polling fallback
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;

    // Helper to poll REST endpoint
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

    // Determine target WebSocket URL dynamically
    const customWs = process.env.NEXT_PUBLIC_WS_URL;
    let wsUrl = "";
    if (customWs) {
      wsUrl = `${customWs}?bookingId=${bookingId}&token=demo_token_bypass_${currentUserId}`;
    } else {
      const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
      const protocol = isHttps ? "wss:" : "ws:";
      const port = isHttps ? "" : ":3001";
      wsUrl = `${protocol}//${window.location.hostname}${port}?bookingId=${bookingId}&token=demo_token_bypass_${currentUserId}`;
    }

    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("[WS Client] Connected to chat gateway for booking:", bookingId);
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
    } catch (e) {
      setIsConnected(false);
      pollingInterval = setInterval(pollMessages, 2500);
    }

    return () => {
      if (ws) ws.close();
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [bookingId, currentUserId]);

  // 3. Client-side Pre-Flight Contact Shielding Detection
  const handleInputChange = (text: string) => {
    setInputContent(text);
    if (!text.trim()) {
      setPreflightWarning(null);
      return;
    }

    const check = filterChatMessage(text);
    if (!check.isClean) {
      setPreflightWarning(
        `Contact Shield Active: Your message contains ${check.violationsDetected.join(", ")}. Any direct phone numbers, links, or payment handles will be automatically redacted before delivery.`
      );
    } else {
      setPreflightWarning(null);
    }
  };

  // 4. Send Message (via WebSocket or REST fallback)
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputContent).trim();
    if (!text) return;

    setInputContent("");
    setPreflightWarning(null);

    // Try WebSocket first
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "CHAT_MESSAGE",
          content: text,
          senderName: currentUserId === booking?.companionId ? booking?.companionName : "Member",
          senderRole: currentUserId === booking?.companionId ? "COMPANION" : "MEMBER",
        })
      );
    } else {
      // REST fallback
      try {
        const res = await fetch(`/api/chat/${bookingId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: text,
            senderName: currentUserId === booking?.companionId ? booking?.companionName : "Member",
            senderRole: currentUserId === booking?.companionId ? "COMPANION" : "MEMBER",
          }),
        });
        const data = await res.json();
        if (data.success && data.message) {
          setMessages((prev) => [...prev, data.message]);
        }
      } catch (err) {
        console.error("Failed to send message via REST fallback:", err);
      }
    }
  };

  const quickReplies = [
    "I have arrived at the cafe entrance",
    "Running about 5 minutes late due to traffic",
    "I'm seated at a table on the outdoor patio",
    "Wearing a dark blue shirt near the counter",
  ];

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-28 pt-4 px-2 sm:px-6">
      <div className="mx-auto flex h-[calc(100dvh-130px)] md:h-[calc(100vh-140px)] max-w-3xl flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900">
                  {booking?.companionName || "Companion"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                  <ShieldCheck className="h-3 w-3" />
                  Confirmed
                </span>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {booking?.venueName || "Public Cafe"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
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

          {/* Connection Status & PIN Pill */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                isConnected
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 text-emerald-600" />
                  <span>Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-amber-600" />
                  <span>REST</span>
                </>
              )}
            </div>

            <Link
              href={`/app/booking/${booking?.companionId || "c-qkk6qfv6"}/success?bookingId=${bookingId}`}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-800 transition"
            >
              <Lock className="h-3 w-3 text-slate-500" />
              <span>PIN: {booking?.verificationPin || "7492"}</span>
            </Link>
          </div>
        </div>

        {/* Safety & Contact Shielding Notice Strip */}
        <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/70 px-4 py-2 text-[11px] text-blue-900">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-700 shrink-0" />
            <span className="truncate">
              Contact Shield Active: Phone numbers and payment handles are automatically shielded for safety.
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[10px] uppercase font-bold text-blue-700 tracking-wider shrink-0">
            <Lock className="h-3 w-3" />
            <span>Monitored</span>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 space-y-3.5 overflow-y-auto p-4 bg-[#F8FAFC]">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            const isSystem = msg.senderRole === "SYSTEM";

            if (isSystem) {
              return (
                <div
                  key={msg.id}
                  className="mx-auto my-2 max-w-md rounded-full bg-slate-100 border border-slate-200/80 px-4 py-1 text-center text-[11px] font-medium text-slate-600"
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
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 mb-0.5 px-1">
                  <span>{msg.senderName}</span>
                  <span>•</span>
                  <span>
                    {new Date(msg.sentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    isMe
                      ? "bg-[#101828] text-white rounded-tr-sm"
                      : "bg-white text-slate-900 border border-slate-200/80 rounded-tl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Redaction Warning Indicator */}
                  {msg.isRedacted && (
                    <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-800">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span>Contact details redacted by safety shield.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Pills */}
        <div className="flex gap-1.5 overflow-x-auto border-t border-slate-100 bg-white px-3 py-2">
          {quickReplies.map((qr, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => handleSendMessage(qr)}
              className="whitespace-nowrap rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/60 px-3 py-1 text-[11px] font-medium text-slate-700 transition shrink-0"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Pre-Flight Shielding Warning Banner */}
        {preflightWarning && (
          <div className="flex items-center gap-2 border-t border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-medium text-amber-900 animate-in fade-in">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>{preflightWarning}</span>
          </div>
        )}

        {/* Input Form Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
        >
          <input
            type="text"
            placeholder="Coordinate public arrival, table location, or attire..."
            value={inputContent}
            onChange={(e) => handleInputChange(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
          />
          <button
            type="submit"
            disabled={!inputContent.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-[#101828] hover:bg-black px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
