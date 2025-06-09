
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowToUse() {
  const instructions = [
    {
      title: "Assigning Equipment",
      steps: [
        "Navigate to the Products section in the sidebar",
        "Select the type of equipment you want to assign (Laptop, Adapter, Printer, Miscellaneous)",
        "Fill in all required fields in the assignment form",
        "Click the 'Assign' button to complete the assignment",
        "The system will confirm successful assignment with a notification"
      ]
    },
    {
      title: "Viewing Assignment History",
      steps: [
        "Click on 'Previous Users' in the sidebar",
        "Use the search filters to find specific assignments if needed",
        "View detailed history of all equipment assignments and returns",
        "Check condition reports from previous users"
      ]
    },
    {
      title: "Managing Equipment Returns",
      steps: [
        "When an employee returns equipment, go to the Previous Users section",
        "Locate the assignment in the table",
        "Click the 'Process Return' button (to be implemented)",
        "Complete the return form with condition information",
        "Submit the form to update inventory status"
      ]
    },
    {
      title: "Best Practices",
      steps: [
        "Regularly check the dashboard for inventory status",
        "Ensure all required fields are filled when making new assignments",
        "Add detailed notes for special circumstances",
        "Update employee information when changes occur",
        "Perform regular inventory audits to ensure system accuracy"
      ]
    }
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">How To Use</h1>
        <p className="text-gray-600 mt-1">Learn how to use the IT Inventory Management System</p>
      </div>
      
      <div className="space-y-6">
        {instructions.map((section, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>Follow these steps</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2">
                {section.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="text-gray-700">{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-sm mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Additional resources</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            If you need additional assistance using the IT Inventory Management System, please contact the IT support team.
          </p>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <p className="text-blue-800 font-medium">IT Support Contact:</p>
            <p className="text-blue-700 mt-1">Email: itsupport@company.com</p>
            <p className="text-blue-700">Phone: (555) 123-4567</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
