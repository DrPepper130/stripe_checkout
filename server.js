import express from "express";
import Stripe from "stripe";

const app = express();
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => res.send("OK"));

app.post("/create-checkout-session", async (req, res) => {
  try {
    // OPTIONAL: accept data from Framer (like server link, username, package, etc.)
    // const { discordInvite } = req.body;

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment", // change to "subscription" if needed

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Your Product" },
            unit_amount: 1, // $0.01 = 1 cent
          },
          quantity: 1,
        },
      ],

      // IMPORTANT: this should be a real page on your Framer site
      return_url: "https://YOUR-FRAMER-DOMAIN.com/return?session_id={CHECKOUT_SESSION_ID}",

      // OPTIONAL:
      // metadata: { discordInvite },
    });

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Render uses PORT env var
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on", PORT));
