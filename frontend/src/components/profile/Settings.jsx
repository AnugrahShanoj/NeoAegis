import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
const Settings = () => {
  const [sosAlerts, setSosAlerts] = useState(true);
  const [safetyCheckins, setSafetyCheckins] = useState(true);
  const handleSettingChange = (setting, value) => {
    if (setting === 'sos') {
      setSosAlerts(value);
      toast.success(`SOS Alerts ${value ? 'enabled' : 'disabled'}`);
    } else if (setting === 'safety') {
      setSafetyCheckins(value);
      toast.success(`Safety Check-ins ${value ? 'enabled' : 'disabled'}`);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">SOS Alerts</Label>
              <p className="text-sm text-neutral-500">
                Receive notifications when SOS button is triggered
              </p>
            </div>
            <Switch
              checked={sosAlerts}
              onCheckedChange={(value) => handleSettingChange('sos', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Safety Check-ins</Label>
              <p className="text-sm text-neutral-500">
                Get reminders for periodic safety updates
              </p>
            </div>
            <Switch
              checked={safetyCheckins}
              onCheckedChange={(value) => handleSettingChange('safety', value)}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
export default Settings;