import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, UserCircle, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import EditContactForm from "./EditContactForm";
import { deleteEmergencyContactAPI } from "../../../Services/allAPI";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#7c3aed,#4f46e5)",
  "linear-gradient(135deg,#0891b2,#0e7490)",
  "linear-gradient(135deg,#16a34a,#15803d)",
  "linear-gradient(135deg,#EA2B1F,#9a1313)",
  "linear-gradient(135deg,#d97706,#b45309)",
];

function getGradient(index) {
  return AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
}

function getInitial(name) {
  return (name || "?").charAt(0).toUpperCase();
}

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
    setSelectedContacts((prev) =>
      checked ? [...prev, id] : prev.filter((contactId) => contactId !== id)
    );
  };

  const handleDelete = async (contactId) => {
    if (!token) return;
    setDeletingId(contactId);
    try {
      const response = await deleteEmergencyContactAPI(contactId, {
        Authorization: "Bearer " + token,
      });
      if (response.status === 200) {
        onContactDeleted(contactId);
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
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <UserCircle className="w-12 h-12 text-neutral-200 mb-3" />
        <p className="text-sm font-semibold text-neutral-400">No contacts added yet</p>
        <p className="text-xs text-neutral-300 mt-1">
          Click "Add New Contact" to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {contacts.map((contact, index) => {
          const isSelected = selectedContacts.includes(contact._id);
          const isDeleting = deletingId === contact._id;
          const gradient   = getGradient(index);
          const initial    = getInitial(contact.fullname);

          return (
            <motion.div
              key={contact._id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              className={
                "flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-150 " +
                (isSelected
                  ? "border-primary/25 bg-red-50/40"
                  : "border-neutral-200 bg-neutral-50/60 hover:bg-white hover:shadow-sm")
              }
            >
              {/* Checkbox */}
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => handleCheckboxChange(checked, contact._id)}
                className="flex-shrink-0"
              />

              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                style={{ background: gradient }}
              >
                {initial}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-800 truncate">
                  {contact.fullname}
                </p>
                <p className="text-xs text-neutral-400 truncate mt-0.5">
                  {contact.phoneNumber}
                  {contact.email && (
                    <span className="text-neutral-300"> &nbsp;·&nbsp; </span>
                  )}
                  {contact.email && (
                    <span className="text-neutral-400">{contact.email}</span>
                  )}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setEditingContact(contact)}
                  className="w-8 h-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-neutral-500" />
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  disabled={isDeleting}
                  className="w-8 h-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
                >
                  {isDeleting
                    ? <Loader2 className="w-3.5 h-3.5 text-red-400 animate-spin" />
                    : <Trash2  className="w-3.5 h-3.5 text-red-400" />
                  }
                </button>
              </div>

            </motion.div>
          );
        })}
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