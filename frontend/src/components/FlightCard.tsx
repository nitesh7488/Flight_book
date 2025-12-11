import { type Flight } from "../store/flightSlice";
import { motion } from "framer-motion";
import styles from "./FlightCard.module.css";

interface Props {
  flight: Flight;
  onSelect: () => void;
  passengers?: number;
}

const FlightCard: React.FC<Props> = ({ flight, onSelect, passengers = 1 }) => {
  const departureTime = new Date(flight.departureTime);
  const arrivalTime = new Date(flight.arrivalTime);
  
  // Format time to HH:MM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }).replace('24:', '00:');
  };

  // Calculate total price
  const totalPrice = flight.price * passengers;
  
  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <motion.div 
      className={styles.flightCard}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Compact Header */}
      <div className={styles.cardHeader}>
        <div className={styles.airlineInfo}>
          <img
            src={flight.airlineLogoUrl}
            alt={flight.airlineName}
            className={styles.airlineLogo}
          />
          <div className={styles.airlineDetails}>
            <h3 className={styles.airlineName}>{flight.airlineName}</h3>
            <span className={styles.flightNumber}>{flight.flightNumber}</span>
          </div>
        </div>
        <div className={styles.statusBadge}>
          <span className={styles.statusDot}></span>
          <span>Direct</span>
        </div>
      </div>

      {/* Compact Route Timeline */}
      <div className={styles.routeSection}>
        <div className={styles.routeTimeline}>
          <div className={styles.departureInfo}>
            <span className={styles.time}>{formatTime(departureTime)}</span>
            <span className={styles.airportCode}>
              {flight.fromCity.substring(0, 3).toUpperCase()}
            </span>
          </div>

          <div className={styles.timeline}>
            <div className={styles.duration}>
              {formatDuration(flight.durationMin)}
            </div>
            <div className={styles.timelineBar}>
              <div className={styles.timelineLine}></div>
              <div className={styles.timelinePlane}>→</div>
            </div>
          </div>

          <div className={styles.arrivalInfo}>
            <span className={styles.time}>{formatTime(arrivalTime)}</span>
            <span className={styles.airportCode}>
              {flight.toCity.substring(0, 3).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Price & Action */}
      <div className={styles.actionSection}>
        <div className={styles.priceSection}>
          <div className={styles.priceDisplay}>
            <span className={styles.currency}>₹</span>
            <motion.span 
              className={styles.price}
              key={totalPrice}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {totalPrice.toLocaleString()}
            </motion.span>
          </div>
          {passengers > 1 && (
            <span className={styles.perPerson}>
              {passengers} × ₹{flight.price.toLocaleString()}
            </span>
          )}
        </div>

        <motion.button
          onClick={onSelect}
          className={styles.bookButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Select</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FlightCard;