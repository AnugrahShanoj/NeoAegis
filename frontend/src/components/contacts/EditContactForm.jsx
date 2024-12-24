import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { editEmergencyContactAPI } from "../../../Services/allAPI";
const EditContactForm = ({ contact, open, onOpenChange, onSave}) => {
  const [contactDetails,setContactDetails]=useState({
    fullname:"",
    phoneNumber:"",
    email:""
  })

// API Function for handling edit of an emergency contact
const handleEdit=async(contactId)=>{
  console.log(contactId)
  const {fullname,phoneNumber,email}=contactDetails
  if(!fullname || !phoneNumber || !email){
    alert("Please fill all the fields")
  }
  else{
    const reqBody=contactDetails
    const token= sessionStorage.getItem('token')
    if(token){
      const reqHeader={
        'Authorization':`Bearer ${token}`
      }
      // API Call for edit
      try {
        const response= await editEmergencyContactAPI(contactId,reqBody,reqHeader)
        console.log(response)
        if(response.status==200){
          alert("Emergency contact updated successfully")
          onSave(response.data.updatedContact)
          onOpenChange(false)
          setContactDetails({fullname:"",phoneNumber:"",email:""})
        }
        else{
          if(response.response.data.errors){
            if(response.response.data.errors.phoneNumber){
              alert(response.response.data.errors.phoneNumber.message)
            }
            else{
              alert(response.response.data.errors.email.message)
              
            }
            }
            else{
              alert(response.response.data.message)
            } 
        }
      } catch (error) {
        
      }
    }
  }
}

console.log(contactDetails)
  useEffect(() => {
    if (contact) {
      setContactDetails({
        fullname: contact.fullname,
        phoneNumber: contact.phoneNumber,
        email: contact.email
      });
    }
  }, [contact]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Emergency Contact</DialogTitle>
        </DialogHeader>
        <form  className="space-y-4">
          <div className="space-y-2">
            <Input
              name="name"
              placeholder="Full Name"
              value={contactDetails.fullname}
              onChange={(e)=>setContactDetails({...contactDetails,fullname:e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Input
              name="phone"
              placeholder="Phone Number"
              value={contactDetails.phoneNumber}
              onChange={(e)=>setContactDetails({...contactDetails,phoneNumber:e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={contactDetails.email}
              onChange={(e)=>setContactDetails({...contactDetails,email:e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={()=>handleEdit(contact._id)}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default EditContactForm;