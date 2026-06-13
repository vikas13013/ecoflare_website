export interface CreatePaymentIntentData {
  amount: number;
  currency: string;
  description: string;
}

export interface PaymentResponse {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
}

class StripeService {
  // ✅ Use direct URL to avoid environment issues
  private baseURL = 'https://api.ecoflaresolutions.com/orders/payments';

  async createPaymentIntent(
    paymentData: CreatePaymentIntentData,
    token: string
  ): Promise<PaymentResponse> {
    try {
      console.log("🔗 Making API call to:", `${this.baseURL}/create/`);
      console.log("📦 Request payload:", paymentData);
      console.log("🔑 Token exists:", !!token);

      const response = await fetch(`${this.baseURL}/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error response:", errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'Unknown error' };
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("✅ API Success response:", responseData);
      
      return responseData;
    } catch (error: any) {
      console.error("💥 Stripe service error:", error);
      throw error;
    }
  }

 
}

export const stripeService = new StripeService();