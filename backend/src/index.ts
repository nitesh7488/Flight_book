import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import flightRoutes from "./routes/flightRoutes";
import bookingRoutes from "./routes/bookingRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Flight API running" });
});

app.use("/auth", authRoutes);
app.use("/flights", flightRoutes);
app.use("/booking", bookingRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
