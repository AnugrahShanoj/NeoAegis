import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, History, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LayoutWrapper from "../components/LayoutWrapper";
import { createSOSAlertAPI, getSOSAlertsAPI, smsAPI } from "../../Services/allAPI";
const SOSAlerts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [token,setToken]=useState("")
  // Sample alert history data
  const [alertHistory, setAlertHistory]=useState([])

  // Function to get the current location
const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        // Fetch the city name using latitude and longitude
        const cityName = await fetchCityName(latitude, longitude);
        
        resolve({ latitude, longitude, cityName });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject("Permission denied: Please allow location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            reject("Position unavailable: Unable to fetch location.");
            break;
          case error.TIMEOUT:
            reject("Timeout: Location request took too long.");
            break;
          default:
            reject("Unknown error occurred while retrieving location.");
        }
      }
    );
  });
};

// Function to fetch the city name based on latitude and longitude
const fetchCityName = async (lat, lon) => {
  const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?key=${OPENCAGE_API_KEY}&q=${lat}+${lon}&pretty=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results[0]?.components.city || 'City not found';
  } catch (error) {
    console.error('Error fetching city name:', error);
    return 'Error fetching city';
  }
};

// Main function that handles sending the alert
const handleSendAlert = async () => {
  try {
    // Wait for the location data to be fetched
    const { latitude, longitude, cityName } = await getLocation();
    if(token){
      const reqHeader = {
        "Authorization": `Bearer ${token}`
      }
      const reqBody={
        "latitude":latitude,
        "longitude":longitude,
        "city":cityName,
        "message":customMessage
      }

      const response= await createSOSAlertAPI(reqBody,reqHeader)
      console.log(response)
      if (response.status === 200) {
        const locationUrl=`https://www.google.com/maps?q=${response.data.alert.location.latitude},${response.data.alert.location.longitude}`
        const msg=`
        Current Location: ${locationUrl}

        City: ${response.data.alert.location.city}
        Message: ${response.data.alert.message}
        `
        const reqBody={
          msg:msg
        }
        const smsResponse= await smsAPI(reqBody,reqHeader)
        console.log(smsResponse)
        if(smsResponse.status==200){
          alert('Alert sent successfully');
        }
        else{
          alert("Alert Not Sent")
          setCustomMessage("");
          setIsDialogOpen(false);
          getAllSOSAlerts()
        }
      }
      else{
        console.log('Error sending alert');
        alert("Error Sending Alert")
      }
      
    }

  } catch (error) {
    console.error('Error in handleSendAlert:', error);
  }
};


  // Function to get all SOS Alerts
  const getAllSOSAlerts = async () => {
    try {
      if(token){
        const reqHeader = {
          "Authorization": `Bearer ${token}`,
        }
        const response= await getSOSAlertsAPI(reqHeader)
        console.log(response)
        if(response.status==200){
          setAlertHistory(response.data)
        }
        else{
          alert("Error fetching SOS Alerts")
        }
      }
    } catch (error) {
      alert("Server Error while fetching SOS Alerts")
    }
  }

  const filteredAlerts = alertHistory.filter(
    (alert) => filter === "all" || alert.status === filter
  );

useEffect(()=>{
  setToken(sessionStorage.getItem('token'))
  getAllSOSAlerts()
},[token])

  return (
    <div className="flex min-h-screen bg-neutral-300/40">
      <DashboardSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <LayoutWrapper>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">SOS Alerts</h1>
            <p className="text-neutral-600">
              Use the SOS feature to alert your emergency contacts during critical situations.
            </p>
          </motion.div>
          {/* Trigger Alert Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className='bg-white'>
              <CardHeader>
                <CardTitle>Send SOS Alert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add a custom message"
                  // value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-6 text-lg"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Bell className="mr-2 h-5 w-5" />
                  SOS Alert
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          {/* Alert History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className='bg-white'>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Alert History
                </CardTitle>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    <SelectItem value="all">All Alerts</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert._id}
                      className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-neutral-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                          <p className="font-medium">{alert.message}</p>
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <MapPin className="h-4 w-4" />
                            {alert.location.city}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              alert.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredAlerts.length === 0 && (
                    <p className="text-center text-neutral-500 py-8">
                      No alerts found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        </LayoutWrapper>
        {/* Confirmation Dialog */}
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm SOS Alert</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to send an SOS alert? This will immediately notify
                all your emergency contacts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleSendAlert}
              >
                Send Alert
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};
export default SOSAlerts;