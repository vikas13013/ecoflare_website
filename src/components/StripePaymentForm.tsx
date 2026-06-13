import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [processing, setProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canUseAppleGooglePay, setCanUseAppleGooglePay] = useState<boolean | null>(null);
  const [paymentMethodSupport, setPaymentMethodSupport] = useState<any>(null);

  /**
   * STEP 1: Initialize Apple Pay/Google Pay
   * Called when component mounts and Stripe is loaded
   */
  useEffect(() => {
    if (!stripe || !amount) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: currency.toLowerCase(),
      total: {
        label: "Total Order",
        amount: amount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestShipping: false,
    });

    // Check payment method support
    pr.canMakePayment()
      .then((result) => {
        setPaymentMethodSupport(result);
        if (result) {
          setPaymentRequest(pr);
          setCanUseAppleGooglePay(true);
        } else {
          setCanUseAppleGooglePay(false);
        }
      })
      .catch(() => setCanUseAppleGooglePay(false));

    // Handle wallet payment completion
    pr.on("paymentmethod", async (ev) => {
      setProcessing(true);

      try {
        const { error, paymentIntent: intent } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (error) {
          ev.complete("fail");
          onError(error.message || "Payment failed");
        } else {
          ev.complete("success");
          
          // Handle 3D Secure authentication if required
          if (intent?.status === "requires_action") {
            const { error: confirmError, paymentIntent: confirmedIntent } =
              await stripe.confirmCardPayment(clientSecret);

            if (confirmError) {
              onError(confirmError.message || "3D Secure authentication failed");
            } else if (confirmedIntent?.status === "succeeded") {
              onSuccess(confirmedIntent.id);
            }
          } else if (intent?.status === "succeeded") {
            onSuccess(intent.id);
          }
        }
      } catch (error: any) {
        ev.complete("fail");
        onError(error.message || "Payment processing failed");
      } finally {
        setProcessing(false);
      }
    });
  }, [stripe, amount, currency, clientSecret, onSuccess, onError]);

  /**
   * STEP 2: Handle regular card payment form submission
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error, paymentIntent: intent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardElement } }
      );

      console.log(intent , "payment ka response");
      

      if (error) {
        onError(error.message || "Payment failed");
      } else if (intent?.status === "succeeded") {
        onSuccess(intent.id);
      }
    } catch (error: any) {
      onError(error.message || "Payment processing failed");
    } finally {
      setProcessing(false);
    }
  };

  // Card element styling
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": { color: "#aab7c4" },
        padding: "10px 12px",
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Apple Pay / Google Pay Section */}
      {canUseAppleGooglePay && paymentRequest && (
        <>
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Pay with Apple Pay or Google Pay
              </p>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-green-200">
                <PaymentRequestButtonElement
                  options={{
                    paymentRequest,
                    style: {
                      paymentRequestButton: {
                        type: "default",
                        theme: "dark",
                        height: "44px",
                      },
                    },
                  }}
                  className="w-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Faster, more secure payment
              </p>
            </div>

            <div className="flex items-center justify-center my-4">
              <div className="w-full border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500 bg-white">OR</span>
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>
        </>
      )}

      {/* Credit Card Form */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Credit Card Details
        </label>
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
      >
        {processing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay ${currency} ${(amount / 100).toFixed(2)}`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secure and encrypted. We never store your card details.
      </p>
    </form>
  );
};

export default StripePaymentForm;