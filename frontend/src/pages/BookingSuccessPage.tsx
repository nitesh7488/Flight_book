import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getBookingById } from "../store/bookingSlice";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function BookingSuccessPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { bookingDetails, loading } = useAppSelector((s) => s.booking);

  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) dispatch(getBookingById(Number(id)));

    // 🎉 Fire confetti
    setTimeout(() => {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.4 } });
    }, 400);
  }, [id]);

  // 📄 PDF Generation
  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    const canvas = await html2canvas(ticketRef.current);
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(img, "PNG", 10, 15, imgWidth, imgHeight);
    pdf.save(`Boarding-Pass-${id}.pdf`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 px-4 pt-24 pb-14">

      {/* Outer Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-200 p-7 space-y-5 text-center relative overflow-hidden"
      >
        {/* Animated Check Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 120 }}
          className="mx-auto w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center text-4xl font-bold shadow-lg"
        >
          ✓
        </motion.div>

        <h1 className="text-[24px] font-extrabold text-emerald-600 tracking-tight">
          Booking Confirmed 🎉
        </h1>
        <p className="text-xs text-slate-500 -mt-2">
          Your e-ticket is ready — have a smooth journey!
        </p>

        {loading && <p className="text-sm text-slate-600 mt-3">Fetching details...</p>}

        {/* 💳 Ticket Block (Exportable to PDF) */}
        {bookingDetails && (
          <div
            ref={ticketRef}
            className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-sm space-y-3 mt-3 text-left shadow-md"
          >
            <div className="flex justify-between">
              <p className="text-[11px] font-semibold text-slate-500">BOOKING ID</p>
              <p className="font-bold text-slate-900">#{bookingDetails.id}</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-500">PASSENGER</p>
              <p className="font-semibold text-slate-800">{bookingDetails.passengerName}</p>
              <p className="text-[11px] text-slate-500">{bookingDetails.passengerEmail}</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-500">FLIGHT</p>
              <p className="font-semibold text-slate-800">
                {bookingDetails.flight.airlineName} — {bookingDetails.flight.flightNumber}
              </p>
            </div>

            <div className="pt-2 border-t border-dashed border-slate-300">
              <p className="text-[11px] font-semibold text-slate-500">ROUTE</p>
              <p className="font-semibold text-slate-800">
                {bookingDetails.flight.fromCity} → {bookingDetails.flight.toCity}
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">

          <button
            onClick={downloadTicket}
            className="px-5 py-2 text-xs rounded-full bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 active:scale-[.97]"
          >
            📄 Download Ticket
          </button>

          <button
            onClick={() => navigate("/bookings")}
            className="px-5 py-2 text-xs rounded-full border border-slate-400 text-slate-700 font-semibold hover:bg-slate-100 active:scale-[.97]"
          >
            📂 Booking History
          </button>

          <button
            onClick={() => navigate("/search")}
            className="px-5 py-2 text-xs rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 active:scale-[.97]"
          >
            ✈ Book Another
          </button>
        </div>
      </motion.div>
    </div>
  );
}
