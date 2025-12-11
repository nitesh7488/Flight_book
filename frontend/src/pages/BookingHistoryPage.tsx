import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import styles from "./BookingHistoryPage.module.css";

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
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
    return d.toLocaleString("en-US", {
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
    <div className={styles.container}>
      {/* Background Animation Elements */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.floatingCircle1}></div>
        <div className={styles.floatingCircle2}></div>
        <div className={styles.floatingCircle3}></div>
      </div>

      <div className={styles.contentWrapper}>
        {/* 🔥 Top Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
          }}
          className={styles.heroSection}
        >
          {/* Animated Badge */}
          <motion.div 
            className={styles.badge}
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
            <span className={styles.badgeText}>
              Booking history overview
            </span>
          </motion.div>

          {/* Heading + subtitle */}
          <div className={styles.heroContent}>
            <div>
              <motion.h1 
                className={styles.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your Trips & Tickets <span className={styles.emoji}>📄</span>
              </motion.h1>
              <motion.p 
                className={styles.subtitle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Track all your flight reservations, stay on top of upcoming journeys
                and revisit your past travels — all in one place.
              </motion.p>
            </div>

            {/* Mini Highlight Card */}
            <motion.div 
              className={styles.lastBookingCard}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ 
                y: -4,
                boxShadow: "0 12px 28px rgba(59, 130, 246, 0.15)"
              }}
            >
              <span className={styles.lastBookingLabel}>
                {stats.total > 0 ? "Last booking:" : "No bookings yet"}
              </span>
              {stats.total > 0 && (
                <span className={styles.lastBookingDate}>
                  {formatDateTime(bookings[0]?.createdAt)}
                </span>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* 📊 Stats Cards */}
        <div className={styles.statsContainer}>
          <motion.div 
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -6 }}
          >
            <div className={`${styles.statIcon} ${styles.totalIcon}`}>📊</div>
            <div>
              <h3 className={styles.statValue}>{stats.total}</h3>
              <p className={styles.statLabel}>Total Bookings</p>
            </div>
          </motion.div>
          
          <motion.div 
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            whileHover={{ y: -6 }}
          >
            <div className={`${styles.statIcon} ${styles.confirmedIcon}`}>✅</div>
            <div>
              <h3 className={styles.statValue}>{stats.confirmed}</h3>
              <p className={styles.statLabel}>Confirmed</p>
            </div>
          </motion.div>
          
          <motion.div 
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -6 }}
          >
            <div className={`${styles.statIcon} ${styles.pendingIcon}`}>⏳</div>
            <div>
              <h3 className={styles.statValue}>{stats.pending}</h3>
              <p className={styles.statLabel}>Pending</p>
            </div>
          </motion.div>
        </div>

        {/* ⏳ Loading State */}
        {loading && (
          <motion.div 
            className={styles.loadingContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={styles.skeletonCard}
                initial={{ opacity: 0.5 }}
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  backgroundColor: [
                    "var(--gray-100)",
                    "var(--gray-200)", 
                    "var(--gray-100)"
                  ]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        )}

        {/* 🫥 Empty State */}
        {!loading && bookings.length === 0 && (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
          >
            <motion.div 
              className={styles.emptyIcon}
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              ✈️
            </motion.div>
            <h3 className={styles.emptyTitle}>No Bookings Yet</h3>
            <p className={styles.emptySubtitle}>
              Start by searching for a flight and confirm your first booking.
            </p>
          </motion.div>
        )}

        {/* 📦 Booking Cards List */}
        {!loading && bookings.length > 0 && (
          <div className={styles.bookingsList}>
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                className={styles.bookingCard}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4,
                  delay: 0.1 + index * 0.05,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Left: Flight + passenger */}
                <div className={styles.bookingLeft}>
                  <div className={styles.timelineIndicator}>
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineLine} />
                  </div>

                  <div className={styles.bookingInfo}>
                    <div className={styles.bookingHeader}>
                      <h3 className={styles.airlineName}>
                        {booking.flight.airlineName}
                      </h3>
                      <span className={styles.flightNumber}>
                        {booking.flight.flightNumber}
                      </span>
                    </div>
                    
                    <p className={styles.route}>
                      <span className={styles.fromCity}>{booking.flight.fromCity}</span>
                      <span className={styles.routeArrow}>→</span>
                      <span className={styles.toCity}>{booking.flight.toCity}</span>
                    </p>
                    
                    <div className={styles.passengerDetails}>
                      <span className={styles.passengerLabel}>Passenger:</span>
                      <span className={styles.passengerName}>{booking.passengerName}</span>
                    </div>
                    
                    <p className={styles.bookingDate}>
                      Booked on: {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Right: id + status + departure */}
                <div className={styles.bookingRight}>
                  <p className={styles.bookingId}>
                    Booking ID <span className={styles.bookingIdValue}>#{booking.id}</span>
                  </p>

                  <motion.span 
                    className={`${styles.statusBadge} ${
                      booking.status === "CONFIRMED" 
                        ? styles.statusConfirmed 
                        : styles.statusPending
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {booking.status}
                  </motion.span>

                  <div className={styles.departureInfo}>
                    <span className={styles.departureLabel}>Departure:</span>
                    <span className={styles.departureTime}>
                      {formatDateTime(booking.flight.departureTime)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;