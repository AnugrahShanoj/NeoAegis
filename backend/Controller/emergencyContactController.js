// Import Emergency Contact collection 
const EmergencyContact=require('../Models/emergencyContactSchema')

// 1 Logic for adding a new emergency contact
exports.addEmergencyContact= async(req,res)=>{
    console.log("Inside Emergency Contact Add")
    const {fullname,phoneNumber,email}=req.body
    const {userId}=req.payload // jwt Middleware
    console.log("UserId Obtained: ",userId)
    try {
        const existingContact=await EmergencyContact.findOne({userId,phoneNumber})
        if(existingContact){
            return res.status(400).json({ message: "Emergency contact already exists."});
        }
        // Create new Emergency Contact
        const newContact= new EmergencyContact({
            fullname,phoneNumber,email,userId
        })
        await newContact.save()
        console.log("Contact Added Successfully")
        res.status(200).json(newContact)
    } catch (error) {
        console.error("Error adding emergency contact: ", error);
        res.status(500).json({message: "Server error while adding emergency contact",error,});
    }
}


// 2 Logic for getting all emergency contacts of a particular user
exports.getEmergencyContacts= async(req,res)=>{
    console.log("Inside Emergency Contact Get")
    const {userId}=req.payload // jwt Middleware
    console.log("UserId Obtained: ",userId)
    try {
        const response= await EmergencyContact.find({userId})
        res.status(200).json(response)
    } catch (error) {
        console.log("Error Occured: ",error)
        res.status(402).json(error)
    }
}

// 3 Logic for delete a particular contact
exports.deleteEmergencyContact= async(req,res)=>{
    console.log("Inside Emergency Contact Delete")
    const {contactId}=req.params
    console.log("ContactId Obtained: ",contactId)
    try {
        const deleteContact= await  EmergencyContact.findByIdAndDelete({_id:contactId})
        res.status(200).json(deleteContact)
    } catch (error) {
        console.log("Error In Deleting Contact: ",error)
        res.status(403).json(error)
    }
}


// 4 Logic for edit an emergency contact
exports.editEmergencyContact= async(req,res)=>{
    console.log("Inside Emergency Contact Edit")
    const {contactId}=req.params
    console.log("ContactId Obtained: ",contactId)
    const {fullname,phoneNumber,email}=req.body
    console.log("Contact Details Obtained: ",fullname,phoneNumber,email)
    try {
        console.log("Inside edit try")
        const editContact= await EmergencyContact.findByIdAndUpdate({_id:contactId},{
            fullname:fullname,
            phoneNumber:phoneNumber,
            email:email
        })
        await editContact.save()
        res.status(200).json(editContact)

    } catch (error) {
        console.log("Error In Editing Contact",error)
        res.status(403).json(error)
    }
}