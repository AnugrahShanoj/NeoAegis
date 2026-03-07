import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus, Send, Loader2, Users, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import LayoutWrapper from "../components/LayoutWrapper";
import AddContactForm from "@/components/contacts/AddContactForm";
import ContactsList from "@/components/contacts/ContactsList";
import { getEmergencyContactAPI, sendTestAlertAPI } from "../../Services/allAPI";

const MAX_CONTACTS = 4;

const MotionDiv = motion.div;

const EmergencyContacts = () => {
  const [showAddForm,      setShowAddForm]      = useState(false);
  const [contacts,         setContacts]         = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loadingTest,      setLoadingTest]      = useState(false);
  const [token,            setToken]            = useState("");

  useEffect(() => {
    const t = sessionStorage.getItem("token");
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchContacts();
  }, [token]);

  const fetchContacts = async () => {
    try {
      const response = await getEmergencyContactAPI({ Authorization: "Bearer " + token });
      if (response.status === 200) setContacts(response.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  const handleContactAdded = (newContact) => {
    setContacts((prev) => [...prev, newContact]);
  };

  const handleContactDeleted = (contactId) => {
    setContacts((prev) => prev.filter((c) => c._id !== contactId));
    setSelectedContacts((prev) => prev.filter((id) => id !== contactId));
  };

  const handleContactUpdated = (updatedContact) => {
    setContacts((prev) =>
      prev.map((c) => (c._id === updatedContact._id ? updatedContact : c))
    );
  };

  const handleTestAlert = async () => {
    if (selectedContacts.length === 0) {
  toast.error("Please select at least one contact.");
  return;
}
    setLoadingTest(true);
    try {
      const response = await sendTestAlertAPI(
        { contactIds: selectedContacts },
        { Authorization: "Bearer " + token }
      );
      if (response.status === 200) {
        toast.success("Test alert sent to " + response.data.count + " contact(s) via email.");
        setSelectedContacts([]);
      } else {
        toast.error("Failed to send test alert. Please try again.");
      }
    } catch (err) {
      console.error("Test alert error:", err);
      toast.error("Something went wrong sending the test alert.");
    } finally {
      setLoadingTest(false);
    }
  };

  const atLimit       = contacts.length >= MAX_CONTACTS;
  const slotsUsed     = contacts.length;
  const slotsLeft     = MAX_CONTACTS - slotsUsed;
  const slotBarWidth  = String((slotsUsed / MAX_CONTACTS) * 100) + "%";

  const selectedNames = contacts
    .filter((c) => selectedContacts.includes(c._id))
    .map((c) => c.fullname);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />

        <main className="flex-1 transition-all duration-200 bg-neutral-300/40">
          <LayoutWrapper>
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-5xl mx-auto px-2 sm:px-4 pt-4 pb-10 space-y-5"
            >

              {/* ── HERO BANNER ── */}
              <div
                className="relative rounded-2xl overflow-hidden px-6 py-7 sm:px-8 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                style={{ background: "linear-gradient(135deg, #312F2F 0%, #5a1515 55%, #EA2B1F 100%)" }}
              >
                {/* Grid texture */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-5"
                  style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                {/* Decorative rings */}
                <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute top-4 right-16 w-28 h-28 rounded-full border border-white/5 pointer-events-none" />

                <div className="relative z-10">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">
                    Emergency Contacts
                  </p>
                  <h1 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2">
                    Your Safety Network
                  </h1>
                  <p className="text-white/55 text-sm leading-relaxed max-w-sm mb-3">
                    Manage trusted contacts who will be notified instantly during an SOS alert.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
                    <span
                      className="w-2 h-2 rounded-full bg-green-400"
                      style={{ boxShadow: "0 0 6px #4ade80" }}
                    />
                    <span className="text-white/80 text-xs font-semibold">
                      {slotsUsed} of {MAX_CONTACTS} contacts active
                    </span>
                  </div>
                </div>

                <div className="relative z-10 w-full sm:w-auto flex-shrink-0">
                  <MotionDiv whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <button
                      onClick={() => setShowAddForm(true)}
                      disabled={atLimit}
                      className="flex items-center justify-center gap-2 bg-white text-primary font-bold text-sm px-6 py-3 rounded-xl w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
                    >
                      <Plus className="w-4 h-4" />
                      Add New Contact
                    </button>
                  </MotionDiv>
                  {atLimit && (
                    <p className="text-xs text-white/60 font-medium text-center mt-2">
                      Maximum {MAX_CONTACTS} contacts reached
                    </p>
                  )}
                </div>
              </div>

              {/* ── STATS ROW ── */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-400">Total Contacts</p>
                    <p className="text-xl font-bold text-blue-600">{slotsUsed}</p>
                  </div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-400">Slots Available</p>
                    <p className="text-xl font-bold text-green-600">{slotsLeft}</p>
                  </div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-400">Test Alerts</p>
                    <p className="text-sm font-bold text-amber-600">
                      {selectedContacts.length > 0 ? selectedContacts.length + " selected" : "None selected"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── TWO COLUMN ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Contacts list — 2/3 */}
                <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-base text-neutral-800">Saved Contacts</h2>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Select contacts to send a test alert
                      </p>
                    </div>
                    {/* Slot dots */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: MAX_CONTACTS }).map((_, i) => (
                        <div
                          key={i}
                          className={"w-2.5 h-2.5 rounded-full " + (i < slotsUsed ? "bg-green-400" : "bg-neutral-200")}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="p-5">
                    <ContactsList
                      contacts={contacts}
                      selectedContacts={selectedContacts}
                      setSelectedContacts={setSelectedContacts}
                      onContactDeleted={handleContactDeleted}
                      onContactUpdated={handleContactUpdated}
                      token={token}
                    />

                    {/* Empty slots */}
                    {!atLimit && contacts.length > 0 && (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-neutral-200 rounded-xl text-xs font-semibold text-neutral-400 hover:border-primary hover:text-primary transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add contact ({slotsLeft} slot{slotsLeft !== 1 ? "s" : ""} remaining)
                      </button>
                    )}
                  </div>
                </div>

                {/* Right panel — 1/3 */}
                <div className="flex flex-col gap-4">

                  {/* Test Alert card */}
                  <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-neutral-100">
                      <h2 className="font-bold text-base text-neutral-800 flex items-center gap-2">
                        <Send className="w-4 h-4 text-primary" />
                        Send Test Alert
                      </h2>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Verify contacts can receive alerts
                      </p>
                    </div>
                    <div className="p-5 space-y-4">

                      {selectedContacts.length > 0 && (
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <p className="text-xs font-semibold text-blue-700 mb-2">
                            {selectedContacts.length} contact(s) selected
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedNames.map((name) => (
                              <span
                                key={name}
                                className="inline-flex items-center px-2 py-0.5 bg-white border border-blue-100 rounded-full text-xs font-semibold text-neutral-700"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleTestAlert}
                        disabled={selectedContacts.length === 0 || loadingTest}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #312F2F, #EA2B1F)" }}
                      >
                        {loadingTest
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                          : <><Send className="w-4 h-4" /> Send Test Alert</>
                        }
                      </button>

                      <p className="text-xs text-neutral-400 text-center leading-relaxed">
                        A test email confirms contacts are part of your safety network.
                      </p>

                      {contacts.length === 0 && (
                        <p className="text-xs text-neutral-400 text-center">
                          Add contacts first to send test alerts
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Slot usage card */}
                  <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-neutral-100">
                      <h2 className="font-bold text-base text-neutral-800 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        Contact Slots
                      </h2>
                      <p className="text-xs text-neutral-400 mt-0.5">Maximum 4 contacts</p>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-neutral-500">Used</span>
                        <span className="text-xs font-bold text-neutral-700">
                          {slotsUsed} / {MAX_CONTACTS}
                        </span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: slotBarWidth,
                            background: "linear-gradient(90deg, #16a34a, #4ade80)",
                          }}
                        />
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {slotsLeft > 0
                          ? "You have " + slotsLeft + " slot" + (slotsLeft !== 1 ? "s" : "") + " remaining. More contacts improve your safety coverage."
                          : "All slots filled. You have maximum coverage."
                        }
                      </p>
                    </div>
                  </div>

                  {/* Tip card */}
                  <div className="p-4 bg-red-50/60 border border-red-100 rounded-xl">
                    <p className="text-xs font-bold text-neutral-700 flex items-center gap-1.5 mb-2">
                      💡 Pro Tip
                    </p>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Add contacts with different relationships — family, friends, and colleagues — to ensure someone is always reachable during an emergency.
                    </p>
                  </div>

                </div>
              </div>

            </MotionDiv>
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