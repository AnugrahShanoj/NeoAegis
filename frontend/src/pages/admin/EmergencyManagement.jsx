import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmergencyContactsList from "@/components/admin/emergency/EmergencyContactsList";
import ResourcesList from "@/components/admin/emergency/ResourcesList";
import AddContactModal from "@/components/admin/emergency/AddContactModal";
import AddResourceModal from "@/components/admin/emergency/AddResourceModal";
import LayoutWrapper from "../../components/LayoutWrapper";
const EmergencyManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");
  return (
    <LayoutWrapper>
      <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Emergency Management</h1>
          <p className="text-muted-foreground">
            Manage emergency contacts and safety resources
          </p>
        </div>
      </div>
      <Tabs defaultValue="contacts" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <div className="my-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          {activeTab === "contacts" ? (
            <Button onClick={() => setShowAddContact(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          ) : (
            <Button onClick={() => setShowAddResource(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Resource
            </Button>
          )}
        </div>
        <TabsContent value="contacts" className="mt-4">
          <EmergencyContactsList searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent value="resources" className="mt-4">
          <ResourcesList searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
      <AddContactModal
        open={showAddContact}
        onOpenChange={setShowAddContact}
      />
      <AddResourceModal
        open={showAddResource}
        onOpenChange={setShowAddResource}
      />
    </div>
    </LayoutWrapper>
  );
};
export default EmergencyManagement;