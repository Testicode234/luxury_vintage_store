const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const stripeRoutes = require("./routes/stripe");
app.use("/api/stripe", stripeRoutes);

app.get("/checkout/success", (req, res) => {
  res.redirect(
    `${process.env.CLIENT_URL}/order-confirmation?session_id=${req.query.session_id}`
  );
});

app.get("/checkout/cancel", (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/shopping-cart`);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend server running on http://0.0.0.0:${PORT}`);
});
