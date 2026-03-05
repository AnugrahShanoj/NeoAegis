import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import LayoutWrapper from "../components/LayoutWrapper";
import AddContactForm from "@/components/contacts/AddContactForm";
import ContactsList from "@/components/contacts/ContactsList";
import { getEmergencyContactAPI, sendTestAlertAPI } from "../../Services/allAPI";

const MAX_CONTACTS = 4;

const EmergencyContacts = () => {
  const [showAddForm,      setShowAddForm]      = useState(false);
  const [contacts,         setContacts]         = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loadingTest,      setLoadingTest]      = useState(false);
  const [token,            setToken]            = useState("");

  useEffect(() => {
    const t = sessionStorage.getItem('token');
    setToken(t);
  }, []);

  // Fetch contacts once token is ready
  useEffect(() => {
    if (!token) return;
    fetchContacts();
  }, [token]);

  const fetchContacts = async () => {
    try {
      const response = await getEmergencyContactAPI({ Authorization: `Bearer ${token}` });
      if (response.status === 200) setContacts(response.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  // Called by AddContactForm on success — instant update, no refetch
  const handleContactAdded = (newContact) => {
    setContacts(prev => [...prev, newContact]);
  };

  // Called by ContactsList on delete — instant update, no reload
  const handleContactDeleted = (contactId) => {
    setContacts(prev => prev.filter(c => c._id !== contactId));
    setSelectedContacts(prev => prev.filter(id => id !== contactId));
  };

  // Called by ContactsList on edit save — instant update
  const handleContactUpdated = (updatedContact) => {
    setContacts(prev =>
      prev.map(c => c._id === updatedContact._id ? updatedContact : c)
    );
  };

  const handleTestAlert = async () => {
    if (selectedContacts.length === 0) {
      alert("Please select at least one contact.");
      return;
    }
    setLoadingTest(true);
    try {
      const response = await sendTestAlertAPI(
        { contactIds: selectedContacts },
        { Authorization: `Bearer ${token}` }
      );
      if (response.status === 200) {
        alert(`✅ Test alert sent to ${response.data.count} contact(s) via email.`);
        setSelectedContacts([]); // clear selection after sending
      } else {
        alert("Failed to send test alert. Please try again.");
      }
    } catch (err) {
      console.error("Test alert error:", err);
      alert("Something went wrong sending the test alert.");
    } finally {
      setLoadingTest(false);
    }
  };

  const atLimit = contacts.length >= MAX_CONTACTS;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />

        <main className="flex-1 p-4 sm:p-6 transition-all duration-200 bg-neutral-300/40">
          <LayoutWrapper>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="container mx-auto p-2 sm:p-4 space-y-6"
            >

              {/* Page header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
                    Emergency Contacts
                  </h1>
                  <p className="text-neutral-600 mt-1 text-sm sm:text-base">
                    Manage your emergency contacts and test alerts
                    {contacts.length > 0 && (
                      <span className="ml-2 text-xs font-semibold text-neutral-400">
                        ({contacts.length}/{MAX_CONTACTS} contacts)
                      </span>
                    )}
                  </p>
                </div>

                <div className="w-full sm:w-auto flex flex-col items-end gap-1">
                  <Button
                    onClick={() => setShowAddForm(true)}
                    disabled={atLimit}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Contact
                  </Button>
                  {atLimit && (
                    <p className="text-xs text-amber-600 font-medium">
                      Maximum {MAX_CONTACTS} contacts reached
                    </p>
                  )}
                </div>
              </div>

              {/* Main grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Contacts list — takes 2/3 on desktop */}
                <div className="lg:col-span-2">
                  <ContactsList
                    contacts={contacts}
                    selectedContacts={selectedContacts}
                    setSelectedContacts={setSelectedContacts}
                    onContactDeleted={handleContactDeleted}
                    onContactUpdated={handleContactUpdated}
                    token={token}
                  />
                </div>

                {/* Test Alert card — takes 1/3 on desktop */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-4 bg-white shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Test Alert</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-600 mb-4 text-sm leading-relaxed">
                        Send a test email to selected contacts to verify their information
                        is correct and they can receive alerts.
                      </p>

                      {/* Show which contacts are selected */}
                      {selectedContacts.length > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <p className="text-xs text-blue-700 font-semibold">
                            {selectedContacts.length} contact(s) selected
                          </p>
                        </div>
                      )}

                      <Button
                        className="w-full"
                        variant="secondary"
                        onClick={handleTestAlert}
                        disabled={selectedContacts.length === 0 || loadingTest}
                      >
                        {loadingTest ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Test Alert
                          </>
                        )}
                      </Button>

                      {contacts.length === 0 && (
                        <p className="text-xs text-neutral-400 text-center mt-3">
                          Add contacts first to send test alerts
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

            </motion.div>
          </LayoutWrapper>

          <AddContactForm
            open={showAddForm}
            onOpenChange={setShowAddForm}
            onContactAdded={handleContactAdded}
            contactCount={contacts.length}
            token={token}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EmergencyContacts;