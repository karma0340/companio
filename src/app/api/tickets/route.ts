import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { TicketCategory } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    const rawCategory = String(body.category || "GENERAL_HELP").toUpperCase();
    let category: TicketCategory = "GENERAL_HELP";

    if (rawCategory.includes("SAFETY")) category = "SAFETY_INCIDENT";
    else if (rawCategory.includes("PAYMENT") || rawCategory.includes("ESCROW")) category = "PAYMENT_ISSUE";
    else if (rawCategory.includes("TECHNICAL")) category = "TECHNICAL_FAILURE";
    else if (rawCategory.includes("VERIFICATION") || rawCategory.includes("KYC")) category = "GENERAL_HELP";

    const name = String(body.name || "User").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();

    if (!message || message.length < 5) {
      return NextResponse.json(
        { success: false, error: "Please enter your message or inquiry (at least 5 characters)." },
        { status: 400 }
      );
    }

    const subject = `${category.replace(/_/g, " ")}: ${name} (${phone || email || "Guest"})`;
    const fullDescription = `Contact Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nInquiry Details:\n${message}`;

    const ticket = await prisma.grievanceTicket.create({
      data: {
        userId: session?.userId || null,
        category,
        subject,
        description: fullDescription,
        status: "OPEN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Grievance ticket registered successfully. Our operations team will respond within 24 hours.",
      ticketId: ticket.id,
      referenceCode: `TIC-${ticket.id.slice(-6).toUpperCase()}`,
    });
  } catch (error) {
    console.error("[CREATE GRIEVANCE TICKET ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch ticket. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, tickets: [] }, { status: 401 });
    }

    const tickets = await prisma.grievanceTicket.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tickets" }, { status: 500 });
  }
}
