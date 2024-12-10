import { useState } from "react";
import WelcomeHeader from "./WelcomeHeader";
import QuickStats from "./QuickStats";
import RecentActivity from "./RecentActivity";
import { motion } from "framer-motion";
import { BellRing, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import LayoutWrapper from "../LayoutWrapper";
import { Link } from "react-router-dom";

const DashboardContent = () => {
  const [open, setOpen] = useState(false);

  // Mock data for demonstration
  const emergencyContacts = [
    { name: "Anugrah", type: "Emergency Contact", phone: "+1 234-567-8900" },
    { name: "City Police", type: "Helpline", phone: "112" },
    { name: "Local Hospital", type: "Helpline", phone: "+1 234-567-8901" },
    { name: "Fire Force", type: "Helpline", phone: "102" },
  ];

  return (
    <LayoutWrapper>
      <div className="max-w-7xl mx-auto mt-8 space-y-12 px-4 sm:px-6 lg:px-8">
      {/* Stacked Layout for Smaller Screens */}
      <div className="flex flex-col gap-4 items-center">
        {/* Row 1: Welcome Header */}
        <div className="w-full">
          <WelcomeHeader />
        </div>
        {/* Row 2: SOS Button */}
        <div className="w-full flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={'/alerts'}><Button
              variant="destructive"
              size="lg"
              className="bg-red-600 hover:bg-red-700 px-8 py-6 shadow-lg text-white"
              onClick={() => alert("SOS Alert triggered - This is a demo")}
            >
              <span className="flex items-center gap-3 text-lg font-bold">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 0, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <BellRing className="h-6 w-6" />
                </motion.div>
                SOS ALERT
              </span>
            </Button></Link>
          </motion.div>
        </div>
        {/* Row 3: Search Area */}
        <div className="w-full">
          <Button
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={() => setOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span>Search Contacts</span>
          </Button>
        </div>
      </div>

      <QuickStats />
      <RecentActivity />

      {/* Search Modal */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type contact name or number..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Emergency Contacts">
            {emergencyContacts
              .filter((contact) => contact.type === "Emergency Contact")
              .map((contact) => (
                <CommandItem
                  key={contact.phone}
                  className="flex items-center justify-between"
                >
                  <span>{contact.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {contact.phone}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Helpline Directory">
            {emergencyContacts
              .filter((contact) => contact.type === "Helpline")
              .map((contact) => (
                <CommandItem
                  key={contact.phone}
                  className="flex items-center justify-between"
                >
                  <span>{contact.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {contact.phone}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
    </LayoutWrapper>
  );
};

export default DashboardContent;
