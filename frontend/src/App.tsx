
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import LaptopAssignment from "./pages/LaptopAssignment";
import AdapterAssignment from "./pages/AdapterAssignment";
import PrinterAssignment from "./pages/PrinterAssignment";
import MiscAssignment from "./pages/MiscAssignment";
import PreviousUsers from "./pages/PreviousUsers";
import HowToUse from "./pages/HowToUse";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import withPageAnimation from "./components/animations/withPageAnimation";
import { QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Wrap the assignment pages with the animation HOC
const AnimatedLaptopAssignment = withPageAnimation(LaptopAssignment, 'laptop');
const AnimatedAdapterAssignment = withPageAnimation(AdapterAssignment, 'adapter');
const AnimatedPrinterAssignment = withPageAnimation(PrinterAssignment, 'printer');
const AnimatedMiscAssignment = withPageAnimation(MiscAssignment, 'misc');

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            <Route path="/laptop-assignment" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedLaptopAssignment />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/adapter-assignment" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedAdapterAssignment />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/printer-assignment" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedPrinterAssignment />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/misc-assignment" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedMiscAssignment />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/previous-users" element={
              <ProtectedRoute>
                <Layout>
                  <PreviousUsers />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/how-to-use" element={
              <ProtectedRoute>
                <Layout>
                  <HowToUse />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
