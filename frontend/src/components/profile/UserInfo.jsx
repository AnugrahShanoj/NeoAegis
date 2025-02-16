import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { getUserDetailsAPI, updateProfileAPI } from "../../../Services/allAPI";

const UserInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
 
  const [avatar, setAvatar] = useState("/placeholder.svg");
  const [token, setToken]=useState("")
  const [userDetails, setUserDetails]=useState({})

 const handleGetUser= async()=>{
  if(token){
      const reqHeader = {
        "Authorization": `Bearer ${token}`,
    }
    try {
      const response= await getUserDetailsAPI(reqHeader)
    console.log(response)
    if(response.status==200){
      setUserDetails(response.data.User)
      setAvatar(response.data.User.profilePic)
    }
    else{
      alert("Cannot Fetch User Details")
    }
    } catch (error) {
      console.log("Error in fetching user details: ",error)
    }
  }
 }

 // Function to edit User Details
 const handleUserEdit= async()=>{
  console.log("User Details: ",userDetails)
  const {username, password, profilePic, gender, dateOfBirth}= userDetails
  const reqBody= new FormData()
  reqBody.append("username",username)
  reqBody.append("password",password)
  reqBody.append("profilePic",profilePic)
  reqBody.append("gender",gender)
 // Convert dateOfBirth to proper Date format
 if (dateOfBirth) {
  reqBody.append("dateOfBirth", new Date(dateOfBirth).toISOString());
}

  if(token){
    const reqHeader={
      'Content-Type':`multipart/form-data`,
      'Authorization':`Bearer ${token}`
    }
    try {
      const response= await updateProfileAPI(reqBody,reqHeader)
      console.log(response)
    } catch (error) {
      console.log("Error while updating user profile: ",error)
    }
  }
 }
// console.log(userDetails)
 useEffect(()=>{
  setToken(sessionStorage.getItem('token'))
  handleGetUser()
 },[token])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32"> {/* Increased size of Avatar */}
                <AvatarImage src={avatar} alt="Profile" />
                {/* <AvatarFallback>AP</AvatarFallback> */}
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png"
                  onChange={(e)=>setUserDetails({...userDetails, profilePic:e.target.files[0]})}
                />
              </label>
            </div>
            <div className="flex-1 space-y-4 w-full sm:w-auto">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={userDetails.username}
                  onChange={(e) => setUserDetails({...userDetails, username:e.target.value})}
                  disabled={!isEditing}
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={userDetails.email}
                  disabled
                  className="max-w-md bg-neutral-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={userDetails.password}
                  onChange={(e) => setUserDetails({...userDetails, password:e.target.value})}
                  disabled={!isEditing}
                  className="max-w-md"
                />
              </div>
              <div className="flex gap-4"> {/* Flex container for gender and dob */}
                <div className="space-y-2 flex-1">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={userDetails.gender}
                    onChange={(e) => setUserDetails({...userDetails, gender:e.target.value})}
                    disabled={!isEditing}
                    className="border  rounded p-2 w-full"
                  >
                    <option>Select A Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    // value={userDetails.dateOfBirth}
                    onChange={(e) => setUserDetails({...userDetails, dateOfBirth:e.target.value})}
                    disabled={!isEditing}
                    className="max-w-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            {isEditing ? (
              <Button onClick={handleUserEdit} >Save Changes</Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserInfo;