import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Calendar, Users, MapPin, ChevronRight } from "lucide-react";
import styles from "./SearchPage.module.css";

export default function SearchPage() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("Delhi (DEL)");
  const [to, setTo] = useState("Mumbai (BOM)");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [travelClass, setTravelClass] = useState<"economy" | "premium" | "business" | "first">("economy");
  const [isLoading, setIsLoading] = useState(false);
  const [swapAnimating, setSwapAnimating] = useState(false);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  const popularDestinations = [
    { code: "DEL", name: "Delhi", emoji: "🏛️", color: "#3b82f6" },
    { code: "BOM", name: "Mumbai", emoji: "🌊", color: "#10b981" },
    { code: "BLR", name: "Bangalore", emoji: "💻", color: "#8b5cf6" },
    { code: "CCU", name: "Kolkata", emoji: "🌉", color: "#f59e0b" },
    { code: "MAA", name: "Chennai", emoji: "🌴", color: "#ec4899" },
    { code: "HYD", name: "Hyderabad", emoji: "💎", color: "#06b6d4" }
  ];

  const handlePassengerChange = (change: number) => {
    const newValue = passengers + change;
    if (newValue >= 1 && newValue <= 9) {
      setPassengers(newValue);
    }
  };

  const handleQuickSelect = (city: string, type: 'from' | 'to') => {
    if (type === 'from') setFrom(city);
    else setTo(city);
  };

  const handleSwapDestinations = () => {
    setSwapAnimating(true);
    const temp = from;
    setFrom(to);
    setTo(temp);
    setTimeout(() => setSwapAnimating(false), 300);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    navigate("/results", { 
      state: { 
        from: from.split(" (")[0], // Extract city name
        to: to.split(" (")[0],
        date, 
        passengers,
        tripType,
        travelClass
      } 
    });
    
    setIsLoading(false);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const travelClasses = [
    { id: "economy" as const, label: "Economy", emoji: "💺", description: "Standard comfort" },
    { id: "premium" as const, label: "Premium", emoji: "🛋️", description: "Extra legroom" },
    { id: "business" as const, label: "Business", emoji: "✨", description: "Luxury service" },
    { id: "first" as const, label: "First Class", emoji: "👑", description: "Ultimate luxury" }
  ];

  return (
    <div className={styles.container}>
      {/* Animated Background Elements */}
      <div className={styles.backgroundAnimation}>
        <motion.div 
          className={styles.floatingCloud1}
          animate={{ 
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className={styles.floatingCloud2}
          animate={{ 
            x: [0, -15, 0],
            y: [0, 10, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
      </div>

      {/* Header Section */}
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div 
          className={styles.headerBadge}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.span 
            className={styles.badgeDot}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <span className={styles.badgeText}>Find Your Perfect Flight</span>
        </motion.div>

        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Discover Amazing <span className={styles.titleHighlight}>Destinations</span> ✈️
        </motion.h1>
        
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Choose your destination, pick dates, and find the best flights with our smart search.
        </motion.p>
      </motion.div>

      {/* Main Form Container */}
      <motion.div 
        className={styles.formContainer}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          className={`${styles.form} ${isLoading ? styles.loading : ''}`}
          whileHover={{ boxShadow: "0 32px 80px -24px rgba(59, 130, 246, 0.2)" }}
        >
          {/* Trip Type Toggle */}
          <div className={styles.tripTypeToggle}>
            {["one-way", "round-trip"].map((type) => (
              <motion.button
                key={type}
                type="button"
                className={`${styles.tripTypeButton} ${tripType === type ? styles.active : ''}`}
                onClick={() => setTripType(type as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                {type === "one-way" ? "One Way" : "Round Trip"}
              </motion.button>
            ))}
          </div>

          {/* Destination Inputs */}
          <div className={styles.destinationSection}>
            {/* From Input */}
            <motion.div 
              className={styles.inputGroup}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className={styles.inputLabel}>
                <MapPin size={18} />
                <span>From</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className={styles.input}
                  placeholder="Departure city or airport"
                  required
                />
                <motion.div 
                  className={styles.inputDecoration}
                  animate={{ backgroundColor: swapAnimating ? "#10b981" : "#3b82f6" }}
                />
              </div>
            </motion.div>

            {/* Swap Button */}
            <motion.div 
              className={styles.swapContainer}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 }}
            >
              <motion.button
                type="button"
                className={styles.swapButton}
                onClick={handleSwapDestinations}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: swapAnimating ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>

            {/* To Input */}
            <motion.div 
              className={styles.inputGroup}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className={styles.inputLabel}>
                <MapPin size={18} />
                <span>To</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className={styles.input}
                  placeholder="Destination city or airport"
                  required
                />
                <motion.div 
                  className={styles.inputDecoration}
                  animate={{ backgroundColor: swapAnimating ? "#3b82f6" : "#10b981" }}
                />
              </div>
            </motion.div>
          </div>

          {/* Quick Destinations */}
          <motion.div 
            className={styles.quickDestinations}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className={styles.quickDestinationsLabel}>Popular Destinations:</p>
            <div className={styles.quickDestinationsGrid}>
              {popularDestinations.map((city, index) => (
                <motion.button
                  key={city.code}
                  type="button"
                  className={styles.quickButton}
                  onClick={() => handleQuickSelect(`${city.name} (${city.code})`, 'to')}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -4,
                    backgroundColor: city.color + "20"
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    borderColor: city.color + "40",
                    color: city.color 
                  }}
                >
                  <span className={styles.quickButtonEmoji}>{city.emoji}</span>
                  <span className={styles.quickButtonText}>{city.name}</span>
                  <span className={styles.quickButtonCode}>{city.code}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Date & Passengers Row */}
          <div className={styles.datePassengersRow}>
            {/* Date Input */}
            <motion.div 
              className={styles.inputGroup}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className={styles.inputLabel}>
                <Calendar size={18} />
                <span>Travel Date</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={styles.dateInput}
                  min={minDate}
                  required
                />
                <div className={styles.inputDecoration} />
              </div>
            </motion.div>

            {/* Passengers Input */}
            <motion.div 
              className={styles.inputGroup}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
            >
              <label className={styles.inputLabel}>
                <Users size={18} />
                <span>Passengers</span>
              </label>
              <div className={styles.passengersWrapper}>
                <div className={styles.passengersDisplay}>
                  <motion.span 
                    className={styles.passengersCount}
                    key={passengers}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {passengers}
                  </motion.span>
                  <span className={styles.passengersLabel}>
                    {passengers === 1 ? 'Passenger' : 'Passengers'}
                  </span>
                </div>
                <div className={styles.passengersControls}>
                  <motion.button
                    type="button"
                    className={styles.passengerButton}
                    onClick={() => handlePassengerChange(-1)}
                    disabled={passengers <= 1}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    -
                  </motion.button>
                  <motion.button
                    type="button"
                    className={styles.passengerButton}
                    onClick={() => handlePassengerChange(1)}
                    disabled={passengers >= 9}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    +
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Travel Class Selection */}
          <motion.div 
            className={styles.classSelection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <p className={styles.classSelectionLabel}>Travel Class:</p>
            <div className={styles.classButtons}>
              {travelClasses.map((cls, index) => (
                <motion.button
                  key={cls.id}
                  type="button"
                  className={`${styles.classButton} ${travelClass === cls.id ? styles.active : ''}`}
                  onClick={() => setTravelClass(cls.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.classEmoji}>{cls.emoji}</span>
                  <div className={styles.classInfo}>
                    <span className={styles.classLabel}>{cls.label}</span>
                    <span className={styles.classDescription}>{cls.description}</span>
                  </div>
                  <AnimatePresence>
                    {travelClass === cls.id && (
                      <motion.div 
                        className={styles.classCheckmark}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 60px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  className={styles.loadingSpinner}
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 180 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ✈️
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  key="search"
                  className={styles.submitContent}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Plane size={20} />
                  <span>Search Flights</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}