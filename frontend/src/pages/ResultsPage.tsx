import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { searchFlights, setSelectedFlight } from "../store/flightSlice";
import FlightCard from "../components/FlightCard";

interface LocationState {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { flights, loading, error, page, totalPages, total } = useAppSelector(
    (s) => s.flights
  );

  const state = location.state as LocationState | null;

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);

  const [sortBy, setSortBy] = useState<"price" | "departure" | "duration">(
    "price"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [maxDuration, setMaxDuration] = useState<number | undefined>();
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Derived airline list from flights
  const airlines = useMemo(() => {
    const set = new Set<string>();
    flights.forEach((f) => set.add(f.airlineName));
    return Array.from(set);
  }, [flights]);

  // First load – if direct /results without state, go back
  useEffect(() => {
    if (!state) {
      navigate("/search", { replace: true });
      return;
    }

    fetchFlights(1);
  }, []);

  // Helper to fetch with filters
  const fetchFlights = (pageToLoad: number) => {
    if (!state) return;

    dispatch(
      searchFlights({
        from: state.from,
        to: state.to,
        date: state.date,
        passengers: state.passengers,
        page: pageToLoad,
        limit,
        sortBy,
        sortOrder,
        minPrice,
        maxPrice,
        maxDuration,
        airlines: selectedAirlines,
      })
    );
  };

  // When pagination or filters/sorting change
  useEffect(() => {
    if (!state) return;
    fetchFlights(currentPage);
  }, [
    currentPage,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    maxDuration,
    selectedAirlines,
  ]);

  const onSelectFlight = (id: number) => {
    const f = flights.find((x) => x.id === id);
    if (!f) return;
    dispatch(setSelectedFlight(f));
    navigate(`/flight/${id}`);
  };

  const handleAirlineChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedAirlines((prev) => [...prev, value]);
    } else {
      setSelectedAirlines((prev) => prev.filter((a) => a !== value));
    }
    setCurrentPage(1);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "price-asc") {
      setSortBy("price");
      setSortOrder("asc");
    } else if (value === "price-desc") {
      setSortBy("price");
      setSortOrder("desc");
    } else if (value === "departure-asc") {
      setSortBy("departure");
      setSortOrder("asc");
    } else if (value === "departure-desc") {
      setSortBy("departure");
      setSortOrder("desc");
    } else if (value === "duration-asc") {
      setSortBy("duration");
      setSortOrder("asc");
    } else if (value === "duration-desc") {
      setSortBy("duration");
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const formattedDate = state?.date
    ? new Date(state.date).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto pt-20 pb-10 px-4 md:px-0">

        {/* 🔥 Top Header / Hero */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-blue-700 tracking-wide uppercase">
                Flight search results
              </span>
            </div>

            <h1 className="text-[22px] md:text-[26px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              ✈ {state?.from || "From"} → {state?.to || "To"}
            </h1>
            <p className="text-[13px] text-slate-500 mt-1">
              {formattedDate && (
                <>
                  Date:{" "}
                  <span className="font-medium text-slate-700">
                    {formattedDate}
                  </span>{" "}
                  ·{" "}
                </>
              )}
              Passengers:{" "}
              <span className="font-medium text-slate-700">
                {state?.passengers ?? 1}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => navigate("/search")}
              className="px-4 py-[6px] rounded-full bg-white/70 backdrop-blur-md 
                         border border-blue-200 shadow-sm text-[12px] font-semibold 
                         text-blue-600 hover:bg-blue-100 hover:border-blue-300 
                         transition-all flex items-center gap-1"
            >
              New Search
            </button>

            <p className="text-[11px] text-slate-500 text-right">
              {total} flights found • Page {page} of {totalPages}
            </p>
          </div>
        </motion.div>

        {/* Mobile Filters Toggle */}
        <div className="mb-4 md:hidden flex justify-between items-center">
          <button
            onClick={() => setShowFiltersMobile((prev) => !prev)}
            className="px-4 py-2 rounded-full bg-white border border-slate-200 text-[12px] font-semibold text-slate-700 flex items-center gap-2 shadow-sm"
          >
            <span>🎚 Filters</span>
            <span className="text-[10px] text-slate-500">
              {showFiltersMobile ? "Hide" : "Show"}
            </span>
          </button>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="hidden xs:inline">Sorted by</span>
            <select
              className="border rounded-full px-3 py-[4px] text-[11px] bg-white"
              onChange={handleSortChange}
              defaultValue="price-asc"
            >
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="departure-asc">Departure ↑</option>
              <option value="departure-desc">Departure ↓</option>
              <option value="duration-asc">Duration ↑</option>
              <option value="duration-desc">Duration ↓</option>
            </select>
          </div>
        </div>

        {/* ===== Main Grid (Filters + Results) ===== */}
        <main className="grid md:grid-cols-[260px,1fr] gap-6">

          {/* Filters Panel */}
          <motion.aside
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`bg-white/90 rounded-2xl shadow-md border border-slate-200 p-4 space-y-4 text-sm
                        ${showFiltersMobile ? "block" : "hidden"} md:block`}
          >
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="text-blue-600">🎚</span> Filters
            </h2>

            {/* Price Range */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1">
                Price Range (₹)
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={minPrice ?? ""}
                  onChange={(e) =>
                    setMinPrice(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={maxPrice ?? ""}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1">
                Max Duration (minutes)
              </p>
              <input
                type="number"
                placeholder="e.g. 180"
                className="w-full border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={maxDuration ?? ""}
                onChange={(e) =>
                  setMaxDuration(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            </div>

            {/* Airline Filter */}
            {airlines.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Airlines
                </p>
                <div className="space-y-1 max-h-40 overflow-auto pr-1">
                  {airlines.map((airline) => (
                    <label
                      key={airline}
                      className="flex items-center gap-2 text-xs text-slate-700"
                    >
                      <input
                        type="checkbox"
                        value={airline}
                        checked={selectedAirlines.includes(airline)}
                        onChange={handleAirlineChange}
                      />
                      {airline}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>

          {/* Results + Sorting + Pagination */}
          <section className="space-y-4">

            {/* Desktop Sorting Row */}
            <div className="hidden md:flex flex-row items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Available Flights
                </h2>
                <p className="text-xs text-slate-500">
                  Refine results with filters & sorting on the left.
                </p>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600">Sort by:</span>
                <select
                  className="border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleSortChange}
                  defaultValue="price-asc"
                >
                  <option value="price-asc">Price (Low → High)</option>
                  <option value="price-desc">Price (High → Low)</option>
                  <option value="departure-asc">
                    Departure (Early → Late)
                  </option>
                  <option value="departure-desc">
                    Departure (Late → Early)
                  </option>
                  <option value="duration-asc">
                    Duration (Short → Long)
                  </option>
                  <option value="duration-desc">
                    Duration (Long → Short)
                  </option>
                </select>
              </div>
            </div>

            {/* List */}
            {loading && (
              <p className="text-sm text-slate-500">Loading flights...</p>
            )}
            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            {!loading && flights.length === 0 && !error && (
              <p className="text-sm text-slate-500">
                No flights match your criteria. Try adjusting filters.
              </p>
            )}

            <div className="space-y-3">
              {flights.map((f) => (
                <FlightCard
                  key={f.id}
                  flight={f}
                  onSelect={() => onSelectFlight(f.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 text-xs">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 bg-white hover:bg-slate-50"
                >
                  Prev
                </button>

                <span className="px-3 py-1 text-slate-600">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50 bg-white hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
