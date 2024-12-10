import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProfileContent from "@/components/profile/ProfileContent";
const Profile = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#4A4848]/5 to-secondary/5">
        <DashboardSidebar />
        <main className="flex-1 p-6 transition-all duration-200">
          <ProfileContent />
        </main>
      </div>
    </SidebarProvider>
  );
};
export default Profile;