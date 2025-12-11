import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get("/booking");
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
    const pending = bookings.filter((b) => b.status !== "CONFIRMED").length;
    return { total, confirmed, pending };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <div className="max-w-5xl mx-auto pt-20 pb-10 px-4 md:px-0">

        {/* 🔥 Top Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold text-blue-700 tracking-wide uppercase">
              Booking history overview
            </span>
          </div>

          {/* Heading + subtitle */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-[26px] md:text-[30px] font-extrabold text-slate-900 tracking-tight">
                Your Trips & Tickets 📄
              </h1>
              <p className="text-[13px] md:text-[14px] text-slate-500 mt-1 max-w-xl">
                Track all your flight reservations, stay on top of upcoming journeys
                and revisit your past travels — all in one place.
              </p>
            </div>

            {/* Mini Highlight */}
            <div className="px-4 py-2 rounded-xl bg-white/80 border border-slate-200 shadow-sm text-xs text-slate-600 flex flex-col">
              <span className="font-semibold text-slate-800">
                {stats.total > 0 ? "Last booking:" : "No bookings yet"}
              </span>
              {stats.total > 0 && (
                <span className="text-[11px] text-slate-500">
                  {formatDateTime(bookings[0]?.createdAt)}
                </span>
              )}
            </div>
          </div>
        </motion.div>

           

        {/* ⏳ Loading State */}
        {loading && (
          <div className="space-y-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-white rounded-2xl shadow-sm animate-pulse border border-slate-100"
              />
            ))}
          </div>
        )}

        {/* 🫥 Empty State */}
        {!loading && bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 bg-white/85 backdrop-blur-md border border-dashed border-slate-300 rounded-2xl p-8 text-center"
          >
            <p className="text-sm text-slate-600 mb-2">
              You don&apos;t have any bookings yet.
            </p>
            <p className="text-xs text-slate-400">
              Start by searching for a flight and confirm your first booking. ✈️
            </p>
          </motion.div>
        )}

        {/* 📦 Booking Cards List */}
        <div className="space-y-3 mt-4">
          {bookings.map((b, index) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + index * 0.04 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col md:flex-row justify-between gap-3"
            >
              {/* Left: Flight + passenger */}
              <div className="flex gap-3">
                <div className="hidden md:flex flex-col items-center pt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mb-1" />
                  <div className="w-px flex-1 bg-slate-200" />
                </div>

                <div>
                  <p className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
                    {b.flight.airlineName}
                    <span className="text-[11px] text-slate-500 border px-2 py-[2px] rounded-full">
                      {b.flight.flightNumber}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {b.flight.fromCity} &rarr; {b.flight.toCity}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Passenger:{" "}
                    <span className="font-medium text-slate-600">
                      {b.passengerName}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Booked on: {formatDateTime(b.createdAt)}
                  </p>
                </div>
              </div>

              {/* Right: id + status + departure */}
              <div className="text-right space-y-1 md:min-w-[160px]">
                <p className="text-[11px] text-slate-500">
                  Booking ID <span className="font-semibold">#{b.id}</span>
                </p>

                <span
                  className={`inline-flex text-[11px] px-3 py-[4px] rounded-full font-medium
                  ${
                    b.status === "CONFIRMED"
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                >
                  {b.status}
                </span>

                <p className="text-[11px] text-slate-500 mt-1">
                  Departure:{" "}
                  <span className="font-semibold text-slate-700">
                    {formatDateTime(b.flight.departureTime)}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryPage;
