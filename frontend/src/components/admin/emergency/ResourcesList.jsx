import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// Dummy data for demonstration
const initialResources = [
  {
    id: 1,
    title: "Emergency Preparedness Guide",
    type: "Guide",
    description: "A comprehensive guide for emergency preparedness",
    lastUpdated: "2024-02-20",
  },
  {
    id: 2,
    title: "Safety Tips During Natural Disasters",
    type: "Tips",
    description: "Essential safety tips for various natural disasters",
    lastUpdated: "2024-02-18",
  },
];
const ResourcesList = ({ searchTerm }) => {
  const [resources, setResources] = useState(initialResources);
  const handleDelete = (id) => {
    setResources(resources.filter((resource) => resource.id !== id));
    toast.success("Resource deleted successfully");
  };
  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="rounded-md border">
      <Table className='bg-white rounded-lg'>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredResources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell className="font-medium">{resource.title}</TableCell>
              <TableCell>{resource.type}</TableCell>
              <TableCell className="hidden md:table-cell">
                {resource.description}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {resource.lastUpdated}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Edit functionality to be implemented")}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className='bg-secondary text-white'
                    onClick={() => handleDelete(resource.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default ResourcesList;