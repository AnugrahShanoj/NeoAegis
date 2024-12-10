import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BellRing, CheckCircle, Users } from "lucide-react";

const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white shadow-sm hover:shadow-2xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <BellRing className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  SOS Alerts
                </p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white shadow-sm hover:shadow-2xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  Safety Check-ins
                </p>
                <h3 className="text-2xl font-bold mt-1">12</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white shadow-sm hover:shadow-2xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  Emergency Contacts
                </p>
                <h3 className="text-2xl font-bold mt-1">3</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuickStats;