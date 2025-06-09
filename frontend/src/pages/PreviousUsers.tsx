
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { assignmentApi } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export default function PreviousUsers() {
  const [assignmentHistory, setAssignmentHistory] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    employee: '',
    item: '',
    serialNumber: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await assignmentApi.getHistory();
        
        // Process data for display
        const formattedHistory = response.data.map((item: any) => ({
          id: item._id,
          item: item.productId?.model || "Unknown Item",
          itemType: item.productId?.productType || "Unknown",
          serialNumber: item.productId?.serialNumber || "",
          employee: item.employeeName,
          department: item.department,
          assignedDate: new Date(item.assignedDate).toLocaleDateString(),
          returnedDate: item.actualReturnDate ? new Date(item.actualReturnDate).toLocaleDateString() : "",
          condition: getConditionFromNotes(item.notes)
        }));
        
        setAssignmentHistory(formattedHistory);
        setFilteredHistory(formattedHistory);
      } catch (error) {
        console.error('Failed to fetch history:', error);
        toast({
          title: "Error",
          description: "Failed to load assignment history. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    fetchHistory();
  }, [toast]);

  // Helper function to extract condition from notes
  const getConditionFromNotes = (notes: string = '') => {
    const lowerNotes = notes.toLowerCase();
    if (lowerNotes.includes('excellent')) return 'Excellent';
    if (lowerNotes.includes('good')) return 'Good';
    if (lowerNotes.includes('fair')) return 'Fair';
    if (lowerNotes.includes('poor')) return 'Poor';
    return 'Good'; // Default
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const filtered = assignmentHistory.filter(history => {
      return (
        (filters.employee === '' || 
          history.employee.toLowerCase().includes(filters.employee.toLowerCase())) &&
        (filters.item === '' || 
          history.item.toLowerCase().includes(filters.item.toLowerCase()) ||
          history.itemType.toLowerCase().includes(filters.item.toLowerCase())) &&
        (filters.serialNumber === '' || 
          history.serialNumber.toLowerCase().includes(filters.serialNumber.toLowerCase()))
      );
    });
    
    setFilteredHistory(filtered);
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Previous Users</h1>
          <p className="text-gray-600 mt-1">View equipment assignment history</p>
        </div>
      </div>
      
      <Card className="shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Search History</CardTitle>
          <CardDescription>Filter assignment history by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input 
              placeholder="Search by employee name" 
              name="employee" 
              value={filters.employee}
              onChange={handleFilterChange}
            />
            <Input 
              placeholder="Search by item type or model" 
              name="item" 
              value={filters.item}
              onChange={handleFilterChange}
            />
            <Input 
              placeholder="Search by serial number" 
              name="serialNumber" 
              value={filters.serialNumber}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Assignment History</CardTitle>
          <CardDescription>Past equipment assignments and returns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Serial Number</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Assigned</th>
                  <th className="px-4 py-3">Returned</th>
                  <th className="px-4 py-3">Condition</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((history, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{history.id}</td>
                      <td className="px-4 py-3">{history.item}</td>
                      <td className="px-4 py-3">{history.itemType}</td>
                      <td className="px-4 py-3">{history.serialNumber}</td>
                      <td className="px-4 py-3">{history.employee}</td>
                      <td className="px-4 py-3">{history.department}</td>
                      <td className="px-4 py-3">{history.assignedDate}</td>
                      <td className="px-4 py-3">{history.returnedDate}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium
                          ${history.condition === 'Excellent' ? 'bg-green-100 text-green-800' : ''}
                          ${history.condition === 'Good' ? 'bg-blue-100 text-blue-800' : ''}
                          ${history.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${history.condition === 'Poor' ? 'bg-red-100 text-red-800' : ''}
                          `}
                        >
                          {history.condition}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                      No assignment history found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
