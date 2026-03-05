import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addEmergencyContactAPI } from "../../../Services/allAPI";

const MAX_CONTACTS = 4;

const AddContactForm = ({ open, onOpenChange, onContactAdded, contactCount, token }) => {
  const [contactDetails, setContactDetails] = useState({
    fullname: "", phoneNumber: "", email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleAddContact = async () => {
    const { fullname, phoneNumber, email } = contactDetails;

    if (!fullname || !phoneNumber || !email) {
      alert("Please fill all the fields.");
      return;
    }

    if (contactCount >= MAX_CONTACTS) {
      alert(`You can only add up to ${MAX_CONTACTS} emergency contacts.`);
      return;
    }

    const t = token || sessionStorage.getItem('token');
    if (!t) { alert("Session expired. Please login again."); return; }

    setLoading(true);
    try {
      const response = await addEmergencyContactAPI(contactDetails, {
        Authorization: `Bearer ${t}`,
      });

      if (response.status === 200) {
        onContactAdded(response.data); // ← instantly adds to parent list
        onOpenChange(false);
        setContactDetails({ fullname: "", phoneNumber: "", email: "" });
      } else {
        // Parse backend validation errors
        const err = response.response?.data;
        if (err?.error?.errors?.phoneNumber) {
          alert(err.error.errors.phoneNumber.message);
        } else if (err?.error?.errors?.email) {
          alert(err.error.errors.email.message);
        } else {
          alert(err?.message || "Failed to add contact. Please try again.");
        }
      }
    } catch (error) {
      console.error("Add contact error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setContactDetails({ fullname: "", phoneNumber: "", email: "" }); // clear on cancel too
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] mx-4">
        <DialogHeader>
          <DialogTitle>Add New Emergency Contact</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Input
            placeholder="Full Name"
            value={contactDetails.fullname}
            onChange={(e) =>
              setContactDetails({ ...contactDetails, fullname: e.target.value })
            }
          />
          <Input
            placeholder="Phone Number (e.g. +91 9876543210)"
            value={contactDetails.phoneNumber}
            onChange={(e) =>
              setContactDetails({ ...contactDetails, phoneNumber: e.target.value })
            }
          />
          <Input
            type="email"
            placeholder="Email Address"
            value={contactDetails.email}
            onChange={(e) =>
              setContactDetails({ ...contactDetails, email: e.target.value })
            }
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddContact} disabled={loading}>
              {loading ? "Adding..." : "Add Contact"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactForm;