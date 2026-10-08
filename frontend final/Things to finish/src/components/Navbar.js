import { Link } from "react-router-dom";
import { FiHome, FiUpload, FiSearch, FiUser, FiUsers, FiLogOut, FiBookmark } from "react-icons/fi";

const Navbar = () => {
  // Get user from localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <nav className="bg-white/80 dark:bg-slate-900 shadow-lg border-b border-amber-200/50 mb-6 backdrop-blur-md sticky top-0 z-[100]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center text-left">

          {/* Logo - Abyssinia DL */}
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:rotate-3">
                <span className="text-white font-bold text-xl">AD</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-tighter leading-none">
                  Abyssinia
                </h1>
                <p className="text-[9px] font-medium text-amber-600 uppercase tracking-widest mt-1">
                  Digital Learning Hub
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links - Simplified & No Bold/Italic */}
          <div className="flex items-center space-x-8">

            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-[10px] font-semibold text-gray-500 hover:text-amber-600 uppercase tracking-widest transition-colors"
            >
              <FiHome size={16} /> Dashboard
            </Link>

            <Link
              to="/search"
              className="flex items-center gap-2 text-[10px] font-semibold text-gray-500 hover:text-amber-600 uppercase tracking-widest transition-colors"
            >
              <FiSearch size={16} /> Search
            </Link>

            <Link
              to="/bookmarks"
              className="flex items-center gap-2 text-[10px] font-semibold text-gray-500 hover:text-amber-600 uppercase tracking-widest transition-colors"
            >
              <FiBookmark size={16} /> Bookmarks
            </Link>

            {/* STRICT ROLE CHECK: Only Contributors see Upload */}
            {user.role === "contributor" && (
              <Link
                to="/upload"
                className="flex items-center gap-2 text-[10px] font-bold text-amber-600 hover:text-amber-700 uppercase tracking-widest transition-colors"
                title="Contribute Content"
              >
                <FiUpload size={16} /> Upload
              </Link>
            )}

            {/* STRICT ROLE CHECK: Only Admins/Researchers see Admin Panel */}
            {(user.role === "admin" || user.role === "researcher") && (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-[10px] font-semibold text-gray-500 hover:text-amber-600 uppercase tracking-widest transition-colors"
              >
                <FiUsers size={16} /> Admin
              </Link>
            )}

            <Link
              to="/profile"
              className="flex items-center gap-2 text-[10px] font-semibold text-gray-500 hover:text-amber-600 uppercase tracking-widest transition-colors"
            >
              <FiUser size={16} /> Profile
            </Link>

            {/* User Role Badge */}
            <div className="px-3 py-1 bg-amber-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-sm">
              {user.role === 'admin' ? 'Admin' : (user.role === 'contributor' || user.role === 'researcher') ? 'Teacher' : user.role === 'system_admin' ? 'System Admin' : 'Student'}
            </div>

            {/* Logout Button */}
            <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] font-semibold text-gray-400 hover:text-red-600 uppercase tracking-widest transition-colors">
              <FiLogOut size={16} /> Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
