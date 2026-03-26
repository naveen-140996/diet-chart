const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://soi-dietchart.vercel.app"
  ],
  credentials: true
}));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use("/api/auth", require("./routes/authRoutes"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});