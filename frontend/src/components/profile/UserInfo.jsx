import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Camera } from "lucide-react";

const UserInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Username");
  const [email] = useState("abc@gmail.com");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [avatar, setAvatar] = useState("/placeholder.svg");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Only JPEG and PNG formats are supported");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        toast.success("Profile picture updated successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (name.trim().length < 2) {
      toast.error("Name should be at least 2 characters long");
      return;
    }
    if (password.trim().length < 6) {
      toast.error("Password should be at least 6 characters long");
      return;
    }
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

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
                <AvatarFallback>AP</AvatarFallback>
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
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div className="flex-1 space-y-4 w-full sm:w-auto">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="max-w-md bg-neutral-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!isEditing}
                  className="max-w-md"
                />
              </div>
              <div className="flex gap-4"> {/* Flex container for gender and dob */}
                <div className="space-y-2 flex-1">
                  <Label htmlFor="gender">Gender</Label>
 <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={!isEditing}
                    className="border  rounded p-2 w-full"
                  >
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
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    disabled={!isEditing}
                    className="max-w-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            {isEditing ? (
              <Button onClick={handleSave}>Save Changes</Button>
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