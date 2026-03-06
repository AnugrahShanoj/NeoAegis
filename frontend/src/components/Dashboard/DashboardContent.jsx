import { useState, useEffect } from "react";
import WelcomeHeader from "./WelcomeHeader";
import QuickStats from "./QuickStats";
import SafetyReadiness from "./SafetyReadiness";
import CheckinStreakWidget from "./CheckinStreakWidget";
import LayoutWrapper from "../LayoutWrapper";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
// ⚠️ Verify these function names match your allAPI.js exactly
import { getEmergencyContactAPI, getSOSAlertsAPI, getSafetyCheckins } from "../../../Services/allAPI";

const DashboardContent = () => {
  const [open,           setOpen]           = useState(false);
  const [loading,        setLoading]        = useState(true);
  const [contactCount,   setContactCount]   = useState(0);
  const [sosCount,       setSosCount]       = useState(0);
  const [checkinCount,   setCheckinCount]   = useState(0);
  const [checkinsData,   setCheckinsData]   = useState([]);
  const [lastCheckinDate,setLastCheckinDate] = useState(null);
  const [activeSosCount, setActiveSosCount] = useState(0);
  const [contacts,       setContacts]       = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    const reqHeader = {
      "Content-Type":  "application/json",
      "Authorization": "Bearer " + token,
    };
    fetchAll(reqHeader);
  }, []);

  async function fetchAll(reqHeader) {
    setLoading(true);

    // Emergency contacts
    try {
      const res = await getEmergencyContactAPI(reqHeader);
      if (res && res.data) {
        const arr = Array.isArray(res.data) ? res.data : [];
        setContactCount(arr.length);
        setContacts(arr);
      }
    } catch (e) {
      console.error("Contacts error:", e);
    }

    // SOS alerts — ⚠️ update getSOSAlertsAPI if your function name differs
    try {
      const res = await getSOSAlertsAPI(reqHeader);
      if (res && res.data) {
        const arr = Array.isArray(res.data) ? res.data : [];
        setSosCount(arr.length);
        const active = arr.filter((a) => {
          const s = (a.status || "").toLowerCase();
          return s !== "resolved";
        });
        setActiveSosCount(active.length);
      }
    } catch (e) {
      console.error("SOS error:", e);
    }

    // Check-ins — ⚠️ update getSafetyCheckins if your function name differs
    try {
      const res = await getSafetyCheckins(reqHeader);
      if (res && res.data) {
        const arr = Array.isArray(res.data) ? res.data : [];
        setCheckinCount(arr.length);
        setCheckinsData(arr);
        if (arr.length > 0) {
          const sorted = [...arr].sort((a, b) => {
            const da = new Date(a.createdAt || a.date || a.checkInTime || a.timestamp || 0);
            const db = new Date(b.createdAt || b.date || b.checkInTime || b.timestamp || 0);
            return db.getTime() - da.getTime();
          });
          const latest = sorted[0];
          setLastCheckinDate(latest.createdAt || latest.date || latest.checkInTime || latest.timestamp || null);
        }
      }
    } catch (e) {
      console.error("Checkins error:", e);
    }

    setLoading(false);
  }

  return (
    <LayoutWrapper>
      <div className="max-w-5xl mx-auto px-2 sm:px-4 pt-4 pb-10 space-y-5">

        {/* Hero banner */}
        <WelcomeHeader />

        {/* Stats strip */}
        <QuickStats
          contactCount={contactCount}
          checkinCount={checkinCount}
          sosCount={sosCount}
          loading={loading}
        />

        {/* Search contacts button
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-sm"
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4" />
            Search Contacts
          </Button>
        </div> */}

        {/* Two column: Safety Readiness + Checkin Streak */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SafetyReadiness
            contactCount={contactCount}
            lastCheckinDate={lastCheckinDate}
            activeSosCount={activeSosCount}
            loading={loading}
          />
          <CheckinStreakWidget
            checkinsData={checkinsData}
            loading={loading}
          />
        </div>

        {/* Search modal */}
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type contact name or number..." />
          <CommandList>
            <CommandEmpty>No contacts found.</CommandEmpty>
            <CommandGroup heading="Emergency Contacts">
              {contacts.map((contact) => {
                const name  = contact.fullname || contact.name || "Unknown";
                const phone = contact.phone || contact.phoneNumber || "";
                const key   = name + phone;
                return (
                  <CommandItem key={key} className="flex items-center justify-between">
                    <span>{name}</span>
                    <span className="text-sm text-muted-foreground">{phone}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </CommandDialog>

      </div>
    </LayoutWrapper>
  );
};

export default DashboardContent;