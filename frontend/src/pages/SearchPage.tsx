import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SearchPage() {
  const navigate = useNavigate();

  const [from, setFrom] = useState("Delhi");
  const [to, setTo] = useState("Mumbai");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate("/results", { state: { from, to, date, passengers } });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center relative overflow-hidden px-6">

      {/* Background Glow Orbs */}
      <div className="absolute w-[420px] h-[420px] bg-blue-300/30 blur-[140px] -top-20 -left-20 rounded-full" />
      <div className="absolute w-[420px] h-[420px] bg-purple-300/25 blur-[140px] bottom-[-120px] right-[-100px] rounded-full" />

      <div className="text-center absolute top-[12%]">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }} 
          className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight"
        >
          Find Your Next Flight ✈
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 5 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1, duration: 0.7 }}
          className="text-sm md:text-base text-slate-500 mt-1"
        >
          Choose destination, date & seat — start your journey now!
        </motion.p>
      </div>

      {/* Form Box */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="bg-white/90 backdrop-blur-md w-full max-w-xl mt-24 shadow-xl rounded-2xl px-6 py-7 space-y-5 border border-slate-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* From */}
          <div>
            <label className="text-xs font-semibold text-slate-700">From</label>
            <div className="flex items-center border rounded-lg px-3 py-2 gap-2 bg-white shadow-sm focus-within:ring-2 ring-blue-500 transition">
              <span>📍</span>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full text-sm outline-none"
                placeholder="Departure city"
              />
            </div>
          </div>

          {/* To */}
          <div>
            <label className="text-xs font-semibold text-slate-700">To</label>
            <div className="flex items-center border rounded-lg px-3 py-2 gap-2 bg-white shadow-sm focus-within:ring-2 ring-blue-500 transition">
              <span>🛬</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full text-sm outline-none"
                placeholder="Destination city"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-slate-700">Travel Date</label>
            <div className="border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 ring-blue-500 transition">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm outline-none"
                required
              />
            </div>
          </div>

          {/* Passengers */}
          <div>
            <label className="text-xs font-semibold text-slate-700">Passengers</label>
            <div className="border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 ring-blue-500 transition">
              <input
                type="number"
                min={1}
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-3 text-white text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-400/30 transition"
        >
          🔍 Search Flights
        </motion.button>
      </motion.form>
    </div>
  );
}
