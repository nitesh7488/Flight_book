import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpenMenu(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { path: "/home", label: "Home", icon: "🏠" },
    { path: "/search", label: "Search Flights", icon: "✈️" },
    { path: "/bookings", label: "Booking History", icon: "📄" },
  ];

  const userMenuItems = [
    { label: "Dashboard", action: () => navigate("/home") },
    { label: "My Bookings", action: () => navigate("/bookings") },
    { label: "Profile Settings", action: () => navigate("/profile") },
  ];

  return (
    <motion.nav 
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      {/* Background blur layer */}
      <div className={styles.navbarBackground} />

      <div className={styles.navbarContainer}>
        {/* Brand Logo */}
        <motion.div 
          className={styles.brand}
          onClick={() => navigate("/home")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={styles.brandIcon}>✈️</span>
          <span className={styles.brandName}>
            Flight<span className={styles.brandHighlight}>Booker</span>
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
              <motion.span 
                className={styles.navUnderline}
                layoutId="underline"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </NavLink>
          ))}
        </div>

        {/* User Profile & Actions */}
        <div className={styles.userSection}>
          {/* User Avatar */}
          <motion.div className={styles.userAvatarContainer}>
            <motion.img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=user&backgroundColor=b6e3f4"
              onClick={() => setOpenUser(!openUser)}
              className={styles.userAvatar}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ 
                rotate: openUser ? 360 : 0,
                transition: { duration: 0.3 }
              }}
            />
            
            {/* User Dropdown */}
            <AnimatePresence>
              {openUser && (
                <motion.div 
                  className={styles.userDropdown}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {userMenuItems.map((item) => (
                    <motion.button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setOpenUser(false);
                      }}
                      className={styles.dropdownItem}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                  <div className={styles.dropdownDivider} />
                  <motion.button
                    onClick={handleLogout}
                    className={styles.dropdownItemLogout}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <motion.button
            className={styles.mobileMenuToggle}
            onClick={() => {
              setOpenMenu(!openMenu);
              setOpenUser(false);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: openMenu ? 90 : 0 }}
          >
            <motion.div
              animate={openMenu ? "open" : "closed"}
              variants={{
                open: { rotate: 45, y: 7 },
                closed: { rotate: 0, y: 0 }
              }}
              className={styles.menuLine}
            />
            <motion.div
              animate={openMenu ? "open" : "closed"}
              variants={{
                open: { opacity: 0 },
                closed: { opacity: 1 }
              }}
              className={styles.menuLine}
            />
            <motion.div
              animate={openMenu ? "open" : "closed"}
              variants={{
                open: { rotate: -45, y: -7 },
                closed: { rotate: 0, y: 0 }
              }}
              className={styles.menuLine}
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {openMenu && (
          <>
            {/* Overlay */}
            <motion.div
              className={styles.mobileOverlay}
              onClick={() => setOpenMenu(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Mobile Menu */}
            <motion.div
              className={styles.mobileMenu}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Mobile Menu Header */}
              <div className={styles.mobileMenuHeader}>
                <div className={styles.mobileUserInfo}>
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user&backgroundColor=b6e3f4"
                    className={styles.mobileAvatar}
                    alt="User"
                  />
                  <div>
                    <p className={styles.mobileUserName}>Welcome Back!</p>
                    <p className={styles.mobileUserEmail}>traveler@example.com</p>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className={styles.mobileMenuItems}>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `${styles.mobileNavLink} ${isActive ? styles.mobileActive : ''}`
                      }
                      onClick={() => setOpenMenu(false)}
                    >
                      <span className={styles.mobileNavIcon}>{item.icon}</span>
                      <span>{item.label}</span>
                      <motion.span
                        className={styles.mobileNavIndicator}
                        layoutId="mobileIndicator"
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Menu Footer */}
              <div className={styles.mobileMenuFooter}>
                <motion.button
                  onClick={handleLogout}
                  className={styles.mobileLogoutButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}