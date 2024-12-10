import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Bell, CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";
const activities = [
  {
    id: 1,
    type: "sos",
    title: "SOS Alert Triggered",
    timestamp: "2024-03-10T14:30:00",
    icon: AlertCircle,
    iconColor: "text-red-500",
    bgColor: "bg-red-50"
  },
  {
    id: 2,
    type: "checkin",
    title: "Safety Check-in Completed",
    timestamp: "2024-03-09T10:15:00",
    icon: CheckCircle,
    iconColor: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    id: 3,
    type: "notification",
    title: "Notification Settings Updated",
    timestamp: "2024-03-08T16:45:00",
    icon: Bell,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50"
  }
];
const ActivityLogs = () => {
  const [filter, setFilter] = useState("all");
  const [currentPage] = useState(1);
  const itemsPerPage = 5;
  const filteredActivities = activities.filter(activity => 
    filter === "all" ? true : activity.type === filter
  );
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);
  const handleExport = (format) => {
    // Simulated export functionality
    toast.success(`Exported activity logs as ${format.toUpperCase()}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Activity Logs</CardTitle>
            <div className="flex items-center gap-3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter activities" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="sos">SOS Alerts</SelectItem>
                  <SelectItem value="checkin">Safety Check-ins</SelectItem>
                  <SelectItem value="notification">Notifications</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleExport('csv')}
                  title="Export as CSV"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {displayedActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                  <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-neutral-800">{activity.title}</p>
                    <span className="text-sm text-neutral-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {displayedActivities.length === 0 && (
              <p className="text-center text-neutral-500 py-4">
                No activities found
              </p>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {/* Pagination UI can be added here if needed */}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
export default ActivityLogs;