
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Filter, User, Calendar, Laptop, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBoxProps {
  onSearch: (term: string, filter: string, filterBy: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterBy, setFilterBy] = useState('any');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, activeFilter, filterBy);
  };

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'laptop', label: 'Laptops' },
    { value: 'adapter', label: 'Adapters' },
    { value: 'printer', label: 'Printers' },
    { value: 'misc', label: 'Misc' },
  ];

  const filterOptions = [
    { value: 'any', label: 'Any Field', icon: Search },
    { value: 'employee_id', label: 'Employee ID', icon: User },
    { value: 'laptop_serial', label: 'Laptop Serial', icon: Laptop },
    { value: 'adapter_serial', label: 'Adapter Serial', icon: HardDrive },
    { value: 'date', label: 'Assignment Date', icon: Calendar },
    { value: 'employee_type', label: 'Employee Type', icon: User },
  ];

  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    // Optionally clear or adjust search term based on filter type
    if (value === 'date') {
      setSearchTerm(''); // Clear search when switching to date filter
    }
  };

  return (
    <div className="w-full mb-6 card-3d">
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search for assignments..."
                className="pl-10 pr-4 py-2 border-2 border-oak-lightgray focus:border-oak-gold transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterBy} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px] bg-white border-2 border-oak-lightgray hover:border-oak-gold transition-all icon-3d">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-oak-gold" />
                  <SelectValue placeholder="Filter by..." />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectLabel>Filter Search By</SelectLabel>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon size={16} className="text-oak-gold" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={cn(
                  "px-4 py-2 rounded-full text-sm transition-all",
                  "hover:shadow-md icon-3d",
                  activeFilter === filter.value
                    ? "bg-oak-gold text-white font-medium"
                    : "bg-gray-100 text-gray-700"
                )}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className={cn(
              "bg-oak-gold text-white px-4 py-2 rounded-md",
              "shadow-md hover:shadow-lg transition-all",
              "animate-pulse-gentle"
            )}
          >
            Search Inventory
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBox;
