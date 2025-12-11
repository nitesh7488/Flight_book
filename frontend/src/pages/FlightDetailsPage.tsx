import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createBooking } from "../store/bookingSlice";
import styles from "./FlightDetailsPage.module.css";

const FlightDetailsPage = () => {
  const { selectedFlight, passengers } = useAppSelector((s) => s.flights);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!selectedFlight) {
    navigate("/results");
    return null;
  }

  // Format times
  const dep = new Date(selectedFlight.departureTime);
  const arr = new Date(selectedFlight.arrivalTime);

  // Calculate total fare
  const baseFare = selectedFlight.price * passengers;
  const tax = baseFare * 0.18; // 18% GST
  const convenienceFee = 99;
  const totalFare = baseFare + tax + convenienceFee;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const bookingData = {
        flightId: selectedFlight.id,
        passengers,
        passengerName: name,
        passengerEmail: email,
        passengerPhone: phone, // This will now work
      };

      const action = await dispatch(createBooking(bookingData));

      if (action.meta.requestStatus === "fulfilled") {
        navigate(`/booking-success/${action.payload.id}`);
      }
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format time to 12-hour format
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get airline logo text (fallback if no logo URL)
  const getAirlineLogoText = (airlineName: string) => {
    return airlineName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get airport code from city name
  const getAirportCode = (city: string) => {
    return city.substring(0, 3).toUpperCase();
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const flightVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        delay: 0.2
      }
    }
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        delay: 0.3
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Elements */}
      <div className={`${styles.backgroundCircle} ${styles.circle1}`}></div>
      <div className={`${styles.backgroundCircle} ${styles.circle2}`}></div>

      <div className={styles.mainContainer}>
        {/* Header */}
        <motion.div 
          className={styles.header}
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.badge}>
            <div className={styles.badgeDot}></div>
            <span>Flight Details & Booking</span>
          </div>
          
          <h1 className={styles.title}>
            <span className={styles.titleEmoji}>🛫</span>
            Confirm Your Flight
          </h1>
          
          <p className={styles.subtitle}>
            Review your flight details and complete the booking process
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className={styles.mainGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Flight Details */}
          <motion.div 
            className={styles.flightSummary}
            variants={flightVariants}
          >
            {/* Flight Card */}
            <div className={styles.flightCard}>
              {/* Flight Header */}
              <div className={styles.flightHeader}>
                <div className={styles.airlineInfo}>
                  <div className={styles.airlineLogo}>
                    {selectedFlight.airlineLogoUrl ? (
                      <img
                        src={selectedFlight.airlineLogoUrl}
                        alt={selectedFlight.airlineName}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.textContent = getAirlineLogoText(selectedFlight.airlineName);
                        }}
                      />
                    ) : (
                      getAirlineLogoText(selectedFlight.airlineName)
                    )}
                  </div>
                  <div className={styles.airlineDetails}>
                    <div className={styles.airlineName}>{selectedFlight.airlineName}</div>
                    <div className={styles.flightNumber}>Flight {selectedFlight.flightNumber}</div>
                  </div>
                </div>
                
                <div className={styles.priceBadge}>
                  <span>₹{totalFare.toLocaleString()}</span>
                  <div className={styles.passengerCount}>
                    <span>👤</span>
                    <span>{passengers} Passenger{passengers > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Flight Route */}
              <div className={styles.flightRoute}>
                {/* Departure */}
                <div className={styles.routeSection}>
                  <div className={styles.routeLabel}>Departure</div>
                  <div className={styles.airportCode}>
                    {getAirportCode(selectedFlight.fromCity)}
                  </div>
                  <div className={styles.cityName}>{selectedFlight.fromCity}</div>
                  <div className={styles.time}>{formatTime(dep)}</div>
                  <div className={styles.date}>{formatDate(dep)}</div>
                </div>

                {/* Route Center */}
                <div className={styles.routeCenter}>
                  <div className={styles.routeArrow}>→</div>
                  <div className={styles.duration}>{selectedFlight.durationMin} min</div>
                  <div className={styles.durationBar}>
                    <div className={styles.durationFill}></div>
                  </div>
                </div>

                {/* Arrival */}
                <div className={styles.routeSection}>
                  <div className={styles.routeLabel}>Arrival</div>
                  <div className={styles.airportCode}>
                    {getAirportCode(selectedFlight.toCity)}
                  </div>
                  <div className={styles.cityName}>{selectedFlight.toCity}</div>
                  <div className={styles.time}>{formatTime(arr)}</div>
                  <div className={styles.date}>{formatDate(arr)}</div>
                </div>
              </div>

              {/* Flight Details */}
              <div className={styles.flightDetails}>
                <div className={styles.detailCard}>
                  <div className={styles.detailLabel}>Duration</div>
                  <div className={styles.detailValue}>
                    <span className={styles.detailIcon}>⏱️</span>
                    {selectedFlight.durationMin} minutes
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.detailLabel}>Price per Person</div>
                  <div className={styles.detailValue}>
                    <span className={styles.detailIcon}>💰</span>
                    ₹{selectedFlight.price.toLocaleString()}
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.detailLabel}>Flight Number</div>
                  <div className={styles.detailValue}>
                    <span className={styles.detailIcon}>✈️</span>
                    {selectedFlight.flightNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <motion.button
              onClick={() => navigate("/results")}
              className={styles.backButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>←</span>
              <span>Back to Results</span>
            </motion.button>
          </motion.div>

          {/* Right Column - Passenger Form */}
          <motion.form
            onSubmit={handleSubmit}
            className={`${styles.passengerForm} ${isLoading ? styles.loading : ''}`}
            variants={formVariants}
          >
            <h2 className={styles.formHeader}>
              <span className={styles.formIcon}>👤</span>
              Passenger Details
            </h2>

            {/* Name */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>👤</span>
                Full Name
              </label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>📧</span>
                Email Address
              </label>
              <input
                type="email"
                className={styles.formInput}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>📱</span>
                Phone Number
              </label>
              <input
                type="tel"
                className={styles.formInput}
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Passengers Info */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>👥</span>
                Passengers
              </label>
              <div className={styles.formInput} style={{ backgroundColor: 'var(--gray-50)' }}>
                <strong>{passengers}</strong> passenger{passengers > 1 ? 's' : ''}
              </div>
            </div>

            {/* Price Summary */}
            <div className={styles.priceSummary}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Base Fare ({passengers} × ₹{selectedFlight.price.toLocaleString()})</span>
                <span className={styles.priceValue}>₹{baseFare.toLocaleString()}</span>
              </div>
              
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Taxes & Fees (18%)</span>
                <span className={styles.priceValue}>₹{tax.toFixed(0)}</span>
              </div>
              
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Convenience Fee</span>
                <span className={styles.priceValue}>₹{convenienceFee}</span>
              </div>
              
              <div className={`${styles.priceRow} ${styles.total}`}>
                <span className={styles.priceLabel}>Total Amount</span>
                <span className={styles.priceValue}>₹{totalFare.toLocaleString()}</span>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  required 
                  style={{ 
                    width: '1rem', 
                    height: '1rem',
                    accentColor: 'var(--primary)',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  I agree to the <strong style={{ color: 'var(--primary)' }}>Terms & Conditions</strong> and <strong style={{ color: 'var(--primary)' }}>Privacy Policy</strong>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={styles.buttonIcon}>✈️</span>
              <span>{isLoading ? "Processing..." : "Confirm Booking"}</span>
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default FlightDetailsPage;