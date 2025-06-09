
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LaptopAnimation from './LaptopAnimation';

// Define the props that will be passed to the WrappedComponent
interface WithPageAnimationProps {
  [key: string]: any;
}

const withPageAnimation = (WrappedComponent: React.ComponentType<WithPageAnimationProps>, animationType: string) => {
  // Create and return a new component
  return function WithAnimation(props: WithPageAnimationProps) {
    const [showAnimation, setShowAnimation] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
      // Show animation only if we're coming from another page with showAnimation state
      if (location.state?.showAnimation) {
        setShowAnimation(true);
        
        // Reset the location state to avoid showing animation on refresh
        window.history.replaceState({}, document.title);
      }
    }, [location]);
    
    if (showAnimation) {
      let redirectPath = '';
      switch (animationType) {
        case 'laptop':
          redirectPath = '/laptop-assignment';
          break;
        case 'adapter':
          redirectPath = '/adapter-assignment';
          break;
        case 'printer':
          redirectPath = '/printer-assignment';
          break;
        case 'misc':
          redirectPath = '/misc-assignment';
          break;
        default:
          redirectPath = '/';
      }
      
      return <LaptopAnimation redirectPath={redirectPath} />;
    }
    
    return <WrappedComponent {...props} />;
  };
};

export default withPageAnimation;
