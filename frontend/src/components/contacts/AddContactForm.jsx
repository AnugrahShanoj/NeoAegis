import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addEmergencyContactAPI } from "../../../Services/allAPI";
const AddContactForm = ({ open, onOpenChange }) => {
  const [contactDetails,setContactDetails]=useState({
    fullname:"",
    phoneNumber:"",
    email:""
  })

// API function for add emergency contact
const handleAddContact=async()=>{
  const {fullname,phoneNumber,email}=contactDetails
  if(!fullname || !phoneNumber || !email){
    alert("Please fill all the fields")
  }
  else{
    const reqBody=contactDetails
    const token=sessionStorage.getItem("token")
    console.log(token)
    if(token){
      const reqHeader={
        'Authorization':`Bearer ${token}`
      }

      try {
        const response=await addEmergencyContactAPI(reqBody,reqHeader)
        console.log(response)
        if(response.status==200){
          alert("Emergency contact added successfully")
          onOpenChange(false)
          setContactDetails({fullname:"",phoneNumber:"",email:""})
        }
        else{
          if(response.response.data.error){
            if(response.response.data.error.errors.phoneNumber){
              alert(response.response.data.error.errors.phoneNumber.message)
            }
            else{
              alert(response.response.data.error.errors.email.message)
              
            }
            }
            else{
              alert(response.response.data.message)
            } 
        }
      } catch (error) {
        console.log(error)
        alert("Error Occured",error)
      }
    }
  }
}
  // console.log(contactDetails)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Emergency Contact</DialogTitle>
        </DialogHeader>
        <form  className="space-y-4">
          <div className="space-y-2">
            <Input
              name="name"
              placeholder="Full Name"
              // value={formData.name}
              onChange={(e)=>setContactDetails({...contactDetails,fullname:e.target.value})}
              // className={errors.name ? "border-red-500" : ""}
            />
            {/* {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )} */}
          </div>
          <div className="space-y-2">
            <Input
              name="phone"
              placeholder="Phone Number"
              // value={formData.phone}
              onChange={(e)=>setContactDetails({...contactDetails,phoneNumber:e.target.value})}
              // className={errors.phone ? "border-red-500" : ""}
            />
            {/* {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )} */}
          </div>
          <div className="space-y-2">
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              // value={formData.email}
              onChange={(e)=>setContactDetails({...contactDetails,email:e.target.value})}
              // className={errors.email ? "border-red-500" : ""}
            />
            {/* {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )} */}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" 
            onClick={handleAddContact}
            >
              Add Contact
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddContactForm;