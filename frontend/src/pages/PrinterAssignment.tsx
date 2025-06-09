import React from 'react';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { inventoryApi, employeeApi, assignmentApi } from '@/services/api';
import { Printer } from 'lucide-react';

export default function PrinterAssignment() {
  const { toast } = useToast();
  
  const [formState, setFormState] = React.useState({
    // Employee details
    employeeId: '',
    employeeName: '',
    employeeEmail: '',
    employeeDesignation: '',
    operatorName: '',
    employeeType: 'Full-time',
    location: '',
    
    // Asset details
    assetType: 'printer',
    modelNumber: '',
    assetSerialNumber: '',
    adapterSerialNumber: '',
    macAddress: '',
    ipAddress: '',
    hostName: '',
    officeKeyAccounts: '',
    controlAccounts: '',
    adminPassword: '',
    assetsStatus: 'active',
    previousUser: '',
    partCode: '',
    conditionStatus: 'excellent',
    verifiedStatus: 'unverified',
    
    // Vendor details
    vendorName: '',
    vendorContactNumber: '',
    vendorEmailId: '',
    
    // Purchase details
    assignedDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    purchaseDate: '',
    invoiceNumber: '',
    attachedInvoice: '',
    attachedPO: '',
    poNumber: '',
    price: '',
    transactionDetails: '',
    warranty: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleEmployeeIdBlur = async () => {
    if (formState.employeeId) {
      try {
        const response = await employeeApi.getByEmployeeId(formState.employeeId);
        if (response.data) {
          const employee = response.data;
          setFormState(prev => ({
            ...prev,
            employeeName: employee.name,
            employeeEmail: employee.email || '',
            employeeDesignation: employee.position || '',
            employeeType: employee.employeeType || 'Full-time'
          }));
          toast({
            title: "Employee Found",
            description: `Employee details loaded for ${employee.name}`,
          });
        }
      } catch (error) {
        // Employee not found, but we don't show an error - let them enter details manually
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. First create or get the employee
      let employeeId;
      try {
        const employeeResponse = await employeeApi.getByEmployeeId(formState.employeeId);
        employeeId = employeeResponse.data._id;
      } catch {
        // Employee doesn't exist, create one
        const newEmployeeResponse = await employeeApi.create({
          name: formState.employeeName,
          email: formState.employeeEmail,
          department: 'general', // Default department
          position: formState.employeeDesignation || 'Staff',
          employeeId: formState.employeeId,
          employeeType: formState.employeeType
        });
        employeeId = newEmployeeResponse.data._id;
      }

      // 2. Create the assignment directly
      const assignmentData = {
        employeeId,
        employeeName: formState.employeeName,
        employeeEmail: formState.employeeEmail,
        department: 'general', // Default department
        employeeDesignation: formState.employeeDesignation,
        operatorName: formState.operatorName,
        location: formState.location,
        assignedDate: formState.assignedDate,
        expectedReturnDate: formState.returnDate || undefined,
        notes: formState.transactionDetails || undefined,
        
        // Asset details
        assetType: 'printer',
        serialNumber: formState.assetSerialNumber,
        model: formState.modelNumber,
        manufacturer: formState.vendorName,
        purchaseDate: formState.purchaseDate,
        status: formState.assetsStatus,
        
        // Printer specific details
        adapterSerialNumber: formState.adapterSerialNumber,
        macAddress: formState.macAddress,
        ipAddress: formState.ipAddress,
        hostName: formState.hostName,
        officeKeyAccounts: formState.officeKeyAccounts,
        controlAccounts: formState.controlAccounts,
        adminPassword: formState.adminPassword,
        partCode: formState.partCode,
        
        // Additional details
        previousUser: formState.previousUser,
        price: formState.price,
        invoiceNumber: formState.invoiceNumber,
        poNumber: formState.poNumber,
        warranty: formState.warranty,
        vendorContact: formState.vendorContactNumber,
        vendorEmail: formState.vendorEmailId
      };
      
      await assignmentApi.create(assignmentData);
      
      toast({
        title: "Success!",
        description: "Printer assigned successfully.",
      });
      
      // Reset form
      setFormState({
        // Employee details
        employeeId: '',
        employeeName: '',
        employeeEmail: '',
        employeeDesignation: '',
        operatorName: '',
        employeeType: 'Full-time',
        location: '',
        
        // Asset details
        assetType: 'printer',
        modelNumber: '',
        assetSerialNumber: '',
        adapterSerialNumber: '',
        macAddress: '',
        ipAddress: '',
        hostName: '',
        officeKeyAccounts: '',
        controlAccounts: '',
        adminPassword: '',
        assetsStatus: 'active',
        previousUser: '',
        partCode: '',
        conditionStatus: 'excellent',
        verifiedStatus: 'unverified',
        
        // Vendor details
        vendorName: '',
        vendorContactNumber: '',
        vendorEmailId: '',
        
        // Purchase details
        assignedDate: new Date().toISOString().split('T')[0],
        returnDate: '',
        purchaseDate: '',
        invoiceNumber: '',
        attachedInvoice: '',
        attachedPO: '',
        poNumber: '',
        price: '',
        transactionDetails: '',
        warranty: ''
      });
      
    } catch (error: any) {
      console.error('Assignment failed:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create assignment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Printer className="h-8 w-8" />
          Printer Assignment
        </h1>
        <p className="text-gray-600 mt-1">Assign printers to employees or departments</p>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Printer Assignment Form</CardTitle>
          <CardDescription>Fill in the details to assign a printer to an employee or department</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Asset Information Section */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Asset Information</h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="assetSerialNumber">Asset Serial Number</Label>
                  <Input 
                    id="assetSerialNumber" 
                    placeholder="Enter serial number" 
                    value={formState.assetSerialNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelNumber">Model Number</Label>
                  <Input 
                    id="modelNumber" 
                    placeholder="Enter model number" 
                    value={formState.modelNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partCode">Part Code</Label>
                  <Input 
                    id="partCode" 
                    placeholder="Enter part code" 
                    value={formState.partCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="adapterSerialNumber">Adapter Serial Number</Label>
                  <Input 
                    id="adapterSerialNumber" 
                    placeholder="Enter adapter serial number" 
                    value={formState.adapterSerialNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="macAddress">MAC Address</Label>
                  <Input 
                    id="macAddress" 
                    placeholder="Enter MAC address" 
                    value={formState.macAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ipAddress">IP Address</Label>
                  <Input 
                    id="ipAddress" 
                    placeholder="Enter IP address" 
                    value={formState.ipAddress}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="verifiedStatus">Verified Status</Label>
                  <Select 
                    value={formState.verifiedStatus} 
                    onValueChange={(value) => handleSelectChange('verifiedStatus', value)}
                  >
                    <SelectTrigger id="verifiedStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assetType">Asset Type</Label>
                  <Input 
                    id="assetType" 
                    value="Printer"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conditionStatus">Condition Status</Label>
                  <Select 
                    value={formState.conditionStatus} 
                    onValueChange={(value) => handleSelectChange('conditionStatus', value)}
                  >
                    <SelectTrigger id="conditionStatus">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="hostName">Host Name</Label>
                  <Input 
                    id="hostName" 
                    placeholder="Enter host name" 
                    value={formState.hostName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officeKeyAccounts">Office Key/Accounts</Label>
                  <Input 
                    id="officeKeyAccounts" 
                    placeholder="Enter office key/accounts" 
                    value={formState.officeKeyAccounts}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="controlAccounts">Control Accounts</Label>
                  <Input 
                    id="controlAccounts" 
                    placeholder="Enter control accounts" 
                    value={formState.controlAccounts}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Admin Password</Label>
                  <Input 
                    id="adminPassword" 
                    type="password"
                    placeholder="Enter admin password" 
                    value={formState.adminPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assetsStatus">Asset Status</Label>
                  <Select 
                    value={formState.assetsStatus} 
                    onValueChange={(value) => handleSelectChange('assetsStatus', value)}
                  >
                    <SelectTrigger id="assetsStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="repair">Under Repair</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    placeholder="Enter location" 
                    value={formState.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousUser">Previous User</Label>
                  <Input 
                    id="previousUser" 
                    placeholder="Enter previous user (if any)" 
                    value={formState.previousUser}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Employee Information Section */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Employee Information</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input 
                    id="employeeId" 
                    placeholder="Enter employee ID" 
                    value={formState.employeeId}
                    onChange={handleInputChange}
                    onBlur={handleEmployeeIdBlur}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeName">Employee Name</Label>
                  <Input 
                    id="employeeName" 
                    placeholder="Enter employee name" 
                    value={formState.employeeName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeEmail">Employee Email</Label>
                  <Input 
                    id="employeeEmail" 
                    type="email"
                    placeholder="Enter employee email" 
                    value={formState.employeeEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeDesignation">Employee Designation</Label>
                  <Input 
                    id="employeeDesignation" 
                    placeholder="Enter designation" 
                    value={formState.employeeDesignation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operatorName">Operator Name</Label>
                  <Input 
                    id="operatorName" 
                    placeholder="Enter operator name" 
                    value={formState.operatorName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeType">Employee Type</Label>
                  <Select 
                    value={formState.employeeType} 
                    onValueChange={(value) => handleSelectChange('employeeType', value)}
                  >
                    <SelectTrigger id="employeeType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Vendor Information Section */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Vendor Information</h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input 
                    id="vendorName" 
                    placeholder="Enter vendor name" 
                    value={formState.vendorName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendorContactNumber">Vendor Contact Number</Label>
                  <Input 
                    id="vendorContactNumber" 
                    placeholder="Enter vendor contact" 
                    value={formState.vendorContactNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendorEmailId">Vendor Email ID</Label>
                  <Input 
                    id="vendorEmailId" 
                    type="email"
                    placeholder="Enter vendor email" 
                    value={formState.vendorEmailId}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Purchase Information Section */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Purchase & Assignment Information</h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedDate">Assigned Date</Label>
                  <Input 
                    id="assignedDate" 
                    type="date" 
                    value={formState.assignedDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input 
                    id="returnDate" 
                    type="date"
                    value={formState.returnDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input 
                    id="purchaseDate" 
                    type="date"
                    value={formState.purchaseDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input 
                    id="invoiceNumber" 
                    placeholder="Enter invoice number" 
                    value={formState.invoiceNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachedInvoice">Attached Invoice</Label>
                  <Input 
                    id="attachedInvoice" 
                    type="file"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachedPO">Attached PO</Label>
                  <Input 
                    id="attachedPO" 
                    type="file"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="poNumber">PO Number</Label>
                  <Input 
                    id="poNumber" 
                    placeholder="Enter PO number" 
                    value={formState.poNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input 
                    id="price" 
                    placeholder="Enter price" 
                    value={formState.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warranty">Warranty</Label>
                  <Input 
                    id="warranty" 
                    placeholder="Enter warranty details" 
                    value={formState.warranty}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transactionDetails">Transaction Details / Notes</Label>
                <Textarea 
                  id="transactionDetails" 
                  placeholder="Enter any additional details"
                  value={formState.transactionDetails}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="reset">Reset Form</Button>
              <Button type="submit">Assign Printer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
