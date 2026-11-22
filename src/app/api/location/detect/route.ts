import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface CityMapping {
  slug: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  defaultArea: string;
}

const CITY_COORDINATES: CityMapping[] = [
  { slug: "mohali", name: "Mohali", state: "Punjab", lat: 30.6942, lng: 76.7179, defaultArea: "Phase 7" },
  { slug: "chandigarh", name: "Chandigarh", state: "Punjab/Haryana", lat: 30.7333, lng: 76.7794, defaultArea: "Sector 17" },
  { slug: "delhi", name: "Delhi NCR", state: "Delhi", lat: 28.6139, lng: 77.2090, defaultArea: "Connaught Place" },
  { slug: "bengaluru", name: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946, defaultArea: "Indiranagar" },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777, defaultArea: "Bandra West" },
  { slug: "pune", name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, defaultArea: "Koregaon Park" },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867, defaultArea: "Jubilee Hills" },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, defaultArea: "C-Scheme" },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, defaultArea: "Park Street" },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, defaultArea: "Adyar" },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, defaultArea: "Bodakdev" },
];

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function matchCityAlias(text: string): CityMapping | null {
  const lower = text.toLowerCase();
  if (lower.includes("mohali") || lower.includes("sas nagar") || lower.includes("sahibzada ajit singh")) {
    return CITY_COORDINATES.find((c) => c.slug === "mohali") || null;
  }
  if (lower.includes("chandigarh") || lower.includes("panchkula") || lower.includes("kharar") || lower.includes("zirakpur")) {
    // If explicitly closer to Mohali, return Mohali
    if (lower.includes("mohali") || lower.includes("kharar")) {
      return CITY_COORDINATES.find((c) => c.slug === "mohali") || null;
    }
    return CITY_COORDINATES.find((c) => c.slug === "chandigarh") || null;
  }
  if (
    lower.includes("delhi") ||
    lower.includes("gurgaon") ||
    lower.includes("gurugram") ||
    lower.includes("noida") ||
    lower.includes("faridabad") ||
    lower.includes("ghaziabad")
  ) {
    return CITY_COORDINATES.find((c) => c.slug === "delhi") || null;
  }
  if (lower.includes("bengaluru") || lower.includes("bangalore")) {
    return CITY_COORDINATES.find((c) => c.slug === "bengaluru") || null;
  }
  if (lower.includes("mumbai") || lower.includes("thane") || lower.includes("navi mumbai")) {
    return CITY_COORDINATES.find((c) => c.slug === "mumbai") || null;
  }
  if (lower.includes("pune") || lower.includes("pimpri")) {
    return CITY_COORDINATES.find((c) => c.slug === "pune") || null;
  }
  if (lower.includes("hyderabad") || lower.includes("secunderabad")) {
    return CITY_COORDINATES.find((c) => c.slug === "hyderabad") || null;
  }
  if (lower.includes("jaipur")) {
    return CITY_COORDINATES.find((c) => c.slug === "jaipur") || null;
  }
  if (lower.includes("kolkata") || lower.includes("howrah")) {
    return CITY_COORDINATES.find((c) => c.slug === "kolkata") || null;
  }
  if (lower.includes("chennai") || lower.includes("madras")) {
    return CITY_COORDINATES.find((c) => c.slug === "chennai") || null;
  }
  if (lower.includes("ahmedabad")) {
    return CITY_COORDINATES.find((c) => c.slug === "ahmedabad") || null;
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");

    if (!latStr || !lngStr) {
      return NextResponse.json(
        { success: false, error: "Latitude and longitude required" },
        { status: 400 }
      );
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { success: false, error: "Invalid coordinates format" },
        { status: 400 }
      );
    }

    let detectedCitySlug = "chandigarh";
    let detectedCityName = "Chandigarh";
    let detectedState = "Punjab/Haryana";
    let detectedArea = "Sector 17";

    // 1. Attempt OpenStreetMap Nominatim reverse geocoding
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        {
          headers: {
            "User-Agent": "MeetzyClub/1.0 (contact@meetzy.club)",
            Accept: "application/json",
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (geoRes.ok) {
        const geoData = await geoRes.json();
        const address = geoData.address || {};
        const rawCity =
          address.city ||
          address.town ||
          address.city_district ||
          address.county ||
          address.state_district ||
          "";

        const matchedCity =
          matchCityAlias(rawCity) ||
          matchCityAlias(address.state || "") ||
          matchCityAlias(geoData.display_name || "");

        if (matchedCity) {
          detectedCitySlug = matchedCity.slug;
          detectedCityName = matchedCity.name;
          detectedState = matchedCity.state;
        }

        detectedArea =
          address.suburb ||
          address.neighbourhood ||
          address.residential ||
          address.road ||
          address.quarter ||
          "";
      }
    } catch {
      // Nominatim timed out or failed; will use coordinate distance fallback
    }

    // 2. Coordinate Distance Fallback (Find closest mapped city)
    if (!detectedArea) {
      let closest = CITY_COORDINATES[0];
      let minDistance = getDistanceKm(lat, lng, closest.lat, closest.lng);

      for (let i = 1; i < CITY_COORDINATES.length; i++) {
        const dist = getDistanceKm(lat, lng, CITY_COORDINATES[i].lat, CITY_COORDINATES[i].lng);
        if (dist < minDistance) {
          minDistance = dist;
          closest = CITY_COORDINATES[i];
        }
      }

      detectedCitySlug = closest.slug;
      detectedCityName = closest.name;
      detectedState = closest.state;
      detectedArea = closest.defaultArea;
    }

    return NextResponse.json({
      success: true,
      city: detectedCitySlug,
      cityName: detectedCityName,
      state: detectedState,
      area: detectedArea,
    });
  } catch (error) {
    console.error("[LOCATION DETECT ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to detect live location" },
      { status: 500 }
    );
  }
}
