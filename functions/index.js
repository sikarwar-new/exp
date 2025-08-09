import * as functions from "firebase-functions";
import admin from "firebase-admin";
import Stripe from "stripe";
import express from "express";
import cors from "cors";

admin.initializeApp();

const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: "2022-11-15",
});

const app = express();

// Configure CORS to allow your specific origins
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-app-domain.web.app", // Replace with your Firebase hosting domain
    /\.local-credentialless\.webcontainer-api\.io$/, // Allow WebContainer domains
  ],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Handle preflight requests
app.options("*", cors(corsOptions));

app.post("/createCheckoutSession", async (req, res) => {
  try {
    // Get the origin from the request
    const origin = req.get("origin") || req.get("referer");
    let successUrl = "http://localhost:5173/success";
    let cancelUrl = "http://localhost:5173/cancel";

    // Set appropriate URLs based on origin
    if (origin && origin.includes("webcontainer-api.io")) {
      successUrl = `${origin}/success`;
      cancelUrl = `${origin}/cancel`;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.title },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity || 1,
      })),
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Export Express app as Firebase HTTPS function
export const createCheckoutSession = functions.https.onRequest(app);
