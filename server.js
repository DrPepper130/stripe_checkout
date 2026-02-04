import express from "express";
import Stripe from "stripe";

/**
 * PRODUCT MAP
 * key = productId sent from Framer
 * type = "payment" | "subscription"
 * priceId = Stripe price_...
 */
const PRODUCTS = {
  mega: {
    type: "payment",
    priceId: "price_1SOjGG3NjejKZr8W1uYQH6r6",
  },

  AI: {
    type: "payment",
    priceId: "price_1SsULj3NjejKZr8WpnjvOmYs",
  },

  private: {
    type: "subscription",
    priceId: "price_1SaQzP3NjejKZr8W9dWVevfx",
  },

  basic: {
    type: "subscription",
    priceId: "price_1Sip1B3NjejKZr8WGvIjThRW",
  },

  premium: {
    type: "subscription",
    priceId: "price_1SoE3w3NjejKZr8WWDbgTLCT",
  },

  ultimate: {
    type: "subscription",
    priceId: "price_1SoE5U3NjejKZr8WRkhfr7cD",
  },
};

const app = express();

/* ---------------- CORS ---------------- */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ---------------- ROUTES ---------------- */

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { productId } = req.body;

    const product = PRODUCTS[productId];
    if (!product) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: product.type, // "payment" or "subscription"
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      return_url:
        "https://www.megafile.com/return?session_id={CHECKOUT_SESSION_ID}",
    });

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on", PORT);
});
