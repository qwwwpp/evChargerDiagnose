import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Ticket } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface TicketListProps {
  selectedTicketId?: number;
  onSelectTicket: (ticket: Ticket) => void;
}

export default function TicketList({ selectedTicketId, onSelectTicket }: TicketListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Construct URL with query parameters
  let queryUrl = "/api/tickets";
  const queryParams = [];
  
  if (statusFilter && statusFilter !== "all") {
    queryParams.push(`status=${statusFilter}`);
  }
  
  if (sortBy) {
    queryParams.push(`sortBy=${sortBy}`);
    queryParams.push(`sortOrder=desc`);
  }
  
  if (searchQuery) {
    queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
  }
  
  if (queryParams.length > 0) {
    queryUrl += `?${queryParams.join("&")}`;
  }

  const { data: tickets, isLoading, error } = useQuery<Ticket[]>({
    queryKey: [`/api/tickets`, statusFilter, sortBy, searchQuery],
    refetchOnWindowFocus: false,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
      case "in progress":
        return "bg-amber-100 text-amber-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "high":
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="w-full md:w-1/3 bg-white md:border-r border-slate-200 min-h-0 overflow-auto flex flex-col">
      {/* Desktop Filter Panel */}
      <div className="hidden md:block border-b border-slate-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-slate-800">Tickets</h1>
          <Link href="/new-ticket">
            <Button className="bg-teal-700 hover:bg-teal-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Ticket
            </Button>
          </Link>
        </div>
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <Input
            type="text"
            placeholder="Search tickets..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={statusFilter === "all" ? "default" : "outline"}
              className={statusFilter === "all" ? "bg-teal-100 text-teal-800 hover:bg-teal-200 hover:text-teal-900" : ""}
              size="sm"
              onClick={() => handleStatusFilterChange("all")}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === "open" ? "default" : "outline"}
              className={statusFilter === "open" ? "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900" : ""}
              size="sm"
              onClick={() => handleStatusFilterChange("open")}
            >
              Open
            </Button>
            <Button 
              variant={statusFilter === "in-progress" ? "default" : "outline"}
              className={statusFilter === "in-progress" ? "bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900" : ""}
              size="sm"
              onClick={() => handleStatusFilterChange("in-progress")}
            >
              In Progress
            </Button>
            <Button 
              variant={statusFilter === "resolved" ? "default" : "outline"}
              className={statusFilter === "resolved" ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900" : ""}
              size="sm"
              onClick={() => handleStatusFilterChange("resolved")}
            >
              Resolved
            </Button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sort By</label>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Newest first</SelectItem>
              <SelectItem value="createdAt">Oldest first</SelectItem>
              <SelectItem value="priority">Priority (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Mobile filter bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-800">Tickets</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="21" y1="4" x2="14" y2="4" />
                <line x1="10" y1="4" x2="3" y2="4" />
                <line x1="21" y1="12" x2="12" y2="12" />
                <line x1="8" y1="12" x2="3" y2="12" />
                <line x1="21" y1="20" x2="16" y2="20" />
                <line x1="12" y1="20" x2="3" y2="20" />
                <line x1="14" y1="2" x2="14" y2="6" />
                <line x1="8" y1="10" x2="8" y2="14" />
                <line x1="16" y1="18" x2="16" y2="22" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Ticket List */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-slate-500">Loading tickets...</div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-red-500">Failed to load tickets</div>
        </div>
      ) : tickets && tickets.length > 0 ? (
        <div className="flex-1 overflow-auto">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id}
              className={`border-b border-slate-200 p-4 hover:bg-slate-50 cursor-pointer ${selectedTicketId === ticket.id ? 'bg-slate-50' : ''}`}
              onClick={() => onSelectTicket(ticket)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-slate-900 truncate">
                  #{ticket.id} - {ticket.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClasses(ticket.priority === 'high' ? 'high' : ticket.status)}`}>
                  {ticket.priority === 'high' ? 'High Priority' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace(/-/g, ' ')}
                </span>
              </div>
              <div className="mb-2 text-xs text-slate-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
                <span>{ticket.location}, {ticket.locationDetails}</span>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">{ticket.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center text-xs text-slate-500">
                  <span className="flex items-center bg-slate-100 px-2 py-0.5 rounded-full">
                    {ticket.chargerType.includes("DC") ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 18h14" />
                        <path d="M5 14h14" />
                        <path d="M5 10h14" />
                        <path d="M5 6h14" />
                      </svg>
                    )}
                    <span>{ticket.chargerType}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-slate-500">No tickets found</div>
        </div>
      )}
    </div>
  );
}
