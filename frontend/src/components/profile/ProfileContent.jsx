import { motion } from "framer-motion";
import UserInfo from "./UserInfo";
import Settings from "./Settings";
import ActivityLogs from "./ActivityLogs";
import LayoutWrapper from "../LayoutWrapper";
const ProfileContent = () => {
  return (
    <LayoutWrapper>
      <div className="max-w-5xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-8">Profile Settings</h1>
        
        <div className="space-y-6">
          <UserInfo />
          <Settings />
          <ActivityLogs />
        </div>
      </motion.div>
    </div>
    </LayoutWrapper>
  );
};
export default ProfileContent;