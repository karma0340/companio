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
      // Fallback to REST API
      try {
        const res = await fetch(`/api/chat/${bookingId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: text,
            senderId: currentUserId,
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
    <div className="mx-auto flex h-[calc(100dvh-130px)] md:h-[calc(100vh-140px)] max-w-4xl flex-col rounded-xl border-2 border-[#102A43] bg-white shadow-[4px_4px_0px_0px_#102A43]">
      {/* Top Header Bar */}
      <div className="flex flex-col justify-between gap-3 border-b-2 border-[#102A43] bg-[#FFF9E6] p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/app/dashboard"
            className="rounded-md border-2 border-[#102A43] bg-white p-1 text-[#102A43] hover:bg-[#F0EDE6]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-[#102A43]">
                {booking?.companionName || "Vanshika Sharma"}
              </h1>
              <span className="rounded bg-[#E9FF70] border border-[#102A43] px-2 py-0.2 text-[10px] font-black uppercase text-[#102A43]">
                CONFIRMED SESSION
              </span>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs font-bold text-[#486581]">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-[#102A43]" />
                {booking?.venueName || "Blue Tokai Coffee"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#102A43]" />
                {booking?.scheduledDate ? new Date(booking.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "04:00 PM"}
              </span>
            </div>
          </div>
        </div>

        {/* WebSocket Connection Status Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-full border border-[#102A43] px-2.5 py-1 text-[10px] font-black uppercase ${
              isConnected
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3 text-green-600" />
                <span>Live Gateway</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-yellow-600" />
                <span>REST Mode</span>
              </>
            )}
          </div>

          <Link
            href={`/app/booking/${booking?.companionId || "comp_01"}/success?bookingId=${bookingId}`}
            className="rounded-lg border-2 border-[#102A43] bg-[#70D6FF] px-3 py-1 text-xs font-black text-[#102A43] shadow-[2px_2px_0px_0px_#102A43] hover:bg-[#5BC5F2]"
          >
            View PIN
          </Link>
        </div>
      </div>

      {/* Safety & Contact Shielding Notice Strip */}
      <div className="flex items-center justify-between border-b-2 border-[#102A43] bg-[#70D6FF]/20 px-4 py-2 text-[11px] font-bold text-[#102A43]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-green-700" />
          <span>Contact Shielding Active: Phone numbers, external chat links, and UPI IDs are automatically shielded.</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[10px] uppercase text-[#627D98]">
          <Lock className="h-3 w-3" />
          <span>End-to-End Monitored</span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 bg-[#FFFDF9]">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          const isSystem = msg.senderRole === "SYSTEM";

          if (isSystem) {
            return (
              <div
                key={msg.id}
                className="mx-auto my-3 max-w-lg rounded-xl border-2 border-[#102A43] bg-[#FFF9E6] p-3 text-center text-xs font-bold text-[#102A43] shadow-[2px_2px_0px_0px_#102A43]"
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase text-[#627D98] mb-1">
                  <Info className="h-3 w-3" />
                  <span>Platform Protocol Notice</span>
                </div>
                {msg.content}
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#627D98] mb-0.5 px-1">
                <span>{msg.senderName}</span>
                <span>•</span>
                <span>{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div
                className={`max-w-[80%] rounded-xl border-2 border-[#102A43] p-3.5 text-xs font-bold shadow-[3px_3px_0px_0px_#102A43] ${
                  isMe
                    ? "bg-[#E9FF70] text-[#102A43]"
                    : "bg-white text-[#102A43]"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                {/* Redaction Warning Indicator */}
                {msg.isRedacted && (
                  <div className="mt-2.5 flex items-center gap-1.5 rounded border border-red-400 bg-red-100 px-2 py-1 text-[10px] font-black text-red-800">
                    <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                    <span>Safety Notice: Content redacted by automated contact shield.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Pills */}
      <div className="flex gap-1.5 overflow-x-auto border-t-2 border-[#102A43] bg-white px-4 py-2">
        {quickReplies.map((qr, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qr)}
            className="whitespace-nowrap rounded-full border border-[#102A43] bg-[#F0EDE6] px-3 py-1 text-[11px] font-bold text-[#102A43] hover:bg-[#E9FF70] transition"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Pre-Flight Shielding Warning Banner (Appears as user types) */}
      {preflightWarning && (
        <div className="flex items-center gap-2 border-t border-yellow-400 bg-yellow-50 px-4 py-2 text-[11px] font-bold text-yellow-900 animate-in fade-in">
          <AlertTriangle className="h-3.5 w-3.5 text-yellow-700 flex-shrink-0" />
          <span>{preflightWarning}</span>
        </div>
      )}

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 border-t-2 border-[#102A43] bg-[#FFF9E6] p-3"
      >
        <input
          type="text"
          placeholder="Coordinate public arrival, table location, or attire..."
          value={inputContent}
          onChange={(e) => handleInputChange(e.target.value)}
          className="flex-1 rounded-xl border-2 border-[#102A43] bg-white px-4 py-2.5 text-xs font-bold text-[#102A43] placeholder-[#9FB3C8] outline-none"
        />
        <button
          type="submit"
          disabled={!inputContent.trim()}
          className="flex items-center gap-1.5 rounded-xl border-2 border-[#102A43] bg-[#FF7AC6] px-5 py-2.5 text-xs font-black uppercase text-[#102A43] shadow-[2px_2px_0px_0px_#102A43] hover:bg-[#FF60B7] disabled:opacity-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
