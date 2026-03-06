import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Pencil, X, Check, User } from "lucide-react";
import { toast } from "sonner";
import { getUserDetailsAPI, updateProfileAPI } from "../../../Services/allAPI";
import { serverUrl } from "../../../Services/serverURL";

const MotionDiv = motion.div;

function getLabelClass() {
  return "block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide";
}

function getInputClass(disabled) {
  if (disabled) return "w-full px-3 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 text-sm outline-none cursor-not-allowed";
  return "w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-800 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";
}

function getSelectClass(disabled) {
  if (disabled) return "w-full px-3 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 text-sm outline-none cursor-not-allowed";
  return "w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-800 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";
}

const UserInfo = ({ onProfileUpdated }) => {
  const [isEditing,   setIsEditing]   = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [original,    setOriginal]    = useState({});
  const [avatarFile,  setAvatarFile]  = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    const reqHeader = { "Authorization": "Bearer " + token };
    try {
      const res = await getUserDetailsAPI(reqHeader);
      if (res && res.status === 200) {
        const user = res.data.User;
        setUserDetails(user);
        setOriginal(user);
        // Store username in sessionStorage for WelcomeHeader
        sessionStorage.setItem("username", user.username || "");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }

  function handleEditStart() {
    setIsEditing(true);
    setNewPassword("");
  }

  function handleCancel() {
    setUserDetails(original);
    setAvatarFile(null);
    setAvatarPreview("");
    setNewPassword("");
    setIsEditing(false);
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setUserDetails((prev) => ({ ...prev, profilePic: file }));
  }

  async function handleSave() {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    setSaving(true);

    const reqBody = new FormData();
    reqBody.append("username", userDetails.username || "");
    reqBody.append("gender",   userDetails.gender   || "");
    if (userDetails.dateOfBirth) {
      reqBody.append("dateOfBirth", new Date(userDetails.dateOfBirth).toISOString());
    }
    if (avatarFile) {
      reqBody.append("profilePic", avatarFile);
    }
    if (newPassword && newPassword.trim().length > 0) {
      reqBody.append("password", newPassword);
    }

    const reqHeader = {
      "Content-Type":  "multipart/form-data",
      "Authorization": "Bearer " + token,
    };
    try {
      const res = await updateProfileAPI(reqBody, reqHeader);
      if (res && (res.status === 200 || res.status === 201)) {
        toast.success("Profile updated successfully");
        await fetchUser();
        setAvatarFile(null);
        setAvatarPreview("");
        setNewPassword("");
        setIsEditing(false);
        if (onProfileUpdated) onProfileUpdated();
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const avatarSrc   = avatarPreview || (userDetails.profilePic ? serverUrl + "/Uploads/" + userDetails.profilePic : "");
  const initials    = (userDetails.username || "U").charAt(0).toUpperCase();
  const dobValue    = userDetails.dateOfBirth ? userDetails.dateOfBirth.slice(0, 10) : "";
  const inputClass  = getInputClass(!isEditing);
  const selectClass = getSelectClass(!isEditing);
  const labelClass  = getLabelClass();

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white border border-neutral-200 rounded-xl overflow-hidden"
    >
      {/* Header bar */}
      <div className="px-5 sm:px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
        <h2 className="font-bold text-base text-neutral-800">Personal Information</h2>
        {!isEditing && (
          <button
            onClick={handleEditStart}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        )}
        {isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-700 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
            >
              <Check className="w-3.5 h-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-6">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-neutral-200 overflow-hidden bg-neutral-100 flex items-center justify-center">
                {avatarSrc
                  ? <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                  : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                      <span className="text-white font-bold text-2xl">{initials}</span>
                    </div>
                  )
                }
              </div>
              {isEditing && (
                <button
                  onClick={() => fileRef.current && fileRef.current.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={handleAvatarChange}
              />
            </div>
            {isEditing && (
              <p className="text-xs text-neutral-400 text-center">
                Click camera to change
              </p>
            )}
          </div>

          {/* Fields */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                value={userDetails.username || ""}
                onChange={(e) => setUserDetails((prev) => ({ ...prev, username: e.target.value }))}
                disabled={!isEditing}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={userDetails.email || ""}
                disabled
                className={getInputClass(true)}
              />
              <p className="text-xs text-neutral-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className={labelClass}>
                {isEditing ? "New Password (leave blank to keep current)" : "Password"}
              </label>
              {isEditing
                ? (
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className={inputClass}
                  />
                ) : (
                  <input
                    type="password"
                    value="••••••••••••"
                    disabled
                    className={getInputClass(true)}
                  />
                )
              }
            </div>

            <div>
              <label className={labelClass}>Gender</label>
              <select
                value={userDetails.gender || ""}
                onChange={(e) => setUserDetails((prev) => ({ ...prev, gender: e.target.value }))}
                disabled={!isEditing}
                className={selectClass}
              >
                <option value="">Select a gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2 sm:max-w-xs">
              <label className={labelClass}>Date of Birth</label>
              <input
                type="date"
                value={dobValue}
                onChange={(e) => setUserDetails((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                disabled={!isEditing}
                className={inputClass}
              />
            </div>

          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

export default UserInfo;