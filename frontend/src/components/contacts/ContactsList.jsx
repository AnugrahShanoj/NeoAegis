import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import EditContactForm from "./EditContactForm";
import { toast } from "sonner";
import { deleteEmergencyContactAPI, getEmergencyContactAPI } from "../../../Services/allAPI";
const ContactsList = ({ selectedContacts, setSelectedContacts }) => {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;
  const handleCheckboxChange = (checked, id) => {
    setSelectedContacts(prev =>
      checked ? [...prev, id] : prev.filter(contactId => contactId !== id)
    );
  };
  const totalPages = Math.ceil(contacts.length / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage;
  const displayedContacts = contacts.slice(startIndex, startIndex + contactsPerPage);

  const [token,setToken]=useState("")

  // API Function for get all emergency contacts of the user
  const getEmergencyContacts= async()=>{
    if(token){
      const reqHeader={
        'Authorization':`Bearer ${token}`
      }
      // console.log(reqHeader)
      //API Call for emergency contacts
      try {
        const response=await getEmergencyContactAPI(reqHeader)
      console.log(response)
      setContacts(response.data)
      } catch (error) {
        console.error("Error fetching contacts: ", err);
      alert("Failed to fetch contacts.");
      }
    }
  }

  // API Function for delete an emergency contact
  const handleDelete=async(contactId)=>{
    if(token){
      const reqHeader={
        'Authorization':`Bearer ${token}`
      }
      //API Call for delete emergency contact
      const response= await deleteEmergencyContactAPI(contactId,reqHeader)
      console.log(response)
      if(response.status==200){
        alert("Contact Deleted Successfully")
        window.location.reload()
      }
      else{
        alert("Failed to delete contact")
      }
    }
    
  }
console.log(contacts)
console.log(selectedContacts)
  useEffect(()=>{
    setToken(sessionStorage.getItem('token'))
    getEmergencyContacts()
  },[token])
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {displayedContacts.map((contact) => (
          <motion.div
            key={contact._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <Card className="p-4 bg-white">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedContacts.includes(contact._id)}
                  onCheckedChange={(checked) => handleCheckboxChange(checked, contact._id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-800">{contact.fullname}</h3>
                  <div className="space-y-1 mt-2 text-sm text-neutral-600">
                    <p>{contact.phoneNumber}</p>
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
                    onClick={() => handleDelete(contact._id)}
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
  contact={editingContact} // Pass the contact to be edited
  open={!!editingContact} // Control modal visibility
  onOpenChange={(open) => {
    if (!open) setEditingContact(null); // Close modal and reset state
  }}
  onSave={(updatedContact) => {
    if(!updatedContact || !updatedContact._id){
      console.error("Updated contact is missing _id");
      return;
    }
    // Update the contacts state in real-time
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact._id === updatedContact._id ? updatedContact : contact
      )
    );
    // Close the modal after saving changes
    setEditingContact(null);

    // Optional: Show a success toast
    // toast.success("Contact updated successfully!");
  }}
/>

    </div>
  );
};
export default ContactsList;