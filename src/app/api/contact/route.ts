import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ContactMessageInsert } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Save to Supabase
    const supabase = await createClient();
    const insertData: ContactMessageInsert = {
      name,
      email,
      subject: subject || null,
      message,
    };

    const { error } = await supabase
      .from("contact_messages")
      .insert(insertData as never);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
