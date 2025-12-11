import { Router } from "express";
import prisma from "../prismaClient";

const router = Router();

// POST /flights/search
// Advanced: filters, sorting, pagination
router.post("/search", async (req, res) => {
  try {
    const {
      from,
      to,
      date,
      passengers,
      page = 1,
      limit = 5,
      sortBy = "price",          // 'price' | 'departure' | 'duration'
      sortOrder = "asc",         // 'asc' | 'desc'
      minPrice,
      maxPrice,
      maxDuration,
      airlines,                  // string[] optional
    } = req.body;

    if (!from || !to || !date) {
      return res.status(400).json({ message: "From, To & Date are required" });
    }

    const pageNum = Number(page) || 1;
    const take = Number(limit) || 5;
    const skip = (pageNum - 1) * take;

    // Date range for that day
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    // Build WHERE clause
    const where: any = {
      fromCity: { equals: from, mode: "insensitive" },
      toCity: { equals: to, mode: "insensitive" },
      departureTime: {
        gte: start,
        lt: end,
      },
    };

    if (typeof minPrice === "number") {
      where.price = { ...(where.price || {}), gte: minPrice };
    }
    if (typeof maxPrice === "number") {
      where.price = { ...(where.price || {}), lte: maxPrice };
    }

    if (typeof maxDuration === "number") {
      where.durationMin = { lte: maxDuration };
    }

    if (Array.isArray(airlines) && airlines.length > 0) {
      where.airlineName = { in: airlines };
    }

    // Sorting
    let orderBy: any = { price: sortOrder };
    if (sortBy === "departure") {
      orderBy = { departureTime: sortOrder };
    } else if (sortBy === "duration") {
      orderBy = { durationMin: sortOrder };
    }

    // Total count for pagination
    const total = await prisma.flight.count({ where });

    // Paged result
    const flights = await prisma.flight.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    const totalPages = Math.ceil(total / take) || 1;

    return res.json({
      flights,
      passengers,
      page: pageNum,
      limit: take,
      total,
      totalPages,
    });
  } catch (err) {
    console.error("Flight search error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
