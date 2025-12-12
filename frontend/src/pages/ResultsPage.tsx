import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { searchFlights, setSelectedFlight } from "../store/flightSlice";
// import { Flight } from "../store/flightSlice";
import FlightCard from "../components/FlightCard";
import styles from "./ResultsPage.module.css";

interface LocationState {
  from: string;
  to: string;
  date: string;
  passengers: number;
  tripType?: string;
  travelClass?: string;
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
  const [limit] = useState(8);

  const [sortBy, setSortBy] = useState<"price" | "departure" | "duration">("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [filters, setFilters] = useState({
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    maxDuration: undefined as number | undefined,
    selectedAirlines: [] as string[],
  });

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Derived airline list from flights
  const airlines = useMemo(() => {
    const set = new Set<string>();
    flights.forEach((f) => set.add(f.airlineName));
    return Array.from(set).sort();
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
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        maxDuration: filters.maxDuration,
        airlines: filters.selectedAirlines,
      })
    );
  };

  // When pagination or filters/sorting change
  useEffect(() => {
    if (!state) return;
    fetchFlights(currentPage);
  }, [currentPage, sortBy, sortOrder, filters]);

  const onSelectFlight = (id: number) => {
    const f = flights.find((x) => x.id === id);
    if (!f) return;
    dispatch(setSelectedFlight(f));
    navigate(`/flight/${id}`);
  };

  const handleAirlineChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      selectedAirlines: checked 
        ? [...prev.selectedAirlines, value]
        : prev.selectedAirlines.filter(a => a !== value)
    }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setFilters({
      minPrice: undefined,
      maxPrice: undefined,
      maxDuration: undefined,
      selectedAirlines: [],
    });
    setSortBy("price");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const formattedDate = state?.date
    ? new Date(state.date).toLocaleDateString("en-US", {
        weekday: 'short',
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  // Loading skeletons
  const renderSkeletons = () => (
    <div className={styles.skeletonContainer}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Background Animation Elements */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.floatingCircle1}></div>
        <div className={styles.floatingCircle2}></div>
      </div>

      <div className={styles.contentWrapper}>
        {/* 🔥 Top Header / Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          {/* Badge */}
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span className={styles.badgeText}>
              Flight search results
            </span>
          </div>

          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.title}>
                <span className={styles.fromCity}>{state?.from || "From"}</span>
                <span className={styles.arrow}>→</span>
                <span className={styles.toCity}>{state?.to || "To"}</span>
              </h1>
              <p className={styles.subtitle}>
                {formattedDate && (
                  <span className={styles.dateInfo}>
                    <span className={styles.infoLabel}>Date:</span>
                    <span className={styles.infoValue}>{formattedDate}</span>
                  </span>
                )}
                <span className={styles.passengerInfo}>
                  <span className={styles.infoLabel}>Passengers:</span>
                  <span className={styles.infoValue}>{state?.passengers ?? 1}</span>
                </span>
                {state?.travelClass && (
                  <span className={styles.classInfo}>
                    <span className={styles.infoLabel}>Class:</span>
                    <span className={styles.infoValue}>{state.travelClass}</span>
                  </span>
                )}
              </p>
            </div>

            <div className={styles.headerActions}>
              <motion.button
                onClick={() => navigate("/search")}
                className={styles.newSearchButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.buttonIcon}>🔍</span>
                <span>New Search</span>
              </motion.button>

              <div className={styles.resultsInfo}>
                <span className={styles.totalResults}>
                  {total} {total === 1 ? 'flight' : 'flights'} found
                </span>
                {totalPages > 1 && (
                  <span className={styles.pageInfo}>
                    Page {page} of {totalPages}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile Filters Toggle */}
        <motion.div 
          className={styles.mobileFiltersToggle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className={styles.filtersToggleButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>🎚</span>
            <span>Filters {filters.selectedAirlines.length > 0 && `(${filters.selectedAirlines.length})`}</span>
            <motion.span 
              animate={{ rotate: showFiltersMobile ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </motion.button>

          <div className={styles.mobileSort}>
            <span>Sort:</span>
            <select
              className={styles.sortSelect}
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
        </motion.div>

        {/* ===== Main Grid (Filters + Results) ===== */}
        <main className={styles.mainGrid}>
          {/* Filters Panel - Mobile */}
          <AnimatePresence>
            {showFiltersMobile && (
              <motion.aside
                className={styles.filtersPanelMobile}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.filtersHeader}>
                  <h3>Filters</h3>
                  <button 
                    onClick={clearAllFilters}
                    className={styles.clearFilters}
                  >
                    Clear all
                  </button>
                </div>
                
                {/* Price Range */}
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Price Range (₹)</label>
                  <div className={styles.priceInputs}>
                    <input
                      type="number"
                      placeholder="Min"
                      className={styles.filterInput}
                      value={filters.minPrice ?? ""}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <span className={styles.inputSeparator}>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className={styles.filterInput}
                      value={filters.maxPrice ?? ""}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Max Duration (minutes)</label>
                  <input
                    type="number"
                    placeholder="e.g., 180"
                    className={styles.filterInput}
                    value={filters.maxDuration ?? ""}
                    onChange={(e) => handleFilterChange('maxDuration', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>

                {/* Airline Filter */}
                {airlines.length > 0 && (
                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Airlines</label>
                    <div className={styles.airlineOptions}>
                      {airlines.map((airline) => (
                        <label key={airline} className={styles.airlineOption}>
                          <input
                            type="checkbox"
                            value={airline}
                            checked={filters.selectedAirlines.includes(airline)}
                            onChange={handleAirlineChange}
                          />
                          <span className={styles.checkmark}></span>
                          <span>{airline}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Desktop Filters */}
          <motion.aside
            className={styles.filtersPanelDesktop}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className={styles.filtersHeader}>
              <h3>Filters</h3>
              <button 
                onClick={clearAllFilters}
                className={styles.clearFilters}
              >
                Clear all
              </button>
            </div>
            
            {/* Price Range */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Price Range (₹)</label>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  className={styles.filterInput}
                  value={filters.minPrice ?? ""}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                />
                <span className={styles.inputSeparator}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className={styles.filterInput}
                  value={filters.maxPrice ?? ""}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Duration */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Max Duration (minutes)</label>
              <input
                type="number"
                placeholder="e.g., 180"
                className={styles.filterInput}
                value={filters.maxDuration ?? ""}
                onChange={(e) => handleFilterChange('maxDuration', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            {/* Airline Filter */}
            {airlines.length > 0 && (
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Airlines</label>
                <div className={styles.airlineOptions}>
                  {airlines.map((airline) => (
                    <label key={airline} className={styles.airlineOption}>
                      <input
                        type="checkbox"
                        value={airline}
                        checked={filters.selectedAirlines.includes(airline)}
                        onChange={handleAirlineChange}
                      />
                      <span className={styles.checkmark}></span>
                      <span>{airline}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>

          {/* Results + Sorting + Pagination */}
          <section className={styles.resultsSection}>
            {/* Desktop Sorting Row */}
            <motion.div 
              className={styles.desktopSortRow}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div>
                <h2 className={styles.resultsTitle}>Available Flights ✈️</h2>
                <p className={styles.resultsSubtitle}>
                  {total} flights found · Refine with filters
                </p>
              </div>

              {/* Sorting */}
              <div className={styles.desktopSort}>
                <span>Sort by:</span>
                <select
                  className={styles.sortSelect}
                  onChange={handleSortChange}
                  defaultValue="price-asc"
                >
                  <option value="price-asc">Price (Low → High)</option>
                  <option value="price-desc">Price (High → Low)</option>
                  <option value="departure-asc">Departure (Early → Late)</option>
                  <option value="departure-desc">Departure (Late → Early)</option>
                  <option value="duration-asc">Duration (Short → Long)</option>
                  <option value="duration-desc">Duration (Long → Short)</option>
                </select>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && renderSkeletons()}

            {/* Error State */}
            {error && (
              <motion.div 
                className={styles.errorContainer}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className={styles.errorIcon}>⚠️</div>
                <h3 className={styles.errorTitle}>Search Error</h3>
                <p className={styles.errorMessage}>{error}</p>
              </motion.div>
            )}

            {/* No Results State */}
            {!loading && !error && flights.length === 0 && (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.emptyIcon}>✈️</div>
                <h3 className={styles.emptyTitle}>No Flights Found</h3>
                <p className={styles.emptySubtitle}>
                  Try adjusting your filters or search criteria
                </p>
                <button 
                  onClick={clearAllFilters}
                  className={styles.emptyAction}
                >
                  Clear all filters
                </button>
              </motion.div>
            )}

            {/* Results List */}
            {!loading && !error && flights.length > 0 && (
              <motion.div 
                className={styles.resultsList}
                layout
              >
                <AnimatePresence>
                  {flights.map((flight, index) => (
                    <motion.div
                      key={flight.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ 
                        duration: 0.4,
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                      <FlightCard
                        flight={flight}
                        onSelect={() => onSelectFlight(flight.id)}
                        passengers={state?.passengers || 1}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && !error && flights.length > 0 && totalPages > 1 && (
              <motion.div 
                className={styles.pagination}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                
                <div className={styles.pageNumbers}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => changePage(pageNum)}
                        className={`${styles.pageButton} ${currentPage === pageNum ? styles.active : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.paginationButton}
                >
                  Next
                </button>
              </motion.div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}