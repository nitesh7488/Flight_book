import { Router } from "express";
import prisma from "../prismaClient";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

/* =====================================
   CREATE BOOKING
===================================== */
router.post("/create", authMiddleware, async (req: AuthRequest, res) => {
  const { flightId, passengers, passengerName, passengerEmail } = req.body;
  console.log("📩 Incoming Booking Request →", req.body);

  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!flightId) return res.status(400).json({ message: "Flight ID required" });

  try {
    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,                 // 🔥 from token
        flightId: Number(flightId),          // 🔥 convert to number
        passengers: Number(passengers),
        passengerName,
        passengerEmail,
      },
      include: { flight: true }
    });

    return res.status(201).json(booking);
  } catch (err: any) {
    console.log("❌ BOOKING ERROR:", err);
    return res.status(500).json({ message: "Booking failed", error: err.message });
  }
});

/* =====================================
   GET BOOKING BY ID  (for success page)
===================================== */
router.get("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);

  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const booking = await prisma.booking.findFirst({
      where: { id, userId: req.user.id },
      include: { flight: true }
    });

    if (!booking) return res.status(404).json({ message: "Booking Not Found" });

    return res.json(booking);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});


/* =====================================
   USER BOOKING HISTORY
===================================== */
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { flight: true },
      orderBy: { createdAt: "desc" }
    });

    return res.json(bookings);
  } catch (err: any) {
    console.log("❌ HISTORY ERROR:", err);
    return res.status(500).json({ message: "Error fetching history" });
  }
});


export default router;
