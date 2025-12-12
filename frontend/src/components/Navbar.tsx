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

  /** SCROLL EFFECT */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** CLOSE MENU ON ROUTE CHANGE */
  useEffect(() => {
    setOpenMenu(false);
    setOpenUser(false);
  }, [location]);

  /** DISABLE BODY SCROLL WHEN MENU OPEN */
  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "unset";
  }, [openMenu]);

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
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.navbarBackground} />

      <div className={styles.navbarContainer}>
        {/* BRAND */}
        <div className={styles.brand} onClick={() => navigate("/home")}>
          <span className={styles.brandIcon}>✈️</span>
          <span className={styles.brandName}>
            Flight<span className={styles.brandHighlight}>Booker</span>
          </span>
        </div>

        {/* DESKTOP NAV */}
        <div className={styles.desktopNav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              <span className={styles.navUnderline}></span>
            </NavLink>
          ))}
        </div>

        {/* USER SECTION */}
        <div className={styles.userSection}>
          {/* USER AVATAR */}
          <div className={styles.userAvatarContainer}>
            <motion.img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Nitesh"
              className={styles.userAvatar}
              onClick={() => setOpenUser(!openUser)}
              whileHover={{ scale: 1.07 }}
            />

            <AnimatePresence>
              {openUser && (
                <motion.div
                  className={styles.userDropdown}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {userMenuItems.map((item) => (
                    <button
                      key={item.label}
                      className={styles.dropdownItem}
                      onClick={() => {
                        item.action();
                        setOpenUser(false);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}

                  <div className={styles.dropdownDivider} />

                  <button
                    className={styles.dropdownItemLogout}
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className={styles.mobileMenuToggle}
            onClick={() => setOpenMenu(!openMenu)}
          >
            <div className={styles.hamburger}>
              <span className={`${styles.line} ${openMenu ? styles.line1Open : ""}`}></span>
              <span className={`${styles.line} ${openMenu ? styles.line2Open : ""}`}></span>
              <span className={`${styles.line} ${openMenu ? styles.line3Open : ""}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {openMenu && (
          <>
            {/* OVERLAY */}
            <motion.div
              className={styles.menuOverlay}
              onClick={() => setOpenMenu(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* PANEL */}
            <motion.div
              className={styles.mobileMenuPanel}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              {/* USER HEADER */}
              <div className={styles.menuHeader}>
                <img
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Nitesh"
                  className={styles.profileImage}
                />

                <div>
                  <h3 className={styles.userName}>Welcome Traveler!</h3>
                  <p className={styles.userEmail}>traveler@example.com</p>
                </div>

                <button
                  className={styles.closeButton}
                  onClick={() => setOpenMenu(false)}
                >
                  ✕
                </button>
              </div>

              {/* NAV LINKS */}
              <div className={styles.menuNavigation}>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`
                      }
                      onClick={() => setOpenMenu(false)}
                    >
                      <span className={styles.menuIcon}>{item.icon}</span>
                      <span className={styles.menuLabel}>{item.label}</span>
                      <span className={styles.menuArrow}>›</span>
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* FOOTER */}
              <div className={styles.menuFooter}>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
