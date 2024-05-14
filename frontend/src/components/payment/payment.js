import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './checkoutForm';
import Notification from '../notificaitons/notificaiton';

//Create a Stripe promise (stripePromise) using the loadStripe function. This promise is used to load the Stripe.js script asynchronously.
const PaymentComponent = () => {
const stripePromise = loadStripe('pk_test_51PCn3w02viTsel8JLSMqJtAXz3N83i2SgnxOM5Fh0JO6Zj5EJ8qkdg729HjDV9Zu7OidTK6z2BelQtYPDC62RLFK00Y2BBI6gO');

  return (
    <div>
      {/* <h1>Stripe Payment Example</h1> */}
      {/* Wrap the CheckoutForm component with the Elements component and provide the Stripe promise */}
      <Elements stripe={stripePromise}>
        <CheckoutForm />
       <Notification message="Payment is done"/> 
      </Elements>
    </div>
  );
};
export default PaymentComponent;