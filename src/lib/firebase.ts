import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export function isFirebaseConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();

  if (!apiKey || !projectId) return false;
  if (apiKey.includes("placeholder") || projectId.includes("placeholder")) return false;
  return true;
}

export function getFirebaseApp() {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

/**
 * Initializes or refreshes an invisible RecaptchaVerifier on the specified container DOM element ID
 */
export function initRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  const auth = getFirebaseAuth();

  if (typeof window !== "undefined") {
    const key = `__recaptcha_${containerId}`;
    const existing = (window as any)[key];
    if (existing) {
      try {
        existing.clear();
      } catch (err) {
        // ignore
      }
      (window as any)[key] = null;
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {
        console.log("[FIREBASE RECAPTCHA] Verified successfully");
      },
      "expired-callback": () => {
        console.warn("[FIREBASE RECAPTCHA] Expired, needs refresh");
      },
    });

    (window as any)[key] = verifier;
    return verifier;
  }

  return new RecaptchaVerifier(auth, containerId, { size: "invisible" });
}

/**
 * Converts Firebase error codes into clear, actionable user messages
 */
export function formatFirebasePhoneError(error: any): string {
  const code = error?.code || "";
  const message = error?.message || "";

  if (code === "auth/operation-not-allowed" || message.toLowerCase().includes("region")) {
    return "India (+91) SMS region is not enabled in Firebase Console. Go to Firebase Console -> Authentication -> Settings -> SMS region policy to allow India (+91), or configure test numbers under Sign-in method -> Phone.";
  }
  if (code === "auth/unauthorized-domain") {
    const host = typeof window !== "undefined" ? window.location.hostname : "companio-eight.vercel.app";
    return `Domain unauthorized: Please add "${host}" to Firebase Console -> Authentication -> Settings -> Authorized domains.`;
  }
  if (code === "auth/quota-exceeded" || message.toLowerCase().includes("quota")) {
    return "SMS daily quota reached on Firebase Spark plan (10 SMS/day limit). Please upgrade to Blaze plan or configure test numbers in Firebase Console.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many OTP requests sent to this number. Please wait a few minutes before trying again.";
  }
  if (code === "auth/invalid-phone-number") {
    return "Invalid mobile number format. Please provide a valid 10-digit Indian phone number.";
  }
  if (code === "auth/captcha-check-failed") {
    return "reCAPTCHA check failed. Please refresh the page and try again.";
  }
  if (code === "auth/billing-not-enabled") {
    return "Firebase SMS billing is not enabled for this region. Please link billing in Firebase Console.";
  }
  if (code === "auth/network-request-failed") {
    return "Network error connecting to Firebase. Please check your internet connection and try again.";
  }

  return message || "Failed to dispatch real SMS OTP. Please try again.";
}
