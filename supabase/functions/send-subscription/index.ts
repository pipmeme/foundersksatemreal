import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase config missing");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { email, name, message, type = "subscription" } = await req.json();

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitizedEmail = email.trim().slice(0, 255);
    const sanitizedName = name ? String(name).trim().slice(0, 100) : null;
    const sanitizedMessage = message ? String(message).trim().slice(0, 2000) : null;
    const submissionType = type === "contact" ? "contact" : "subscription";

    // Save to database
    const { error: dbError } = await supabase.from("submissions").insert({
      email: sanitizedEmail,
      name: sanitizedName,
      message: sanitizedMessage,
      type: submissionType,
    });
    if (dbError) console.error("DB insert error:", dbError);

    // Build email content
    const isContact = submissionType === "contact";
    const subject = isContact
      ? `New Contact: ${sanitizedName || sanitizedEmail}`
      : `New Subscriber: ${sanitizedEmail}`;
    const html = isContact
      ? `<h2>New Contact Form Submission</h2>
         <p><strong>Name:</strong> ${sanitizedName}</p>
         <p><strong>Email:</strong> ${sanitizedEmail}</p>
         <p><strong>Message:</strong></p>
         <p>${sanitizedMessage}</p>
         <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>`
      : `<h2>New Newsletter Subscription</h2>
         <p><strong>Email:</strong> ${sanitizedEmail}</p>
         <p><strong>Subscribed at:</strong> ${new Date().toISOString()}</p>
         <p><strong>Source:</strong> foundersksa.com homepage</p>`;

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Founders KSA <onboarding@resend.dev>",
        to: ["ramplywork@gmail.com"],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Resend API failed [${res.status}]: ${errorData}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
