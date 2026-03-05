import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Home, Users, MapPin, Bell, LogOut,
  UserCircle, ChevronLeft, ChevronRight,
  Menu, ShieldAlert, X,
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { title: "Home",               icon: Home,        url: "/dashboard"    },
  { title: "Emergency Contacts", icon: Users,       url: "/contacts"     },
  { title: "Safety Check-ins",   icon: MapPin,      url: "/checkins"     },
  { title: "SOS Alerts",         icon: Bell,        url: "/alerts"       },
  { title: "Email Breach",       icon: ShieldAlert, url: "/email-breach" },
  { title: "Profile",            icon: UserCircle,  url: "/profile"      },
];

function getNavClass(active) {
  if (active) {
    return "flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-150 bg-primary/10 text-primary";
  }
  return "flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-150 text-neutral-600 hover:bg-neutral-100 hover:text-primary";
}

function getIconClass(active) {
  if (active) return "w-5 h-5 flex-shrink-0 text-primary";
  return "w-5 h-5 flex-shrink-0 text-neutral-500";
}

function getMobileNavClass(active) {
  if (active) {
    return "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 bg-primary/10 text-primary";
  }
  return "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 text-neutral-600 hover:bg-neutral-100 hover:text-primary";
}

const ToggleButton = ({ onClick, isCollapsed }) => (
  <button
    onClick={onClick}
    className="w-7 h-7 min-w-[28px] rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md hover:scale-110 transition-all duration-150 flex-shrink-0"
  >
    {isCollapsed
      ? <ChevronRight className="w-3.5 h-3.5 text-white" />
      : <ChevronLeft  className="w-3.5 h-3.5 text-white" />
    }
  </button>
);

const DashboardSidebar = () => {
  const [isCollapsed,      setIsCollapsed]      = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    navigate("/sign-in");
  };

  const closeMobile   = () => setIsMobileMenuOpen(false);
  const openMobile    = () => setIsMobileMenuOpen(true);
  const toggleDesktop = () => setIsCollapsed(!isCollapsed);

  return (
    <div>

      {/* ══════════════════════════════════════
          DESKTOP SIDEBAR
      ══════════════════════════════════════ */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? "72px" : "256px" }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col sticky top-0 h-screen flex-shrink-0 border-r border-neutral-200 bg-white overflow-hidden"
      >

        {/* ── EXPANDED header: logo + name on left, toggle on right ── */}
        {!isCollapsed && (
          <div className="flex items-center justify-between px-4 py-5 border-b border-neutral-200 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 min-w-[40px] bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent whitespace-nowrap overflow-hidden">
                NeoAegis
              </span>
            </div>
            <ToggleButton onClick={toggleDesktop} isCollapsed={isCollapsed} />
          </div>
        )}

        {/* ── COLLAPSED header: N logo centered, toggle below it ── */}
        {isCollapsed && (
          <div className="flex flex-col items-center gap-3 py-4 border-b border-neutral-200 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <ToggleButton onClick={toggleDesktop} isCollapsed={isCollapsed} />
          </div>
        )}

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3">
          {!isCollapsed && (
            <p className="px-4 pb-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Menu
            </p>
          )}
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => {
              const { title, url, icon: Icon } = item;
              const active = location.pathname === url;
              const navClass = getNavClass(active);
              const iconClass = getIconClass(active);
              return (
                <Link key={title} to={url} className={navClass}>
                  <Icon className={iconClass} />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden">
                      {title}
                    </span>
                  )}
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sign out */}
        <div className="flex-shrink-0 px-2 py-4 border-t border-neutral-200">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-semibold text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-neutral-500" />
            {!isCollapsed && (
              <span className="whitespace-nowrap">Sign Out</span>
            )}
          </button>
        </div>

      </motion.div>

      {/* ══════════════════════════════════════
          MOBILE SIDEBAR
      ══════════════════════════════════════ */}
      <div className="md:hidden">

        {/* Hamburger */}
        <button
          onClick={openMobile}
          className="fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md border border-neutral-200"
        >
          <Menu className="w-5 h-5 text-neutral-700" />
        </button>

        {/* Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeMobile}
          />
        )}

        {/* Sliding panel */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isMobileMenuOpen ? "0%" : "-100%" }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col"
        >
          {/* Mobile header */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NeoAegis
              </span>
            </div>
            <button
              onClick={closeMobile}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>

          {/* Mobile nav */}
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {menuItems.map((item) => {
              const { title, url, icon: Icon } = item;
              const active = location.pathname === url;
              const navClass = getMobileNavClass(active);
              const iconClass = getIconClass(active);
              return (
                <Link key={title} to={url} onClick={closeMobile} className={navClass}>
                  <Icon className={iconClass} />
                  <span>{title}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile sign out */}
          <div className="flex-shrink-0 px-2 py-4 border-t border-neutral-200">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-semibold text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
            >
              <LogOut className="w-5 h-5 flex-shrink-0 text-neutral-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default DashboardSidebar;