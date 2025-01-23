import { supabase } from "@/integrations/supabase/client";

export const createOrder = async (amount: number) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const order = await response.json();
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        paymentId,
        orderId,
        signature,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};