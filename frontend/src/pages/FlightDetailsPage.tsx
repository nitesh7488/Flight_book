import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createBooking } from "../store/bookingSlice";
import { motion } from "framer-motion";

const FlightDetailsPage = () => {
  const { selectedFlight, passengers } = useAppSelector((s) => s.flights);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!selectedFlight) {
    navigate("/results");
    return null;
  }

  const dep = new Date(selectedFlight.departureTime);
  const arr = new Date(selectedFlight.arrivalTime);

  // 🔥 Total fare calculation here
  const totalFare = selectedFlight.price * passengers;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const action: any = await dispatch(
      createBooking({
        flightId: selectedFlight.id,
        passengers,
        passengerName: name,
        passengerEmail: email,
      })
    );

    if (action.meta.requestStatus === "fulfilled") {
      navigate(`/booking-success/${action.payload.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 pt-24 px-4 pb-10">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* HEADER */}
        <div className="mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            🛫 Flight Details
          </h1>
          <p className="text-xs text-slate-500">Review info & confirm booking</p>
        </div>

        <main className="grid md:grid-cols-3 gap-6">

          {/* LEFT — FLIGHT SUMMARY */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 space-y-5"
          >
            <div className="rounded-2xl shadow-md bg-white p-5 flex items-center gap-4 border border-slate-100">

              <img
                src={selectedFlight.airlineLogoUrl}
                alt={selectedFlight.airlineName}
                className="h-12 w-12 object-contain"
              />

              <div className="flex-1">
                <p className="text-lg font-bold text-slate-800">
                  {selectedFlight.airlineName}
                </p>
                <p className="text-xs text-slate-500">{selectedFlight.flightNumber}</p>
              </div>

              {/* 🔥 Total price instead of single fare */}
              <div className="text-right">
                <span className="px-3 py-1 text-sm font-semibold bg-blue-600 text-white rounded-full shadow-sm">
                  ₹{totalFare.toFixed(0)}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">{passengers} Passenger(s)</p>
              </div>
            </div>

            {/* TIMING + ROUTE DETAILS */}
            <div className="rounded-2xl shadow-md bg-white grid grid-cols-3 p-5 text-sm border border-slate-100">

              <div>
                <p className="text-[11px] uppercase font-semibold text-slate-500">From</p>
                <p className="text-base font-bold">{selectedFlight.fromCity}</p>
                <p className="text-xs text-slate-400">
                  {dep.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <p className="text-[11px] uppercase font-semibold text-slate-500">Duration</p>
                <p className="font-semibold">{selectedFlight.durationMin} min</p>
                <div className="w-full h-[4px] bg-slate-200 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "60%" }} />
                </div>
              </div>

              <div className="text-right">
                <p className="text-[11px] uppercase font-semibold text-slate-500">To</p>
                <p className="text-base font-bold">{selectedFlight.toCity}</p>
                <p className="text-xs text-slate-400">
                  {arr.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

            </div>
          </motion.div>

          {/* RIGHT — PASSENGER FORM */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl shadow-md bg-white p-5 h-fit space-y-4 border border-slate-100"
          >
            <h2 className="text-sm font-bold text-slate-900">Passenger Details</h2>

            <div>
              <label className="text-xs font-semibold text-slate-600">Full Name</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Email</label>
              <input
                type="email"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[.98] transition">
              Confirm Booking ✈️
            </button>
          </motion.form>
        </main>
      </div>
    </div>
  );
};

export default FlightDetailsPage;
