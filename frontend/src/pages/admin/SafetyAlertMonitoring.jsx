import { useState } from "react";
import { MapPin, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import LayoutWrapper from "../../components/LayoutWrapper";
// Sample data for demonstration
const activeAlerts = [
  {
    id: 1,
    userName: "Anugrah P",
    userEmail: "anugrah@example.com",
    location: "Ernakulam",
    timestamp: "2024-03-15T14:30:00",
    status: "pending",
  },
  {
    id: 2,
    userName: "Dalish T K",
    userEmail: "dalu123@example.com",
    location: "Kozhikode",
    status: "acknowledged",
    timestamp: "2024-03-15T13:15:00",
  },
];
const alertHistory = [
  {
    id: 1,
    userName: "Midhun K Mohan",
    userEmail: "midhun@example.com",
    location: "Dubai",
    timestamp: "2024-03-14T10:30:00",
    status: "resolved",
  },
];
const SafetyAlertMonitoring = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const handleAcknowledge = (alertId) => {
    // In a real app, this would make an API call
    toast.success("Alert acknowledged successfully");
  };
  const handleResolve = (alertId) => {
    // In a real app, this would make an API call
    toast.success("Alert resolved successfully");
  };
  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setIsDetailsModalOpen(true);
  };
  const filteredHistory = alertHistory.filter((alert) => {
    const matchesSearch =
      alert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? alert.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });
  return (
   <LayoutWrapper>
     <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold">Safety Alert Monitoring</h1>
        <p className="text-muted-foreground mt-2">
          Monitor active SOS alerts triggered by users and review their history.
        </p>
      </div>
      {/* Active Alerts Section */}
      <Card className='bg-white'>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{alert.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {alert.userEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {alert.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(alert.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          alert.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className='bg-black text-white'
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          Acknowledge
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className='bg-secondary text-white'
                          onClick={() => handleResolve(alert.id)}
                        >
                          Resolve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(alert)}
                        >
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {activeAlerts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No active alerts
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Alert History Section */}
      <Card className='bg-white'>
        <CardHeader>
          <CardTitle>Alert History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem value="All Statuses">All statuses</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{alert.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {alert.userEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {alert.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(alert.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          alert.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(alert)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredHistory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No alerts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Alert Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">User Information</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAlert.userName} ({selectedAlert.userEmail})
                </p>
              </div>
              <div>
                <h3 className="font-medium">Location</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAlert.location}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Time</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedAlert.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedAlert.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : selectedAlert.status === "acknowledged"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedAlert.status.charAt(0).toUpperCase() +
                    selectedAlert.status.slice(1)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
   </LayoutWrapper>
  );
};
export default SafetyAlertMonitoring;
