import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import ProfileContent from "@/components/profile/ProfileContent";

const Profile = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 transition-all duration-200 bg-neutral-300/40">
          <ProfileContent />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Profile;