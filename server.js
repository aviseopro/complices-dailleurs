import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  // TODO: Set mode to "subscription" if selling recurring products.
  const mode = 'payment';

  // Use the fixed_by_ui parameters from the Field Intents section above.
  // success_url, cancel_url, and line_items are sample_only — replace with real values, then list in TODO.
  // Only include payment_method_collection when mode is "subscription".
  const sessionParams = {
    ui_mode: 'hosted_page',
    mode,
    billing_address_collection: 'auto',
    phone_number_collection: {
      enabled: false,
    },
    automatic_tax: {
      enabled: false,
    },
    allow_promotion_codes: false,
    submit_type: 'auto',
    integration_identifier: 'hosted_web_0001',
    origin_context: 'web',
    success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN}`,
    line_items: [{ price: 'price_...', quantity: 1 }],
  };

  if (mode === 'subscription') {
    sessionParams.payment_method_collection = 'always'; // Use the fixed_by_ui value from Field Intents
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);
    res.redirect(303, session.url);
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event = req.body;

  if (endpointSecret) {
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
      console.log('Webhook signature verification failed.', err.message);
      return res.sendStatus(400);
    }
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout completed:', session.id);
      // Fulfill the purchase, grant access, etc.

      // Verify terms of service acceptance
      if (session.consent?.terms_of_service === 'accepted') {
        console.log('Customer accepted terms of service');
      }

      // Check promotional email consent (opt_in or opt_out)
      if (session.consent?.promotions === 'opt_in') {
        const email = session.customer_details?.email;
        console.log('Customer opted in for promotional emails:', email);
        // Add email to your marketing list
      }
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 4242;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
