import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import EditContactForm from "./EditContactForm";
import { deleteEmergencyContactAPI } from "../../../Services/allAPI";

const ContactsList = ({
  contacts,
  selectedContacts,
  setSelectedContacts,
  onContactDeleted,
  onContactUpdated,
  token,
}) => {
  const [editingContact, setEditingContact] = useState(null);
  const [deletingId,     setDeletingId]     = useState(null);

  const handleCheckboxChange = (checked, id) => {
    setSelectedContacts(prev =>
      checked ? [...prev, id] : prev.filter(contactId => contactId !== id)
    );
  };

  const handleDelete = async (contactId) => {
    if (!token) return;
    setDeletingId(contactId);
    try {
      const response = await deleteEmergencyContactAPI(contactId, {
        Authorization: `Bearer ${token}`,
      });
      if (response.status === 200) {
        onContactDeleted(contactId); // instant update — no reload
      } else {
        alert("Failed to delete contact. Please try again.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong deleting the contact.");
    } finally {
      setDeletingId(null);
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-neutral-100 shadow-sm">
        <UserCircle className="h-12 w-12 text-neutral-200 mx-auto mb-3" />
        <p className="text-neutral-500 font-medium">No contacts added yet</p>
        <p className="text-neutral-400 text-sm mt-1">
          Click "Add New Contact" to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {contacts.map((contact) => (
          <motion.div
            key={contact._id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            className="w-full"
          >
            <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 sm:gap-4">

                {/* Checkbox */}
                <Checkbox
                  checked={selectedContacts.includes(contact._id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(checked, contact._id)
                  }
                  className="mt-1 flex-shrink-0"
                />

                {/* Contact info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-800 text-sm sm:text-base truncate">
                    {contact.fullname}
                  </h3>
                  <div className="space-y-0.5 mt-1.5 text-xs sm:text-sm text-neutral-500">
                    <p className="truncate">{contact.phoneNumber}</p>
                    <p className="truncate">{contact.email}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingContact(contact)}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={deletingId === contact._id}
                    onClick={() => handleDelete(contact._id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </Button>
                </div>

              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <EditContactForm
        contact={editingContact}
        open={!!editingContact}
        onOpenChange={(open) => { if (!open) setEditingContact(null); }}
        onSave={(updatedContact) => {
          onContactUpdated(updatedContact);
          setEditingContact(null);
        }}
      />
    </div>
  );
};

export default ContactsList;