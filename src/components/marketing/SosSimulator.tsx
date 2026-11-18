"use client";

import React, { useState } from "react";
import { AlertTriangle, MapPin, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";

export function SosSimulator() {
  const [status, setStatus] = useState<"idle" | "requesting" | "active">("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleTrigger = () => {
    setStatus("requesting");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: Number(position.coords.latitude.toFixed(4)),
            lng: Number(position.coords.longitude.toFixed(4)),
          });
          setStatus("active");
        },
        () => {
          // Fallback simulation (e.g. Connaught Place, New Delhi)
          setCoords({ lat: 28.6304, lng: 77.2177 });
          setStatus("active");
        },
        { timeout: 5000 }
      );
    } else {
      setCoords({ lat: 28.6304, lng: 77.2177 });
      setStatus("active");
    }
  };

  return (
    <div className="rounded-2xl border border-red-900/40 bg-[#160D0D] p-6 text-white sm:p-8">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-red-600/20 p-2 border border-red-500/40">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-white">
            Emergency SOS & Live Geolocation Simulator
          </h3>
          <p className="text-xs text-red-300/80">
            Available on all active booking screens for both companions and members.
          </p>
        </div>
      </div>

      <div className="mt-6">
        {status === "idle" && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-red-900/30 bg-[#200F0F] p-5">
            <p className="text-xs text-[#A1A1A6] max-w-md">
              Test how the emergency protocol works. In a live booking, tapping SOS broadcasts GPS to our 24/7 team and initiates a one-tap 112 emergency call.
            </p>
            <button
              onClick={handleTrigger}
              className="rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition shadow-lg shadow-red-600/30 whitespace-nowrap"
            >
              Test SOS Simulator
            </button>
          </div>
        )}

        {status === "requesting" && (
          <div className="rounded-xl border border-red-900/40 bg-[#200F0F] p-5 text-center text-xs text-red-300">
            Acquiring device GPS coordinates via HTML5 Geolocation...
          </div>
        )}

        {status === "active" && coords && (
          <div className="rounded-xl border border-green-900/40 bg-[#0F1E14] p-5 text-xs">
            <div className="flex items-center gap-2 font-bold text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Safety Alert Broadcast Successfully Dispatched</span>
            </div>
            <div className="mt-2 text-[#8E8E93]">
              <div>Target Coordinates: Lat {coords.lat}, Lng {coords.lng}</div>
              <div>Dispatch Target: Companio 24/7 Rapid Response Desk</div>
              <div>Escrow Status: <span className="text-amber-400 font-semibold">FROZEN PENDING SAFETY REVIEW</span></div>
            </div>
            <div className="mt-4 flex gap-3">
              <a
                href="tel:112"
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700 transition"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Dial 112 Emergency</span>
              </a>
              <button
                onClick={() => setStatus("idle")}
                className="rounded-full border border-gray-700 px-4 py-2 font-semibold text-gray-300 hover:text-white"
              >
                Reset Simulator
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
