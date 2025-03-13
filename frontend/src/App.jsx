// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index.jsx";
import SignIn from "./pages/Auth/SignIn.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import EmergencyContacts from "./pages/EmergencyContacts.jsx";
import SafetyCheckins from "./pages/SafetyCheckins.jsx";
import SOSAlerts from "./pages/SOSAlerts.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import EmergencyManagement from "./pages/admin/EmergencyManagement.jsx";
import SafetyAlertMonitoring from "./pages/admin/SafetyAlertMonitoring.jsx";
import Payment from "./pages/Payment.jsx";
import EmailBreach from "./pages/EmailBreach.jsx";
const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <Toaster /> */}
      {/* <Sonner position="top-center" richColors/> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sign-in" element={<SignIn/>} />
          <Route path="/sign-up" element={<SignUp/>} />
          <Route path="/payment" element={<Payment/>}/>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/contacts" element={<EmergencyContacts/>}/>
          <Route path="/checkins" element={<SafetyCheckins/>}/>
          <Route path="/alerts" element={<SOSAlerts/>}/>
          <Route path="/email-breach" element={<EmailBreach />} />

           {/* Admin Routes */}
           <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/users" replace />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="emergency" element={<EmergencyManagement />} />
              <Route path="alerts" element={<SafetyAlertMonitoring />} />
            </Route>

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;