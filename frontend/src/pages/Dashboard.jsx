import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const Dashboard = () => {
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