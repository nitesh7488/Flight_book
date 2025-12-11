import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion"; // Type-only import
import styles from "./HomePage.module.css";

export default function HomePage() {
  // Define proper variants with TypeScript types
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  const buttonVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const statVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring" as const,
        stiffness: 150
      }
    }),
    hover: {
      y: -10,
      transition: {
        type: "spring" as const,
        stiffness: 300
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Animated Background Circles */}
      <div className={`${styles.backgroundCircle} ${styles.circle1}`}></div>
      <div className={`${styles.backgroundCircle} ${styles.circle2}`}></div>
      <div className={`${styles.backgroundCircle} ${styles.circle3}`}></div>

      {/* Animated Clouds */}
      <div className={`${styles.cloud} ${styles.cloud1}`}></div>
      <div className={`${styles.cloud} ${styles.cloud2}`}></div>
      <div className={`${styles.cloud} ${styles.cloud3}`}></div>

      {/* Flying Plane */}
      <motion.div 
        className={styles.planeContainer}
        initial={{ x: -100 }}
        animate={{ x: "100vw" }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg className={styles.plane} viewBox="0 0 24 24" fill="none">
          <path d="M10 9L3 12L10 15L12 21L15 12L21 9L15 6L12 3L10 9Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1"/>
        </svg>
      </motion.div>

      <motion.div 
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div className={styles.header} variants={itemVariants}>
          <h1 className={styles.title}>
            Your Journey Begins Here 
            <span className={styles.titleEmoji}>✈</span>
          </h1>
          <p className={styles.subtitle}>
            Fast • Simple • Secure — Book your next flight effortlessly
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div className={styles.statsContainer}>
          {[
            { value: "50K+", label: "Happy Travelers" },
            { value: "200+", label: "Destinations" },
            { value: "24/7", label: "Support" },
            { value: "99%", label: "Satisfaction" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={styles.statCard}
              variants={statVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Buttons */}
        <motion.div className={styles.buttonsContainer}>
          <motion.div 
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/search"
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              <span>🔍</span>
              <span>Search Flights</span>
            </Link>
          </motion.div>

          <motion.div 
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/bookings"
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              <span>📄</span>
              <span>Your Bookings</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div className={styles.featuresContainer}>
          {[
            {
              icon: "⚡",
              title: "Lightning Fast",
              description: "Find and book flights in under 60 seconds with our optimized search engine."
            },
            {
              icon: "🔒",
              title: "Secure & Safe",
              description: "Bank-level security for all transactions. Your data is always protected."
            },
            {
              icon: "💸",
              title: "Best Prices",
              description: "We compare prices across 500+ airlines to ensure you get the best deal."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={styles.featureCard}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -10 }}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div 
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className={styles.footerText}>
            Made with <span className={styles.heart}>❤️</span> for smooth flight booking experience
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}