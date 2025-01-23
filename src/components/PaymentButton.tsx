import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createOrder, verifyPayment } from "@/utils/payment";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentButtonProps {
  amount: number;
  onSuccess?: () => void;
  onError?: () => void;
}

export const PaymentButton = ({ amount, onSuccess, onError }: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePayment = async () => {
    try {
      setLoading(true);
      const order = await createOrder(amount);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Quiz App",
        description: "Quiz Reward Payment",
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            await verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
            toast({
              title: "Payment Successful",
              description: "Your payment has been processed successfully!",
            });
            onSuccess?.();
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast({
              title: "Payment Failed",
              description: "Failed to verify payment. Please try again.",
              variant: "destructive",
            });
            onError?.();
          }
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast({
        title: "Payment Failed",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      onError?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="w-full"
    >
      {loading ? "Processing..." : `Pay ₹${amount}`}
    </Button>
  );
};