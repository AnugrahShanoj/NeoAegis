import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import EditContactForm from "./EditContactForm";
import { toast } from "sonner";
// Dummy data for demonstration
const initialContacts = [
  {
    id: 1,
    name: "Anugrah P",
    phone: "+1 234-567-8900",
    email: "anugrah@gmail.com"
  },
  {
    id: 2,
    name: "Alvid",
    phone: "+1 234-567-8901",
    email: "alvid@gmail.com"
  }
];
const ContactsList = ({ selectedContacts, setSelectedContacts }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [editingContact, setEditingContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;
  const handleDelete = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
    toast.success("Contact deleted successfully");
  };
  const handleCheckboxChange = (checked, id) => {
    setSelectedContacts(prev =>
      checked ? [...prev, id] : prev.filter(contactId => contactId !== id)
    );
  };
  const totalPages = Math.ceil(contacts.length / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage;
  const displayedContacts = contacts.slice(startIndex, startIndex + contactsPerPage);
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {displayedContacts.map((contact) => (
          <motion.div
            key={contact.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <Card className="p-4 bg-white">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedContacts.includes(contact.id)}
                  onCheckedChange={(checked) => handleCheckboxChange(checked, contact.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-800">{contact.name}</h3>
                  <div className="space-y-1 mt-2 text-sm text-neutral-600">
                    <p>{contact.phone}</p>
                    <p>{contact.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingContact(contact)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      {contacts.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          No contacts added yet
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      )}
      <EditContactForm
        contact={editingContact}
        open={!!editingContact}
        onOpenChange={(open) => !open && setEditingContact(null)}
        onSave={(updatedContact) => {
          setContacts(contacts.map(c =>
            c.id === updatedContact.id ? updatedContact : c
          ));
          setEditingContact(null);
          toast.success("Contact updated successfully");
        }}
      />
    </div>
  );
};
export default ContactsList;