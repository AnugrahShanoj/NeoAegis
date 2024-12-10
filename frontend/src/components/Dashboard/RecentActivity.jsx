import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BellRing } from "lucide-react";

const activities = [
  {
    icon: CheckCircle,
    title: "Safety Check-in",
    time: "Nov 30, 2024, 2:18 PM",
    description: "Regular check-in completed",
    color: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    icon: BellRing,
    title: "SOS Alert Test",
    time: "Nov 29, 2024, 4:18 PM",
    description: "Monthly emergency alert test",
    color: "text-red-500",
    bgColor: "bg-red-50"
  }
];

const RecentActivity = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-neutral-800">{activity.title}</p>
                    <span className="text-sm text-neutral-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentActivity;