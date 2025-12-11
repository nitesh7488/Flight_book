import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col items-center justify-center overflow-hidden relative px-6">

      {/* Soft background blurred circles */}
      <div className="absolute w-[380px] h-[380px] bg-blue-300/30 blur-[120px] rounded-full -top-24 -left-24"></div>
      <div className="absolute w-[380px] h-[380px] bg-purple-300/25 blur-[120px] rounded-full -bottom-24 -right-24"></div>

      {/* Heading Section */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-[38px] md:text-[48px] font-extrabold tracking-tight text-slate-800 drop-shadow-sm"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Your Journey Begins Here ✈
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="mt-2 text-[15px] md:text-[17px] text-slate-600 font-medium"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Fast • Simple • Secure — Book your next flight effortlessly
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="flex gap-5 mt-8 flex-wrap"
      >
        <Link
          to="/search"
          className="px-7 py-3 rounded-xl text-white font-semibold text-[15px] shadow-lg shadow-blue-400/30
                     bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600
                     transition-all hover:scale-[1.04] active:scale-[0.97]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          🔍 Search Flights
        </Link>

        <Link
          to="/bookings"
          className="px-7 py-3 rounded-xl text-white font-semibold text-[15px] shadow-lg shadow-green-400/30
                     bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600
                     transition-all hover:scale-[1.04] active:scale-[0.97]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          📄 Your Bookings
        </Link>
      </motion.div>

      {/* Foot small text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 text-[13px] text-slate-500"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Made with ❤️ for smooth flight booking experience
      </motion.p>
    </div>
  );
}
