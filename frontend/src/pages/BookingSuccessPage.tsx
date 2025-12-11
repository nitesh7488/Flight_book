import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getBookingById } from "../store/bookingSlice";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./BookingSuccessPage.module.css";

export default function BookingSuccessPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { bookingDetails, loading } = useAppSelector((s) => s.booking);

  const ticketRef = useRef<HTMLDivElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (id) {
      dispatch(getBookingById(Number(id)));
    }

    // Trigger confetti animation
    const triggerConfetti = () => {
      if (confettiCanvasRef.current) {
        const canvas = confettiCanvasRef.current;
        const myConfetti = confetti.create(canvas, {
          resize: true,
          useWorker: true,
        });

        // Multiple confetti effects
        myConfetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.3 },
        });

        setTimeout(() => {
          myConfetti({
            particleCount: 80,
            angle: 60,
            spread: 80,
            origin: { x: 0, y: 0.5 },
          });
        }, 150);

        setTimeout(() => {
          myConfetti({
            particleCount: 80,
            angle: 120,
            spread: 80,
            origin: { x: 1, y: 0.5 },
          });
        }, 300);

        setTimeout(() => {
          myConfetti({
            particleCount: 50,
            spread: 360,
            origin: { x: 0.5, y: 0.5 },
            colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
          });
        }, 500);
      }
    };

    // Delay confetti for better effect
    setTimeout(triggerConfetti, 800);

    // Cleanup
    return () => {
      if (confettiCanvasRef.current) {
        confettiCanvasRef.current.width = 0;
        confettiCanvasRef.current.height = 0;
      }
    };
  }, [id, dispatch]);

  // Download ticket as PDF
  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Boarding-Pass-${bookingDetails?.id || id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error downloading ticket. Please try again.');
    }
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 15,
      }
    }
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        delay: 0.5,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      }
    }
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      {/* Confetti Canvas */}
      <canvas 
        ref={confettiCanvasRef} 
        className={styles.confettiCanvas}
      />

      {/* Background Elements */}
      <div className={`${styles.backgroundCircle} ${styles.circle1}`}></div>
      <div className={`${styles.backgroundCircle} ${styles.circle2}`}></div>

      {/* Main Card */}
      <motion.div 
        className={styles.mainCard}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Success Icon */}
        <motion.div 
          className={styles.successIcon}
          variants={iconVariants}
        >
          <div className={styles.checkCircle}>
            <svg className={styles.checkMark} viewBox="0 0 52 52">
              <path d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div 
          className={styles.header}
          variants={itemVariants}
        >
          <h1 className={styles.title}>Booking Confirmed! 🎉</h1>
          <p className={styles.subtitle}>
            Your e-ticket has been issued successfully. Have a wonderful journey!
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loading}>
            <p className={styles.loadingText}>
              Loading booking details
              <span className={styles.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </p>
          </div>
        )}

        {/* Ticket Card */}
        {bookingDetails && (
          <motion.div 
            ref={ticketRef}
            className={styles.ticketCard}
            variants={cardVariants}
          >
            <div className={styles.ticketHeader}>
              <h2 className={styles.ticketTitle}>
                <span>✈️</span>
                Electronic Ticket
              </h2>
              <p className={styles.ticketSubtitle}>Present this at the airport</p>
            </div>

            {/* Route Display */}
            <div className={styles.routeDisplay}>
              <div className={styles.routeSection}>
                <div className={styles.routeAirport}>
                  {bookingDetails.flight.fromCity.substring(0, 3).toUpperCase()}
                </div>
                <div className={styles.routeCity}>
                  {bookingDetails.flight.fromCity}
                </div>
              </div>

              <div className={styles.routeArrow}>→</div>

              <div className={styles.routeSection}>
                <div className={styles.routeAirport}>
                  {bookingDetails.flight.toCity.substring(0, 3).toUpperCase()}
                </div>
                <div className={styles.routeCity}>
                  {bookingDetails.flight.toCity}
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className={styles.ticketDetails}>
              <motion.div 
                className={styles.detailRow}
                variants={itemVariants}
                custom={0}
              >
                <span className={styles.detailLabel}>Booking ID</span>
                <span className={`${styles.detailValue} ${styles.bookingId}`}>
                  #{bookingDetails.id}
                </span>
              </motion.div>

              <motion.div 
                className={styles.detailRow}
                variants={itemVariants}
                custom={1}
              >
                <span className={styles.detailLabel}>Passenger</span>
                <span className={styles.detailValue}>
                  {bookingDetails.passengerName}
                </span>
              </motion.div>

              <motion.div 
                className={styles.detailRow}
                variants={itemVariants}
                custom={2}
              >
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>
                  {bookingDetails.passengerEmail}
                </span>
              </motion.div>

              <motion.div 
                className={styles.detailRow}
                variants={itemVariants}
                custom={3}
              >
                <span className={styles.detailLabel}>Flight</span>
                <span className={styles.detailValue}>
                  {bookingDetails.flight.airlineName} • {bookingDetails.flight.flightNumber}
                </span>
              </motion.div>

              <motion.div 
                className={styles.detailRow}
                variants={itemVariants}
                custom={4}
              >
                <span className={styles.detailLabel}>Departure</span>
                <span className={styles.detailValue}>
                  {formatDateTime(bookingDetails.flight.departureTime)}
                </span>
              </motion.div>

              <motion.div 
                className={styles.detailRow}
                variants={itemVariants}
                custom={5}
              >
                <span className={styles.detailLabel}>Passengers</span>
                <span className={styles.detailValue}>
                  {bookingDetails.passengers} Person{bookingDetails.passengers > 1 ? 's' : ''}
                </span>
              </motion.div>

              {bookingDetails.totalAmount && (
                <motion.div 
                  className={styles.detailRow}
                  variants={itemVariants}
                  custom={6}
                >
                  <span className={styles.detailLabel}>Total Amount</span>
                  <span className={`${styles.detailValue} ${styles.amount}`}>
                    ₹{bookingDetails.totalAmount.toLocaleString()}
                  </span>
                </motion.div>
              )}

              {bookingDetails.bookingDate && (
                <motion.div 
                  className={styles.detailRow}
                  variants={itemVariants}
                  custom={7}
                >
                  <span className={styles.detailLabel}>Booking Date</span>
                  <span className={styles.detailValue}>
                    {formatDateTime(bookingDetails.bookingDate)}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div 
          className={styles.buttonsContainer}
          variants={itemVariants}
          custom={8}
        >
          <motion.button
            onClick={downloadTicket}
            className={`${styles.button} ${styles.successButton}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!bookingDetails}
          >
            <span className={styles.buttonIcon}>📄</span>
            <span>Download Ticket</span>
          </motion.button>

          <motion.button
            onClick={() => navigate("/search")}
            className={`${styles.button} ${styles.primaryButton}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.buttonIcon}>✈️</span>
            <span>Book Another Flight</span>
          </motion.button>

          <motion.button
            onClick={() => navigate("/")}
            className={`${styles.button} ${styles.secondaryButton}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.buttonIcon}>🏠</span>
            <span>Go to Home</span>
          </motion.button>
        </motion.div>

        {/* Additional Information */}
        <motion.p 
          className={styles.subtitle}
          variants={itemVariants}
          custom={9}
          style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}
        >
          Your booking confirmation has been sent to your email. 
          Please arrive at the airport at least 2 hours before departure.
        </motion.p>
      </motion.div>
    </div>
  );
}