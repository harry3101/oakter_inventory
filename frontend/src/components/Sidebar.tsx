
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  Computer, 
  Laptop, 
  Printer, 
  HardDrive, 
  Plus, 
  FolderOpen,
  ArrowLeft,
  ArrowRight,
  Check,
  Search
} from 'lucide-react';
import { SidebarItem } from '@/types';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "products": true
  });
  const location = useLocation();
  
  const sidebarItems: SidebarItem[] = [
    {
      title: "Home",
      path: "/",
      icon: Computer,
    },
    {
      title: "Products",
      path: "#",
      icon: FolderOpen,
      children: [
        {
          title: "Laptop Assignment",
          path: "/laptop-assignment",
          icon: Laptop,
        },
        {
          title: "Adapter Assignment",
          path: "/adapter-assignment",
          icon: HardDrive,
        },
        {
          title: "Printer Assignment",
          path: "/printer-assignment",
          icon: Printer,
        },
        {
          title: "Misc Assignment",
          path: "/misc-assignment",
          icon: Plus,
        },
      ],
    },
    {
      title: "Previous Users",
      path: "/previous-users",
      icon: Check,
    },
    {
      title: "How To Use",
      path: "/how-to-use",
      icon: Search,
    },
  ];

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    document.body.classList.toggle('sidebar-collapsed');
  };

  const toggleExpand = (itemTitle: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  return (
    <div className={cn(
      "inventory-sidebar bg-sidebar h-screen border-r border-gray-200 flex flex-col",
      collapsed ? "collapsed" : ""
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={cn(
          "flex items-center transition-all",
          collapsed ? "justify-center" : ""
        )}>
          <img 
            src="/lovable-uploads/e53601a9-4a77-4d18-a9b0-bc4ba5986c03.png" 
            alt="OAK IT Inventory" 
            className={cn(
              "h-8 transition-all icon-3d",
              collapsed ? "mx-auto" : "mr-3"
            )} 
          />
          {!collapsed && (
            <h1 className="font-bold text-xl text-oak-gold">
              IT Inventory
            </h1>
          )}
        </div>
        
        <button 
          onClick={toggleCollapse} 
          className="p-2 rounded-md hover:bg-gray-100 text-oak-gray icon-3d"
        >
          {collapsed ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.title.toLowerCase())}
                    className={cn(
                      "flex items-center w-full p-3 rounded-md text-left",
                      "hover:bg-gray-100 transition-colors icon-3d",
                      collapsed ? "justify-center" : "justify-between",
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon && <item.icon size={20} className="text-oak-gold" />}
                      {!collapsed && <span>{item.title}</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-xs">
                        {expandedItems[item.title.toLowerCase()] ? "▼" : "▶"}
                      </span>
                    )}
                  </button>
                  
                  {(expandedItems[item.title.toLowerCase()] || collapsed) && (
                    <ul className={cn(
                      "ml-4 space-y-1 mt-1",
                      collapsed ? "ml-0" : ""
                    )}>
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <Link
                            to={child.path}
                            className={cn(
                              "flex items-center p-3 rounded-md",
                              "hover:bg-gray-100 transition-colors icon-3d",
                              location.pathname === child.path ? "bg-gray-100 text-oak-gold" : "text-oak-gray",
                              collapsed ? "justify-center" : ""
                            )}
                            title={collapsed ? child.title : undefined}
                          >
                            {child.icon && <child.icon size={20} className={collapsed ? "mx-auto" : ""} />}
                            {!collapsed && <span className="ml-3">{child.title}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center p-3 rounded-md",
                    "hover:bg-gray-100 transition-colors icon-3d",
                    location.pathname === item.path ? "bg-gray-100 text-oak-gold" : "text-oak-gray",
                    collapsed ? "justify-center" : ""
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  {item.icon && <item.icon size={20} className={collapsed ? "mx-auto" : ""} />}
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className={cn(
          "text-xs text-oak-gray",
          collapsed ? "hidden" : "block"
        )}>
          OAK IT Inventory System v1.0
        </div>
      </div>
    </div>
  );
}
