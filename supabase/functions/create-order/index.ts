import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Razorpay from "npm:razorpay";

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

    const { amount } = await req.json();

    const razorpay = new Razorpay({
      key_id: Deno.env.get("RAZORPAY_KEY_ID"),
      key_secret: Deno.env.get("RAZORPAY_KEY_SECRET"),
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    // Create payment record in database
    const { error: dbError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        amount,
        razorpay_order_id: order.id,
        status: "pending",
      });

    if (dbError) {
      throw dbError;
    }

    return new Response(
      JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      }),
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