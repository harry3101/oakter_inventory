import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Computer, Laptop, Printer, HardDrive, FileSpreadsheet, Upload, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBox from '@/components/SearchBox';
import { cn } from '@/lib/utils';
import { inventoryApi, assignmentApi } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { exportToExcel, importFromExcel } from '@/utils/excelExport';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [stats, setStats] = useState([
    { title: "Total Laptops", value: "0", icon: Laptop, color: "bg-oak-yellow text-black", type: "Laptop" },
    { title: "Assigned Laptops", value: "0", icon: Laptop, color: "bg-green-100 text-green-600", type: "AssignedLaptop" },
    { title: "Printers", value: "0", icon: Printer, color: "bg-purple-100 text-purple-600", type: "Printer" },
    { title: "Adapters", value: "0", icon: HardDrive, color: "bg-amber-100 text-amber-600", type: "Adapter" },
  ]);
  
  const [assignmentsByType, setAssignmentsByType] = useState({
    Laptop: [],
    Printer: [],
    Adapter: [],
    Misc: []
  });
  
  const [selectedType, setSelectedType] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = React.useRef(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Search and filter state
  const [searchTerms, setSearchTerms] = useState({
    Laptop: '',
    Printer: '',
    Adapter: '',
    Misc: ''
  });
  const [activeFilters, setActiveFilters] = useState({
    Laptop: 'all',
    Printer: 'all',
    Adapter: 'all',
    Misc: 'all'
  });
  const [filterByOptions, setFilterByOptions] = useState({
    Laptop: 'any',
    Printer: 'any',
    Adapter: 'any',
    Misc: 'any'
  });

  // Initialize filteredAssignments with the same structure as assignmentsByType
  const [filteredAssignments, setFilteredAssignments] = useState({
    Laptop: [],
    Printer: [],
    Adapter: [],
    Misc: []
  });

  useEffect(() => {
    fetchData();
  }, [toast]);

  useEffect(() => {
    // Apply filtering whenever raw data or search/filter parameters change
    applyFilters();
  }, [assignmentsByType, searchTerms, activeFilters, filterByOptions]);

  const applyFilters = () => {
    const newFiltered = {
      Laptop: [],
      Printer: [],
      Adapter: [],
      Misc: []
    };

    Object.keys(assignmentsByType).forEach(type => {
      const searchTerm = searchTerms[type].toLowerCase();
      const filter = activeFilters[type];
      const filterBy = filterByOptions[type];
      
      newFiltered[type] = assignmentsByType[type].filter(assignment => {
        // Skip filtering if search term is empty
        if (!searchTerm) return true;
        
        // Apply filter by field
        if (filterBy !== 'any') {
          const fieldValue = String(assignment[filterBy] || '').toLowerCase();
          return fieldValue.includes(searchTerm);
        }

        // Search across all fields if filterBy is 'any'
        return (
          String(assignment.item || '').toLowerCase().includes(searchTerm) ||
          String(assignment.employee || '').toLowerCase().includes(searchTerm) ||
          String(assignment.department || '').toLowerCase().includes(searchTerm) ||
          String(assignment.date || '').toLowerCase().includes(searchTerm) ||
          String(assignment.employee_id || '').toLowerCase().includes(searchTerm) ||
          String(assignment.laptop_serial || '').toLowerCase().includes(searchTerm) ||
          String(assignment.adapter_serial || '').toLowerCase().includes(searchTerm)
        );
      });
    });

    setFilteredAssignments(newFiltered);
  };

  const handleSearch = (type, term, filter, filterBy) => {
    setSearchTerms(prev => ({...prev, [type]: term}));
    setActiveFilters(prev => ({...prev, [type]: filter}));
    setFilterByOptions(prev => ({...prev, [type]: filterBy}));
  };

  const fetchData = async () => {
    try {
      // Get inventory stats
      const inventory = await inventoryApi.getAll();
      const activeAssignments = await assignmentApi.getActive();
      
      // Count laptops, printers, adapters
      const allItems = inventory.data;
      const laptops = allItems.filter((item) => item.productType === 'Laptop');
      const printers = allItems.filter((item) => item.productType === 'Printer');
      const adapters = allItems.filter((item) => item.productType === 'Adapter');
      const assignedLaptops = activeAssignments.data.filter(
        (a) => a.productId?.productType === 'Laptop'
      );

      // Update stats
      setStats([
        { title: "Total Laptops", value: laptops.length.toString(), icon: Laptop, color: "bg-oak-yellow text-black", type: "Laptop" },
        { title: "Assigned Laptops", value: assignedLaptops.length.toString(), icon: Laptop, color: "bg-green-100 text-green-600", type: "AssignedLaptop" },
        { title: "Printers", value: printers.length.toString(), icon: Printer, color: "bg-purple-100 text-purple-600", type: "Printer" },
        { title: "Adapters", value: adapters.length.toString(), icon: HardDrive, color: "bg-amber-100 text-amber-600", type: "Adapter" },
      ]);

      // Format assignment data for display and group by type
      const formattedAssignments = activeAssignments.data.map((assignment) => ({
        id: assignment._id,
        item: assignment.model || "Unknown Item",
        employee: assignment.employeeName,
        department: assignment.department,
        date: new Date(assignment.assignedDate).toLocaleDateString(),
        employee_id: assignment.employeeId?.employeeId || "",
        laptop_serial: assignment.assetType === 'Laptop' ? assignment.serialNumber : "",
        adapter_serial: assignment.assetType === 'Adapter' ? assignment.serialNumber : "",
        employee_type: assignment.employeeId?.employeeType || "",
        product_type: assignment.assetType || "Misc"
      }));

      // Group assignments by product type
      const laptopAssignments = formattedAssignments.filter(a => a.product_type === 'Laptop');
      const printerAssignments = formattedAssignments.filter(a => a.product_type === 'Printer');
      const adapterAssignments = formattedAssignments.filter(a => a.product_type === 'Adapter');
      const miscAssignments = formattedAssignments.filter(a => 
        !['Laptop', 'Printer', 'Adapter'].includes(a.product_type)
      );

      const newAssignmentsByType = {
        Laptop: laptopAssignments,
        Printer: printerAssignments,
        Adapter: adapterAssignments,
        Misc: miscAssignments
      };
      
      setAssignmentsByType(newAssignmentsByType);
      setFilteredAssignments(newAssignmentsByType); // Initialize filtered with all data
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleExportToExcel = () => {
    const dataToExport = selectedType ? filteredAssignments[selectedType] : 
      [...filteredAssignments.Laptop, ...filteredAssignments.Printer, 
       ...filteredAssignments.Adapter, ...filteredAssignments.Misc];
    
    if (dataToExport.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no assignments to export.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      exportToExcel(dataToExport, `IT_Inventory_${selectedType || 'All'}_Assignments`);
      toast({
        title: "Export Successful",
        description: "Assignment data has been exported to Excel successfully.",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data to Excel. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    try {
      const importedData = await importFromExcel(file);
      
      if (importedData.length === 0) {
        toast({
          title: "Import Error",
          description: "The Excel file doesn't contain any data.",
          variant: "destructive",
        });
      } else {
        // Process the imported data
        const processedData = importedData.map((item, index) => ({
          id: item.id || `imported-${index}`,
          item: item.item || item.model || "Unknown Item",
          employee: item.employee || item.employeeName || "",
          department: item.department || "",
          date: item.date || new Date().toLocaleDateString(),
          employee_id: item.employee_id || "",
          laptop_serial: item.laptop_serial || "",
          adapter_serial: item.adapter_serial || "",
          employee_type: item.employee_type || "",
          product_type: item.product_type || "Misc"
        }));
        
        toast({
          title: "Import Successful",
          description: `Imported ${processedData.length} assignments from Excel.`,
        });

        // Refresh data after import
        fetchData();
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import data from Excel. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleNavigateToAssignmentType = (type) => {
    if (type === "Laptop") {
      navigate('/laptop-assignment');
    } else if (type === "Printer") {
      navigate('/printer-assignment');
    } else if (type === "Adapter") {
      navigate('/adapter-assignment');
    } else if (type === "Misc") {
      navigate('/misc-assignment');
    }
  };

  const getTypeWithCount = (type) => {
    let count = 0;
    if (type === "Laptop") count = filteredAssignments.Laptop.length;
    else if (type === "Printer") count = filteredAssignments.Printer.length;
    else if (type === "Adapter") count = filteredAssignments.Adapter.length;
    else if (type === "Misc") count = filteredAssignments.Misc.length;
    
    return `${type} Assignments (${count})`;
  };

  // Render assignment list for a specific type
  const renderAssignmentList = (type) => {
    return (
      <div className="overflow-hidden">
        <h3 className="text-xl font-semibold mb-4">{getTypeWithCount(type)}</h3>
        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-4">
            <SearchBox 
              onSearch={(term, filter, filterBy) => handleSearch(type, term, filter, filterBy)} 
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments[type].length > 0 ? (
                filteredAssignments[type].map((assignment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {assignment.id.startsWith('imported-') && (
                          <Badge variant="outline" className="mr-2 bg-purple-100 text-purple-800 text-xs">
                            Imported
                          </Badge>
                        )}
                        <span className="truncate max-w-[100px]">{assignment.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>{assignment.item}</TableCell>
                    <TableCell>{assignment.employee}</TableCell>
                    <TableCell>{assignment.department}</TableCell>
                    <TableCell>{assignment.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No {type} assignments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <img 
              src="/lovable-uploads/e53601a9-4a77-4d18-a9b0-bc4ba5986c03.png" 
              alt="OAK IT Inventory" 
              className="h-8 mr-3 animate-pulse-gentle" 
            />
            IT Inventory Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Manage your IT equipment and assignments</p>
        </div>
        <div className="mt-4 md:mt-0 text-sm text-gray-500">
          Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm card-3d hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2 text-oak-darkgray">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} icon-3d`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm card-3d hover:shadow-lg">
          <CardHeader className="bg-gradient-to-r from-oak-lightgray to-white rounded-t-lg flex flex-row justify-between items-center">
            <div>
              <CardTitle>Assignment Lists</CardTitle>
              <CardDescription>Click on a category to view all assignments</CardDescription>
            </div>
            <div className="flex space-x-2">
              {selectedType && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                  onClick={() => setSelectedType(null)}
                >
                  <RefreshCw size={14} className="text-blue-600" />
                  Back to Lists
                </Button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                className="hidden"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
                      onClick={handleImportClick}
                      disabled={isImporting}
                    >
                      {isImporting ? (
                        <RefreshCw size={14} className="text-purple-600 animate-spin" />
                      ) : (
                        <Upload size={14} className="text-purple-600" />
                      )}
                      Import
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Import assignments from Excel file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                      onClick={handleExportToExcel}
                    >
                      <FileSpreadsheet size={14} className="text-green-600" />
                      Export
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export assignments to Excel file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            {selectedType ? (
              renderAssignmentList(selectedType)
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Laptop Assignments */}
                <div 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                  onClick={() => setSelectedType('Laptop')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-oak-yellow text-black">
                        <Laptop size={24} />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold">Laptop Assignments</h3>
                        <p className="text-sm text-gray-500">{assignmentsByType.Laptop.length} assignments</p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </div>

                {/* Printer Assignments */}
                <div 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                  onClick={() => setSelectedType('Printer')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                        <Printer size={24} />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold">Printer Assignments</h3>
                        <p className="text-sm text-gray-500">{assignmentsByType.Printer.length} assignments</p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </div>

                {/* Adapter Assignments */}
                <div 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                  onClick={() => setSelectedType('Adapter')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                        <HardDrive size={24} />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold">Adapter Assignments</h3>
                        <p className="text-sm text-gray-500">{assignmentsByType.Adapter.length} assignments</p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </div>

                {/* Misc Assignments */}
                <div 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                  onClick={() => setSelectedType('Misc')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <Computer size={24} />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold">Misc Assignments</h3>
                        <p className="text-sm text-gray-500">{assignmentsByType.Misc.length} assignments</p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-oak-lightgray to-white rounded-t-lg">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common inventory tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            <a href="/laptop-assignment" 
              className="flex items-center p-3 rounded-md hover:bg-gray-100 text-gray-700 
              transition-all duration-200 hover:translate-x-2 hover:shadow-md">
              <Laptop size={18} className="mr-3 text-oak-gold" />
              <span>Assign New Laptop</span>
            </a>
            <a href="/printer-assignment" 
              className="flex items-center p-3 rounded-md hover:bg-gray-100 text-gray-700 
              transition-all duration-200 hover:translate-x-2 hover:shadow-md">
              <Printer size={18} className="mr-3 text-oak-gold" />
              <span>Assign New Printer</span>
            </a>
            <a href="/adapter-assignment" 
              className="flex items-center p-3 rounded-md hover:bg-gray-100 text-gray-700 
              transition-all duration-200 hover:translate-x-2 hover:shadow-md">
              <HardDrive size={18} className="mr-3 text-oak-gold" />
              <span>Assign New Adapter</span>
            </a>
            <a href="/previous-users" 
              className="flex items-center p-3 rounded-md hover:bg-gray-100 text-gray-700 
              transition-transform hover:translate-x-2 icon-3d">
              <Computer size={18} className="mr-3 text-oak-gold animate-pulse-gentle" />
              <span>View Assignment History</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
