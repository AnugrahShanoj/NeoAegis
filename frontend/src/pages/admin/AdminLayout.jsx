import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#4A4848]/5 to-secondary/5">
        <AdminSidebar className="w-full md:w-1/4" />
        <main className="flex-1 p-4 md:p-6 transition-all duration-200">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};
export default AdminLayout;
