import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// Dummy data for demonstration
const initialContacts = [
  {
    id: 1,
    name: "City Police Department",
    type: "Police",
    phone: "112",
    email: "pol@kerala.gov.in",
    address: "Ernakulam",
  },
  {
    id: 2,
    name: "Central Fire Station",
    type: "Fire",
    phone: "102",
    email: "dg.frs@kerala.gov.in",
    address: "Ernakulam",
  },
];
const EmergencyContactsList = ({ searchTerm }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const handleDelete = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    toast.success("Contact deleted successfully");
  };
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="rounded-md border">
      <Table className='bg-white rounded-lg'>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead className="hidden lg:table-cell">Email</TableHead>
            <TableHead className="hidden xl:table-cell">Address</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.type}</TableCell>
              <TableCell className="hidden md:table-cell">{contact.phone}</TableCell>
              <TableCell className="hidden lg:table-cell">{contact.email}</TableCell>
              <TableCell className="hidden xl:table-cell">{contact.address}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Edit functionality to be implemented")}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className='bg-secondary text-white'
                    onClick={() => handleDelete(contact.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default EmergencyContactsList;