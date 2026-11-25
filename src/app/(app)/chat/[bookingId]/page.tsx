"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Send,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  MapPin,
  Clock,
  Lock,
  ChevronLeft,
  Wifi,
  WifiOff,
  Coins,
  RotateCcw,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChatMessageRecord } from "@/lib/chat-store";
import { BookingRecord } from "@/lib/bookings";
import { filterChatMessage } from "@/lib/filters";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/auth-context";
import { CoinTopupModal } from "@/components/chat/coin-topup-modal";

interface UnlockInfo {
  id: string;
  tier: "TWENTY_FOUR_HOURS" | "FOREVER";
  status: "ACTIVE" | "HOST_RESPONDED" | "EXPIRED" | "REFUNDED_TIMEOUT";
  coinsDeducted: number;
  expiresAt: string | null;
  refundDeadline: string | null;
  firstHostReplyAt: string | null;
  isExpired: boolean;
}

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, refreshSession } = useAuth();
  const bookingId = String(params.bookingId || "");

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [unlockInfo, setUnlockInfo] = useState<UnlockInfo | null>(null);
  const [inputContent, setInputContent] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [preflightWarning, setPreflightWarning] = useState<string | null>(null);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState<boolean>(false);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatData = () => {
    fetch(`/api/chat/${bookingId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (Array.isArray(data.messages)) {
            setMessages(data.messages);
          }
          if (data.unlock) {
            setUnlockInfo(data.unlock);
          }
          if (data.booking) {
            setBooking(data.booking);
          }
        }
      })
      .catch((err) => console.error("Error fetching chat data:", err));
  };

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

    fetchChatData();
  }, [bookingId]);

  // 2. Establish WebSocket connection with REST polling fallback
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;

    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
    const protocol = isHttps ? "wss:" : "ws:";
    const port = isHttps ? "" : ":3001";
    const wsUrl = `${protocol}//${window.location.hostname}${port}?bookingId=${bookingId}&userId=${encodeURIComponent(currentUserId)}`;

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
          pollingInterval = setInterval(fetchChatData, 3000);
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
        if (!pollingInterval) {
          pollingInterval = setInterval(fetchChatData, 3000);
        }
      };
    } catch {
      pollingInterval = setInterval(fetchChatData, 3000);
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

    const viewerIsMember = booking ? currentUserId === booking.memberId : true;
    if (viewerIsMember && (user?.coinBalance ?? 0) < 10) {
      toast({
        title: "Recharge Coins to Continue",
        description: "Each message costs 10 coins. Top up with Razorpay to continue messaging.",
        variant: "destructive",
      });
      setIsTopupModalOpen(true);
      return;
    }

    if (booking?.status === "PENDING_ACCEPTANCE") {
      toast({
        title: "Waiting for Host Acceptance",
        description: "Messaging unlocks once your Host accepts this meetup request.",
        variant: "destructive",
      });
      return;
    }

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
        await refreshSession();
      } else if (data.insufficientCoins || res.status === 402) {
        setInputContent(rawMessage);
        await refreshSession();
        toast({
          title: "Out of Chat Coins",
          description: data.error || "Please recharge coins via Razorpay (10 coins per message).",
          variant: "destructive",
        });
        setIsTopupModalOpen(true);
      } else {
        setInputContent(rawMessage);
        toast({
          title: "Message Blocked",
          description: data.error || "Could not send message.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setInputContent(rawMessage);
      console.error("Failed to send message:", err);
    }
  };

  const isHostViewer = Boolean(booking && currentUserId && booking.companionUserId === currentUserId);
  const partnerDisplayName = booking
    ? isHostViewer
      ? booking.memberName
      : booking.companionName
    : "Meetup Chat";

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
                  {partnerDisplayName}
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
                      ? new Date(booking.scheduledDate).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          timeZone: "Asia/Kolkata",
                        })
                      : "Scheduled"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTopupModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border-2 border-ink bg-[#D4F7A5] px-2.5 py-1 text-xs font-black text-ink shadow-brutal-xs hover:bg-lime transition cursor-pointer"
                title="Recharge Chat Coins (1 Coin = ₹1)"
              >
                <Coins className="h-3.5 w-3.5" />
                <span>{user?.coinBalance ?? 0}</span>
                <span className="text-[10px] text-ink-muted underline font-black">+ Recharge</span>
              </button>
              <span
                className={`border-2 border-ink px-2.5 py-0.5 text-xs font-black uppercase ${
                  isConnected ? "bg-lime text-ink" : "bg-paper text-ink"
                }`}
              >
                {isConnected ? "Live Chat" : "Polling"}
              </span>
              {booking?.verificationPin && (
                <span className="border-2 border-ink bg-white px-2.5 py-0.5 text-xs font-black font-mono">
                  PIN: {booking.verificationPin}
                </span>
              )}
            </div>
          </div>

          {/* Meetup Acceptance & Coin Pricing Status Banner */}
          {booking?.status === "PENDING_ACCEPTANCE" ? (
            <div className="border-b-2 border-ink bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-900 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-amber-700 shrink-0" />
                <span>
                  {isHostViewer
                    ? `Accept ${booking.memberName}'s meetup request in Host Studio to unlock chat.`
                    : `Waiting for ${booking.companionName} to accept your meetup request before chat opens.`}
                </span>
              </div>
              <span className="text-[10px] uppercase font-black bg-amber-200 px-1.5 py-0.5 rounded border border-ink shrink-0">
                Pending Accept
              </span>
            </div>
          ) : booking ? (
            <div className="border-b-2 border-ink bg-[#D4F7A5]/50 px-4 py-2 text-xs font-bold text-ink flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>
                  {!isHostViewer
                    ? "Meetup Accepted · 10 Coins per sent message (uses your 100 bonus coins first)."
                    : "Meetup Accepted · Replies are unlocked and contact-shielded."}
                </span>
              </div>
              <span className="text-[10px] uppercase font-black bg-white px-1.5 py-0.5 rounded border border-ink shrink-0">
                Chat Open
              </span>
            </div>
          ) : null}

          {/* Safety Shield Banner */}
          <div className="border-b-2 border-ink bg-pink/20 px-4 py-1.5 text-xs font-bold text-ink flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-ink" />
              <span>Contact Shield Active: Phone numbers, social handles, and external payment links are masked.</span>
            </div>
            <span className="hidden sm:inline border border-ink bg-white px-2 py-0.2 text-[10px] font-black uppercase">
              100% Platonic
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-paper">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-xs font-bold text-ink/50">
                No messages yet. Send a greeting to coordinate your meetup.
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

          {/* Input Bar, Pending Lock, or Low Coin Razorpay Prompt */}
          {booking?.status === "PENDING_ACCEPTANCE" ? (
            <div className="border-t-3 border-ink bg-amber-50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <Lock className="h-4 w-4 text-amber-700 shrink-0" />
                <span>
                  Chat opens automatically as soon as <strong>{booking.companionName}</strong> accepts your meetup request.
                </span>
              </div>
              <button
                type="button"
                onClick={fetchChatData}
                className="border-2 border-ink bg-white px-4 py-2 text-xs font-black uppercase text-ink shadow-brutal-sm btn-press cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Refresh Status</span>
              </button>
            </div>
          ) : booking && currentUserId === booking.memberId && (user?.coinBalance ?? 0) < 10 ? (
            <div className="border-t-3 border-ink bg-[#FFF4F2] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <Coins className="h-4 w-4 text-rose-600 shrink-0" />
                <span>
                  Chat coin limit reached ({user?.coinBalance ?? 0} coins left). Each sent message requires 10 coins.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsTopupModalOpen(true)}
                className="border-2 border-ink bg-lime px-4 py-2 text-xs font-black uppercase text-ink shadow-brutal-sm btn-press cursor-pointer shrink-0"
              >
                Recharge Coins via Razorpay
              </button>
            </div>
          ) : (
            <>
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
                  placeholder={
                    booking && currentUserId === booking.memberId
                      ? "Type a message (10 coins per message)..."
                      : "Reply to your member..."
                  }
                  className="flex-1 border-2 border-ink bg-paper px-3 py-2 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputContent.trim()}
                  className="border-2 border-ink bg-ink px-4 sm:px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-brutal btn-press disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>
                    {booking && currentUserId === booking.memberId ? "Send (-10 Coins)" : "Send"}
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      <CoinTopupModal
        isOpen={isTopupModalOpen}
        onClose={() => setIsTopupModalOpen(false)}
        onSuccess={() => {
          refreshSession();
          fetchChatData();
        }}
      />

      <Footer />
    </div>
  );
}
