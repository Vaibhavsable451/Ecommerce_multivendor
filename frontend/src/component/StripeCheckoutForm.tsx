import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripeCheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    // This is a demo: in production, handle the payment intent on the backend
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    if (error) {
      alert(error.message);
    } else {
      alert('Payment method created! ID: ' + paymentMethod?.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe} style={{ marginTop: 16 }}>
        Pay
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
