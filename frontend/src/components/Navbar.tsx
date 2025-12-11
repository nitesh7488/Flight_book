import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";
import { HiOutlineMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItem =
    "relative px-2 py-1 text-[15px] font-medium text-slate-600 hover:text-blue-600 transition after:absolute after:left-0 after:bottom-[-3px] after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-600 after:transition-[width] after:duration-300";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl shadow-sm z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Brand */}
        <div
          className="text-[22px] font-bold text-blue-600 tracking-wide cursor-pointer hover:scale-[1.05] transition"
          onClick={() => navigate("/home")}
        >
          ✈ Flight<span className="text-slate-900">Booker</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          <NavLink className={({ isActive }) => `${navItem} ${isActive ? "text-blue-600 after:w-full" : ""}`} to="/home">Home</NavLink>
          <NavLink className={({ isActive }) => `${navItem} ${isActive ? "text-blue-600 after:w-full" : ""}`} to="/search">Search Flights</NavLink>
          <NavLink className={({ isActive }) => `${navItem} ${isActive ? "text-blue-600 after:w-full" : ""}`} to="/bookings">Booking History</NavLink>
        </div>

        {/* Avatar — Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
              onClick={() => { setOpenUser(!openUser); setOpenMenu(false); }}
              className="w-9 h-9 rounded-full border-2 border-blue-500 cursor-pointer object-cover bg-slate-200 hover:ring-2 hover:ring-blue-300 transition"
            />
            {openUser && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border overflow-hidden animate-fade-down z-50">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                  onClick={() => { navigate("/home"); setOpenUser(false); }}>
                  Dashboard
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                  onClick={() => { navigate("/bookings"); setOpenUser(false); }}>
                  My Bookings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                  onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden relative z-[1001] text-base font-light"
          onClick={() => {
          setOpenMenu(!openMenu);
          setOpenUser(false);
           }}
        >
                {openMenu ? "✖" : "☰"}

        </button>

      </div>

      {/* Mobile Drawer */}
      {openMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998]"
            onClick={() => setOpenMenu(false)}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-[999] p-6 flex flex-col gap-6 animate-slide-left">
            <div className="flex flex-col gap-4 text-[16px] font-semibold">
              <NavLink to="/home" onClick={() => setOpenMenu(false)} className="hover:text-blue-600">🏠 Home</NavLink>
              <NavLink to="/search" onClick={() => setOpenMenu(false)} className="hover:text-blue-600">✈ Search Flights</NavLink>
              <NavLink to="/bookings" onClick={() => setOpenMenu(false)} className="hover:text-blue-600">📄 Booking History</NavLink>

              <button
                onClick={handleLogout}
                className="text-red-600 mt-2 border border-red-500 rounded px-3 py-2 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
