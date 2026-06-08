import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); 

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-4 py-3">
     
      <div className="flex items-center justify-between">

        
        <span
          className="text-xl font-bold text-white cursor-pointer"
          onClick={() => window.location.reload()}
        >
          🎯 PlacementTracker
        </span>

       
        <div className="hidden md:flex gap-2">
          <Link
            to="/dsa"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive("/dsa")
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            DSA Problems
          </Link>
          <Link
            to="/jobs"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive("/jobs")
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Job Applications
          </Link>
        </div>

        
        <div className="hidden md:flex items-center gap-3">
          <span className="text-slate-400 text-sm">Hi, {user?.name}</span>
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition"
          >
            Logout
          </button>
        </div>

        
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
        >
          {menuOpen ? (
          
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      
      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-2 border-t border-slate-700 pt-3">
          <Link
            to="/dsa"
            onClick={() => setMenuOpen(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive("/dsa")
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            DSA Problems
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMenuOpen(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive("/jobs")
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Job Applications
          </Link>

      
          <div className="flex items-center justify-between pt-2 border-t border-slate-700 mt-1">
            <span className="text-slate-400 text-sm">Hi, {user?.name}</span>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;