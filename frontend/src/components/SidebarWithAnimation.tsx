
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Laptop, 
  Cable, 
  Printer, 
  Mouse, 
  Users, 
  HelpCircle 
} from 'lucide-react';

const SidebarWithAnimation = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (path: string, type: string) => {
    // Navigate with state to trigger animation
    navigate(path, { state: { showAnimation: true, animationType: type } });
  };
  
  return (
    <div className="flex flex-col space-y-1">
      <button 
        onClick={() => handleNavigate('/laptop-assignment', 'laptop')}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary"
      >
        <Laptop className="h-5 w-5" />
        <span>Laptop Assignment</span>
      </button>
      
      <button 
        onClick={() => handleNavigate('/adapter-assignment', 'adapter')}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary"
      >
        <Cable className="h-5 w-5" />
        <span>Adapter Assignment</span>
      </button>
      
      <button 
        onClick={() => handleNavigate('/printer-assignment', 'printer')}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary"
      >
        <Printer className="h-5 w-5" />
        <span>Printer Assignment</span>
      </button>
      
      <button 
        onClick={() => handleNavigate('/misc-assignment', 'misc')}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary"
      >
        <Mouse className="h-5 w-5" />
        <span>Misc Assignment</span>
      </button>
      
      <Link to="/previous-users" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary">
        <Users className="h-5 w-5" />
        <span>Previous Users</span>
      </Link>
      
      <Link to="/how-to-use" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary">
        <HelpCircle className="h-5 w-5" />
        <span>How To Use</span>
      </Link>
    </div>
  );
};

export default SidebarWithAnimation;
