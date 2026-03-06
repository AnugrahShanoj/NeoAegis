import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UserInfo from "./UserInfo";
import ActivityLogs from "./ActivityLogs";
import Settings from "./Settings";
import LayoutWrapper from "../LayoutWrapper";
import { getActivityLogsAPI } from "../../../Services/allAPI";

const MotionDiv = motion.div;

const ProfileContent = () => {
  const [logs,        setLogs]        = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLogsLoading(true);
    const token = sessionStorage.getItem("token");
    if (!token) { setLogsLoading(false); return; }
    const reqHeader = {
      "Content-Type":  "application/json",
      "Authorization": "Bearer " + token,
    };
    try {
      const res = await getActivityLogsAPI(reqHeader);
      if (res && res.data && Array.isArray(res.data)) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
    } finally {
      setLogsLoading(false);
    }
  }

  return (
    <LayoutWrapper>
      <div className="max-w-5xl mx-auto px-2 sm:px-4 pt-4 pb-10">
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
            Profile Settings
          </h1>
          <div className="space-y-5">
            <UserInfo onProfileUpdated={fetchLogs} />
            <Settings />
            <ActivityLogs logs={logs} loading={logsLoading} onRefresh={fetchLogs} />
          </div>
        </MotionDiv>
      </div>
    </LayoutWrapper>
  );
};

export default ProfileContent;