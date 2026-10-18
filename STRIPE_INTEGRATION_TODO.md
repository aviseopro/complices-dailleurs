# Stripe Integration TODO

This document is the single source of truth for the remaining setup steps to complete your Stripe Checkout integration.

---

## Values to Replace

The following values are placeholders and must be updated before going live.

**Files containing placeholders:**
- [server.js](server.js)

| Field | Current Value | What to Set |
|-------|--------------|-------------|
| mode | payment | Set to "payment" for one-time charges or "subscription" for recurring billing. |
| success_url | `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}` | Your actual post-payment success page URL. Keep the `{CHECKOUT_SESSION_ID}` template. |
| cancel_url | `${process.env.DOMAIN}` | Your actual cancel/return page URL. |
| line_items[].price | price_... | Your actual Stripe Price ID from the Dashboard (https://dashboard.stripe.com/prices) or API. |

---

## Configured Parameters

These parameters were configured in Checkout Studio and are already set correctly.

**Files containing these parameters:**
- [server.js](server.js)

| Parameter | Value |
|-----------|-------|
| ui_mode | hosted_page |
| billing_address_collection | auto |
| phone_number_collection | {"enabled": false} |
| automatic_tax | {"enabled": false} |
| allow_promotion_codes | false |
| payment_method_collection | always (included when mode is subscription) |
| submit_type | auto |
| integration_identifier | hosted_web_0001 |
| origin_context | web |

> **Note on `ui_mode` versioning**: The value `hosted_page` is for Stripe SDK version 21.0.0 and above. For SDK versions below 21.0.0, change `ui_mode` to `hosted`.

---

## Setup and Next Steps

### 1. Environment Variables & API Keys

Update your [.env](.env) file with your keys from the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys):

```env
# Browser-accessible (Vite)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Server-only
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DOMAIN=http://localhost:3000
```

### 2. Dependencies & Starting the Server

Install dependencies:
```bash
npm install
```

Start the backend server:
```bash
npm run server
```

The server runs on port 4242 by default (or the port specified in `PORT`).

### 3. Project Structure

The following new files were created for this integration:
- [server.js](server.js): Express server hosting `/api/create-checkout-session` and `/api/webhook`
- [.env](.env): Environment variables configuration
- [STRIPE_INTEGRATION_TODO.md](STRIPE_INTEGRATION_TODO.md): Integration tracking and next steps guide

### 4. How the Integration Works

1. **Checkout Initiation**: Your client sends a POST request to `/api/create-checkout-session`.
2. **Session Creation**: The server initializes a Stripe Checkout session with the configured parameters.
3. **Redirection**: The customer is redirected (HTTP 303) to Stripe's secure hosted payment page.
4. **Completion**: Upon successful payment, Stripe redirects the customer to `success_url` (`/success?session_id=...`).
5. **Webhook Processing**: Stripe sends asynchronous webhook events (e.g., `checkout.session.completed`) to `/api/webhook` to fulfill the booking.

### 5. Testing with Test Cards

Use Stripe's test payment details when in test mode (`sk_test_...`):
- **Card number**: `4242 4242 4242 4242`
- **Expiration**: Any future month/year
- **CVC**: Any 3 digits
- **Postal code**: Any valid format

### 6. Next Steps

1. Replace `price_...` in [server.js](server.js) with your real Stripe Price ID from [Stripe Dashboard Prices](https://dashboard.stripe.com/prices).
2. Create dedicated Success and Cancel pages in your frontend routing.
3. Set up the webhook listener in the Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:4242/api/webhook
   ```
4. Handle booking confirmation and database persistence in the `checkout.session.completed` webhook handler.

### Resources
- Support: https://support.stripe.com
- Stripe Documentation & MCP: https://docs.stripe.com/mcp
