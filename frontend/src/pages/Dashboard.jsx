import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract query parameters from URL
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const authSuccess = params.get("authSuccess");
    const token=params.get('token')


    if (userId) {
      // Store userId in session storage
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("token",token)

      // Display toast for Google authentication success if applicable
      if (authSuccess === "true") {
        toast.success("Google Authentication Successful!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }

      // Clear query parameters from URL for better UX
      window.history.replaceState({}, document.title, "/dashboard");
    } else if (!sessionStorage.getItem("userId")) {
      // Redirect to login if no session or query parameter exists
      navigate("/sign-in");
    }
  }, [navigate]);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#4A4848]/5 to-secondary/5">
        <DashboardSidebar className="w-full md:w-1/4" />
        <main className="flex-1 p-4 md:p-6 transition-all duration-200">
          <DashboardContent />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;