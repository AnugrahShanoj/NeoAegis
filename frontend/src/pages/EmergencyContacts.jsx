import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddContactForm from "@/components/contacts/AddContactForm";
import ContactsList from "@/components/contacts/ContactsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import LayoutWrapper from "../components/LayoutWrapper";
// import { smsAPI } from "../../Services/allAPI";
const EmergencyContacts = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  // const handleTestAlert =async () => {
  //   if (selectedContacts.length === 0) {
  //     alert("Please select at least one contact");
  //     return;
  //   }
  //   const token= sessionStorage.getItem('token')
  //   if(token){
  //     const reqHeader={
  //       'Authorization':`Bearer ${token}`
  //     }
  //     const reqBody={
  //       msg:"This is a Test Alert."
  //     }
  //     const response= await smsAPI(reqBody,reqHeader)
  //     console.log(response)
  //     if(response.status==200){
  //       alert(`Test alert sent to ${selectedContacts.length} contacts`);
  //     }
  //   }
  // };
  return (
    <SidebarProvider>
        <div className="min-h-screen flex w-full">
        <DashboardSidebar/>
        <main className="flex-1 p-6 transition-all duration-200 bg-neutral-300/40">
       <LayoutWrapper>
       <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4 space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Emergency Contacts</h1>
          <p className="text-neutral-800 mt-1">Manage your emergency contacts and test alerts</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Contact
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ContactsList
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
          />
        </div>
        
        <div className="lg:col-span-1 ">
          <Card className="sticky top-4 bg-white">
            <CardHeader>
              <CardTitle>Test Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4 ">
                Send a test alert to selected contacts to verify their information
              </p>
              <Button
                variant="secondary"
                className="w-full"
                // onClick={handleTestAlert}
                disabled={selectedContacts.length === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Test Alert
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <AddContactForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
      />
    </motion.div>
       </LayoutWrapper>
        </main>
        </div>
    </SidebarProvider>
  );
};
export default EmergencyContacts;