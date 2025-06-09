import React, { useState } from 'react';
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

interface AssignmentFormProps {
  type: 'laptop' | 'adapter' | 'printer' | 'misc';
  title: string;
  description: string;
}

export default function AssignmentForm({ type, title, description }: AssignmentFormProps) {
  const { toast } = useToast();
  
  const [formState, setFormState] = useState({
    // Base Product fields (from Product.js)
    serialNumber: '',
    model: '',
    manufacturer: '',
    purchaseDate: '',
    status: 'available',
    price: '',
    invoiceNumber: '',
    poNumber: '',
    warranty: '',
    previousUser: '',
    vendorContact: '',
    vendorEmail: '',
    location: '',
    assignedDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    attachedInvoice: '',
    attachedPO: '',
    transactionDetails: '',
    
    // Laptop specific fields (from Laptop.js)
    processorType: '',
    ram: '',
    storageCapacity: '',
    operatingSystem: '',
    adapterSerialNumber: '',
    purchasedWindowsKey: '',
    macAddress: '',
    ipAddress: '',
    hostName: '',
    officeKey: '',
    controlAccounts: '',
    adminPassword: '',
    conditionStatus: '',
    
    // Adapter specific fields (from Adapter.js)
    wattage: '',
    compatibleDevices: '',
    cableLength: '',
    adapterVerifiedStatus: '',
    adapterPartCode: '',
    
    // Printer specific fields (from Printer.js)
    printerType: 'laser',
    connectivity: 'usb',
    paperSize: 'a4',
    printerMacAddress: '',
    printerIpAddress: '',
    printerHostName: '',
    printerPartCode: '',
    printerVerifiedStatus: '',
    printerConditionStatus: '',
    
    // Misc specific fields (from MiscItem.js)
    category: '',
    description: '',
    miscPartCode: '',
    miscAdapterSerialNumber: '',
    miscVerifiedStatus: '',
    miscConditionStatus: '',
    
    // Employee assignment fields (from Assignment.js)
    employeeId: '',
    employeeName: '',
    employeeEmail: '',
    department: 'it',
    employeeDesignation: '',
    operatorName: '',
    expectedReturnDate: '',
    notes: '',
    assignmentVerifiedStatus: '',
    assignmentLocation: '',
    assignmentTransactionDetails: ''
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
            employeeEmail: employee.email || '', // Make sure we get the email
            department: employee.department
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
      // Validate required fields based on product type
      if (type === 'laptop') {
        if (!formState.serialNumber || !formState.model || !formState.manufacturer || !formState.purchaseDate ||
            !formState.processorType || !formState.ram || !formState.storageCapacity || !formState.operatingSystem) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields marked with *",
            variant: "destructive",
          });
          return;
        }
      } else if (type === 'adapter') {
        if (!formState.serialNumber || !formState.model || !formState.manufacturer || !formState.purchaseDate ||
            !formState.wattage || !formState.compatibleDevices || !formState.cableLength) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields marked with *",
            variant: "destructive",
          });
          return;
        }
      } else if (type === 'printer') {
        if (!formState.serialNumber || !formState.model || !formState.manufacturer || !formState.purchaseDate ||
            !formState.printerType || !formState.connectivity || !formState.paperSize) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields marked with *",
            variant: "destructive",
          });
          return;
        }
      } else if (type === 'misc') {
        if (!formState.serialNumber || !formState.model || !formState.manufacturer || !formState.purchaseDate ||
            !formState.category || !formState.description) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields marked with *",
            variant: "destructive",
          });
          return;
        }
      }
      
      let productId;
      
      // 1. Create the product based on type
      if (type === 'laptop') {
        const laptopData = {
          // Base Product fields
          serialNumber: formState.serialNumber,
          model: formState.model,
          manufacturer: formState.manufacturer,
          purchaseDate: formState.purchaseDate,
          status: formState.status,
          price: formState.price || undefined,
          invoiceNumber: formState.invoiceNumber || undefined,
          poNumber: formState.poNumber || undefined,
          warranty: formState.warranty || undefined,
          previousUser: formState.previousUser || undefined,
          vendorContact: formState.vendorContact || undefined,
          vendorEmail: formState.vendorEmail || undefined,
          location: formState.location || undefined,
          assignedDate: formState.assignedDate || undefined,
          returnDate: formState.returnDate || undefined,
          attachedInvoice: formState.attachedInvoice || undefined,
          attachedPO: formState.attachedPO || undefined,
          transactionDetails: formState.transactionDetails || undefined,
          
          // Laptop specific fields
          processorType: formState.processorType,
          ram: formState.ram,
          storageCapacity: formState.storageCapacity,
          operatingSystem: formState.operatingSystem,
          adapterSerialNumber: formState.adapterSerialNumber || undefined,
          purchasedWindowsKey: formState.purchasedWindowsKey || undefined,
          macAddress: formState.macAddress || undefined,
          ipAddress: formState.ipAddress || undefined,
          hostName: formState.hostName || undefined,
          officeKey: formState.officeKey || undefined,
          controlAccounts: formState.controlAccounts || undefined,
          adminPassword: formState.adminPassword || undefined,
          conditionStatus: formState.conditionStatus || undefined
        };

        try {
          const response = await inventoryApi.createLaptop(laptopData);
          productId = response.data._id;
        } catch (error) {
          console.error('Error creating laptop:', error);
          toast({
            title: "Error",
            description: "Failed to create laptop. Please check all required fields.",
            variant: "destructive",
          });
          return;
        }
      } else if (type === 'adapter') {
        const adapterData = {
          // Base Product fields
          serialNumber: formState.serialNumber,
          model: formState.model,
          manufacturer: formState.manufacturer,
          purchaseDate: formState.purchaseDate,
          status: "available",
          price: formState.price || undefined,
          invoiceNumber: formState.invoiceNumber || undefined,
          poNumber: formState.poNumber || undefined,
          warranty: formState.warranty || undefined,
          previousUser: formState.previousUser || undefined,
          vendorContact: formState.vendorContact || undefined,
          vendorEmail: formState.vendorEmail || undefined,
          location: formState.location || undefined,
          assignedDate: formState.assignedDate || undefined,
          returnDate: formState.returnDate || undefined,
          attachedInvoice: formState.attachedInvoice || undefined,
          attachedPO: formState.attachedPO || undefined,
          transactionDetails: formState.transactionDetails || undefined,
          
          // Adapter specific fields
          wattage: formState.wattage,
          compatibleDevices: formState.compatibleDevices,
          cableLength: formState.cableLength,
          verifiedStatus: formState.adapterVerifiedStatus || undefined,
          partCode: formState.adapterPartCode || undefined
        };
        const response = await inventoryApi.createAdapter(adapterData);
        productId = response.data._id;
      } else if (type === 'printer') {
        const printerData = {
          // Base Product fields
          serialNumber: formState.serialNumber,
          model: formState.model,
          manufacturer: formState.manufacturer,
          purchaseDate: formState.purchaseDate,
          status: "available",
          price: formState.price || undefined,
          invoiceNumber: formState.invoiceNumber || undefined,
          poNumber: formState.poNumber || undefined,
          warranty: formState.warranty || undefined,
          previousUser: formState.previousUser || undefined,
          vendorContact: formState.vendorContact || undefined,
          vendorEmail: formState.vendorEmail || undefined,
          location: formState.location || undefined,
          assignedDate: formState.assignedDate || undefined,
          returnDate: formState.returnDate || undefined,
          attachedInvoice: formState.attachedInvoice || undefined,
          attachedPO: formState.attachedPO || undefined,
          transactionDetails: formState.transactionDetails || undefined,
          
          // Printer specific fields
          type: formState.printerType,
          connectivity: formState.connectivity,
          paperSize: formState.paperSize,
          macAddress: formState.printerMacAddress || undefined,
          ipAddress: formState.printerIpAddress || undefined,
          hostName: formState.printerHostName || undefined,
          partCode: formState.printerPartCode || undefined,
          verifiedStatus: formState.printerVerifiedStatus || undefined,
          conditionStatus: formState.printerConditionStatus || undefined
        };
        const response = await inventoryApi.createPrinter(printerData);
        productId = response.data._id;
      } else if (type === 'misc') {
        const miscData = {
          // Base Product fields
          serialNumber: formState.serialNumber,
          model: formState.model,
          manufacturer: formState.manufacturer,
          purchaseDate: formState.purchaseDate,
          status: "available",
          price: formState.price || undefined,
          invoiceNumber: formState.invoiceNumber || undefined,
          poNumber: formState.poNumber || undefined,
          warranty: formState.warranty || undefined,
          previousUser: formState.previousUser || undefined,
          vendorContact: formState.vendorContact || undefined,
          vendorEmail: formState.vendorEmail || undefined,
          location: formState.location || undefined,
          assignedDate: formState.assignedDate || undefined,
          returnDate: formState.returnDate || undefined,
          attachedInvoice: formState.attachedInvoice || undefined,
          attachedPO: formState.attachedPO || undefined,
          transactionDetails: formState.transactionDetails || undefined,
          
          // Misc specific fields
          category: formState.category,
          description: formState.description,
          partCode: formState.miscPartCode || undefined,
          adapterSerialNumber: formState.miscAdapterSerialNumber || undefined,
          verifiedStatus: formState.miscVerifiedStatus || undefined,
          conditionStatus: formState.miscConditionStatus || undefined
        };
        const response = await inventoryApi.createMiscItem(miscData);
        productId = response.data._id;
      }
      
      // 2. Check if employee exists, create if not
      let employeeId;
      try {
        const employeeResponse = await employeeApi.getByEmployeeId(formState.employeeId);
        employeeId = employeeResponse.data._id;
        
        // Update email if it has changed
        if (employeeResponse.data.email !== formState.employeeEmail) {
          await employeeApi.update(employeeId, { email: formState.employeeEmail });
        }
      } catch {
        // Employee doesn't exist, create one
        const newEmployeeResponse = await employeeApi.create({
          name: formState.employeeName,
          email: formState.employeeEmail,
          department: formState.department,
          position: 'Staff',  // Default position
          employeeId: formState.employeeId,
          employeeType: 'Full-time'  // Default type
        });
        employeeId = newEmployeeResponse.data._id;
      }
      
      // 3. Create the assignment
      await assignmentApi.create({
        productId,
        employeeId,
        employeeName: formState.employeeName,
        employeeEmail: formState.employeeEmail,
        department: formState.department,
        assignedDate: formState.assignedDate,
        expectedReturnDate: formState.expectedReturnDate || undefined,
        notes: formState.notes || undefined,
        employeeDesignation: formState.employeeDesignation || undefined,
        operatorName: formState.operatorName || undefined,
        verifiedStatus: formState.assignmentVerifiedStatus || undefined,
        location: formState.assignmentLocation || undefined,
        transactionDetails: formState.assignmentTransactionDetails || undefined
      });
      
      toast({
        title: "Success!",
        description: `${title} assigned successfully and notification email sent to ${formState.employeeEmail}.`,
      });
      
      // Reset form with all fields
      setFormState({
        // Base Product fields
        serialNumber: '',
        model: '',
        manufacturer: '',
        purchaseDate: '',
        status: 'available',
        price: '',
        invoiceNumber: '',
        poNumber: '',
        warranty: '',
        previousUser: '',
        vendorContact: '',
        vendorEmail: '',
        location: '',
        assignedDate: new Date().toISOString().split('T')[0],
        returnDate: '',
        attachedInvoice: '',
        attachedPO: '',
        transactionDetails: '',
        
        // Laptop specific fields
        processorType: '',
        ram: '',
        storageCapacity: '',
        operatingSystem: '',
        adapterSerialNumber: '',
        purchasedWindowsKey: '',
        macAddress: '',
        ipAddress: '',
        hostName: '',
        officeKey: '',
        controlAccounts: '',
        adminPassword: '',
        conditionStatus: '',
        
        // Adapter specific fields
        wattage: '',
        compatibleDevices: '',
        cableLength: '',
        adapterVerifiedStatus: '',
        adapterPartCode: '',
        
        // Printer specific fields
        printerType: 'laser',
        connectivity: 'usb',
        paperSize: 'a4',
        printerMacAddress: '',
        printerIpAddress: '',
        printerHostName: '',
        printerPartCode: '',
        printerVerifiedStatus: '',
        printerConditionStatus: '',
        
        // Misc specific fields
        category: '',
        description: '',
        miscPartCode: '',
        miscAdapterSerialNumber: '',
        miscVerifiedStatus: '',
        miscConditionStatus: '',
        
        // Employee assignment fields
        employeeId: '',
        employeeName: '',
        employeeEmail: '',
        department: 'it',
        employeeDesignation: '',
        operatorName: '',
        expectedReturnDate: '',
        notes: '',
        assignmentVerifiedStatus: '',
        assignmentLocation: '',
        assignmentTransactionDetails: ''
      });
      
    } catch (error) {
      console.error('Assignment failed:', error);
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const renderSpecificFields = () => {
    switch (type) {
      case 'laptop':
        return (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="processorType">Processor Type *</Label>
                <Input 
                  id="processorType" 
                  placeholder="e.g. Intel i7" 
                  value={formState.processorType}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ram">RAM *</Label>
                <Input 
                  id="ram" 
                  placeholder="e.g. 16GB" 
                  value={formState.ram}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="storageCapacity">Storage Capacity *</Label>
                <Input 
                  id="storageCapacity" 
                  placeholder="e.g. 512GB SSD" 
                  value={formState.storageCapacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operatingSystem">Operating System *</Label>
                <Select 
                  value={formState.operatingSystem} 
                  onValueChange={(value) => handleSelectChange('operatingSystem', value)}
                >
                  <SelectTrigger id="operatingSystem">
                    <SelectValue placeholder="Select OS" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="windows11">Windows 11</SelectItem>
                    <SelectItem value="windows10">Windows 10</SelectItem>
                    <SelectItem value="macos">macOS</SelectItem>
                    <SelectItem value="linux">Linux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
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
                <Label htmlFor="purchasedWindowsKey">Windows Key</Label>
                <Input 
                  id="purchasedWindowsKey" 
                  placeholder="Enter Windows key" 
                  value={formState.purchasedWindowsKey}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
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
            <div className="grid md:grid-cols-2 gap-4 mb-4">
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
                <Label htmlFor="officeKey">Office Key</Label>
                <Input 
                  id="officeKey" 
                  placeholder="Enter Office key" 
                  value={formState.officeKey}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="controlAccounts">Control Accounts</Label>
                <Input 
                  id="controlAccounts" 
                  placeholder="Enter control accounts" 
                  value={formState.controlAccounts}
                  onChange={handleInputChange}
                />
              </div>
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
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'adapter':
        return (
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="wattage">Wattage</Label>
              <Input 
                id="wattage" 
                placeholder="e.g. 65W" 
                value={formState.wattage}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compatibleDevices">Compatible Devices</Label>
              <Input 
                id="compatibleDevices" 
                placeholder="e.g. ThinkPad X1" 
                value={formState.compatibleDevices}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cableLength">Cable Length</Label>
              <Input 
                id="cableLength" 
                placeholder="e.g. 1.8m" 
                value={formState.cableLength}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      case 'printer':
        return (
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="printerType">Printer Type</Label>
              <Select 
                value={formState.printerType} 
                onValueChange={(value) => handleSelectChange('printerType', value)}
              >
                <SelectTrigger id="printerType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laser">Laser</SelectItem>
                  <SelectItem value="inkjet">Inkjet</SelectItem>
                  <SelectItem value="thermal">Thermal</SelectItem>
                  <SelectItem value="dot-matrix">Dot Matrix</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="connectivity">Connectivity</Label>
              <Select 
                value={formState.connectivity} 
                onValueChange={(value) => handleSelectChange('connectivity', value)}
              >
                <SelectTrigger id="connectivity">
                  <SelectValue placeholder="Select connection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usb">USB</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="wireless">Wireless</SelectItem>
                  <SelectItem value="bluetooth">Bluetooth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paperSize">Paper Size</Label>
              <Select 
                value={formState.paperSize} 
                onValueChange={(value) => handleSelectChange('paperSize', value)}
              >
                <SelectTrigger id="paperSize">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="a3">A3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'misc':
        return (
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                placeholder="e.g. Mouse, Keyboard, etc." 
                value={formState.category}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Item Description</Label>
              <Input 
                id="description" 
                placeholder="Describe the item" 
                value={formState.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Base Product fields */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number *</Label>
              <Input 
                id="serialNumber" 
                placeholder="Enter serial number" 
                value={formState.serialNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input 
                id="model" 
                placeholder="Enter model" 
                value={formState.model}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input 
                id="manufacturer" 
                placeholder="Enter manufacturer" 
                value={formState.manufacturer}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <Input 
                id="purchaseDate" 
                type="date" 
                value={formState.purchaseDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
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

          <div className="grid md:grid-cols-2 gap-4 mb-6">
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
              <Label htmlFor="poNumber">PO Number</Label>
              <Input 
                id="poNumber" 
                placeholder="Enter PO number" 
                value={formState.poNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="vendorContact">Vendor Contact</Label>
              <Input 
                id="vendorContact" 
                placeholder="Enter vendor contact" 
                value={formState.vendorContact}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendorEmail">Vendor Email</Label>
              <Input 
                id="vendorEmail" 
                type="email"
                placeholder="Enter vendor email" 
                value={formState.vendorEmail}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
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
                placeholder="Enter previous user" 
                value={formState.previousUser}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Specific fields based on product type */}
          {renderSpecificFields()}
          
          {/* Employee assignment section */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Assign to Employee</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input 
                  id="employeeId" 
                  placeholder="Enter employee ID" 
                  value={formState.employeeId}
                  onChange={handleInputChange}
                  onBlur={handleEmployeeIdBlur}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Name *</Label>
                <Input 
                  id="employeeName" 
                  placeholder="Enter employee name" 
                  value={formState.employeeName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="employeeEmail">Employee Email *</Label>
                <Input 
                  id="employeeEmail" 
                  type="email"
                  placeholder="Enter employee email" 
                  value={formState.employeeEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={formState.department} 
                  onValueChange={(value) => handleSelectChange('department', value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
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
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="assignedDate">Assigned Date *</Label>
                <Input 
                  id="assignedDate" 
                  type="date" 
                  value={formState.assignedDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedReturnDate">Expected Return Date</Label>
                <Input 
                  id="expectedReturnDate" 
                  type="date"
                  value={formState.expectedReturnDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Additional notes"
                value={formState.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="reset">Cancel</Button>
            <Button type="submit">Assign {type.charAt(0).toUpperCase() + type.slice(1)}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
