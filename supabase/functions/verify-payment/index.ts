import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Razorpay from "npm:razorpay";
import crypto from "crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    const { paymentId, orderId, signature } = await req.json();

    // Verify signature
    const text = orderId + "|" + paymentId;
    const generated_signature = crypto
      .createHmac("sha256", Deno.env.get("RAZORPAY_KEY_SECRET"))
      .update(text)
      .digest("hex");

    if (generated_signature !== signature) {
      throw new Error("Invalid signature");
    }

    // Update payment status in database
    const { error: dbError } = await supabase
      .from("payments")
      .update({
        status: "completed",
        razorpay_payment_id: paymentId,
        updated_at: new Date().toISOString(),
      })
      .match({ razorpay_order_id: orderId, user_id: user.id });

    if (dbError) {
      throw dbError;
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});