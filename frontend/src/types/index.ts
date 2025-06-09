
export interface Product {
  id: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: string;
  status: "assigned" | "available" | "maintenance" | "retired" | "new" | "active" | "repair";
  price?: string;
  invoiceNumber?: string;
  poNumber?: string;
  warranty?: string;
  previousUser?: string;
  vendorContact?: string;
  vendorEmail?: string;
  location?: string;
  assignedDate?: string;
  returnDate?: string;
  attachedInvoice?: string;
  attachedPO?: string;
  transactionDetails?: string;
}

export interface Laptop extends Product {
  processorType: string;
  ram: string;
  storageCapacity: string;
  operatingSystem: string;
  adapterSerialNumber?: string;
  purchasedWindowsKey?: string;
  macAddress?: string;
  ipAddress?: string;
  hostName?: string;
  officeKey?: string;
  controlAccounts?: string;
  adminPassword?: string;
  conditionStatus?: string;
}

export interface Adapter extends Product {
  wattage: string;
  compatibleDevices: string;
  cableLength: string;
  verifiedStatus?: string;
  partCode?: string;
}

export interface Printer extends Product {
  type: string;
  connectivity: string;
  paperSize: string;
  macAddress?: string;
  ipAddress?: string;
  hostName?: string;
  partCode?: string;
  verifiedStatus?: string;
  conditionStatus?: string;
}

export interface MiscItem extends Product {
  category: string;
  description: string;
  partCode?: string;
  adapterSerialNumber?: string;
  verifiedStatus?: string;
  conditionStatus?: string;
}

export interface Assignment {
  id: string;
  productId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  assignedDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  notes?: string;
  isActive?: boolean;
  employeeEmail?: string;
  employeeDesignation?: string;
  operatorName?: string;
  verifiedStatus?: string;
  location?: string;
  transactionDetails?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  employeeId?: string;
  employeeType?: string;
}

export interface SidebarItem {
  title: string;
  path: string;
  icon?: React.ElementType;
  children?: SidebarItem[];
  collapsed?: boolean;
}
