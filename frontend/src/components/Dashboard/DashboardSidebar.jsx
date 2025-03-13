import { useState } from "react";
import {
  Home,
  Users,
  MapPin,
  BookOpen,
  Bell,
  LogOut,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  Mail, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Home", icon: Home, url: "/dashboard" },
  { title: "Emergency Contacts", icon: Users, url: "/contacts" },
  { title: "Safety Check-ins", icon: MapPin, url: "/checkins" },
  // { title: "Safety Journal", icon: BookOpen, url: "/journal" },
  { title: "SOS Alerts", icon: Bell, url: "/alerts" },
  {title: "Email Breach", icon: ShieldAlert, url: "/email-breach"},
  { title: "Profile", icon: UserCircle, url: "/profile" },
];

const DashboardSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // For desktop sidebar
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile sidebar

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSignOut = () => {
    alert("Signing out..."); // Replace with actual sign-out logic
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? "90px" : "256px" }}
        transition={{ duration: 0.2 }}
        className="hidden md:block relative h-screen"
        style={{ overflow: "hidden", position: "relative" }}
      >
        <motion.div
          initial={false}
          animate={{ width: isCollapsed ? "90px" : "256px" }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-gradient-to-b from-white to-neutral-50 border-r border-neutral-200"
        />
        <Sidebar className="p-0 relative z-10 h-full flex flex-col">
          <SidebarContent>
            <div className="flex items-center gap-2 px-4 py-6 border-b border-neutral-200">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">N</span>
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                  >
                    NeoAegis
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel className="text-neutral-500 font-medium px-4 py-2">
                {!isCollapsed && "Menu"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-primary font-semibold transition-colors rounded-lg hover:bg-neutral-400"
                        >
                          <item.icon className="w-6 h-6" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          {/* Sign Out Button */}
          <div className="mt-auto px-4 py-6 font-semibold">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 text-neutral-600 hover:text-red-600 transition-colors w-full rounded-lg hover:bg-neutral-400 px-4 py-3 group"
            >
              <LogOut className="w-6 h-6 text-neutral-600 group-hover:text-red-600" />
              {!isCollapsed && (
                <span className="font-semibold">Sign Out</span>
              )}
            </button>
          </div>
        </Sidebar>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute me-6 -right-6 top-8 w-7 h-7 bg-white border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-50 shadow-sm z-50"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </motion.div>

      {/* Mobile Sidebar */}
      <div className="block md:hidden">
        {/* Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        >
          <Menu className="w-6 h-6 text-gray-800" />
        </button>

        {/* Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Sliding Sidebar */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isMobileMenuOpen ? "0%" : "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col"
        >
          <h1 className="text-2xl mt-10 mb-4 font-semibold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">NeoAegis</h1>
          <ul className="flex flex-col p-4 space-y-4 text-lg font-semibold text-neutral-600 flex-grow">
            {menuItems.map((item) => (
              <li
                key={item.title}
                className="hover:bg-neutral-600 hover:text-primary p-2 rounded-lg"
              >
                <a href={item.url} className="flex items-center gap-3">
                  <item.icon className="w-6 h-6" />
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
          {/* Mobile Sign Out Button */}
          <div className="p-4 border-t border-neutral-200">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 text-neutral-600 hover:text-red-500 transition-colors w-full rounded-lg hover:bg-neutral-100 px-4 py-3 group"
            >
              <LogOut className="w-6 h-6 text-neutral-600 group-hover:text-red-500" />
              <span className="font-semibold">Sign Out</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
