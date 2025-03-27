import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import TicketList from "@/components/TicketList";
import TicketDetail from "@/components/TicketDetail";
import type { Ticket } from "@shared/schema";

export default function Tickets() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Fetch tickets to find a default selected ticket
  const { data: tickets, isLoading } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets'],
    // Using onSuccess in useEffect instead of in query options
  });
  
  // Handle default ticket selection
  useEffect(() => {
    if (tickets && tickets.length > 0 && !selectedTicket) {
      setSelectedTicket(tickets[0]);
    }
  }, [tickets, selectedTicket]);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  // For mobile: determine what to show
  const [showDetail, setShowDetail] = useState(false);

  return (
    <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full">
      {/* On mobile: Show either the list or the detail */}
      <div className={`md:block ${showDetail ? 'hidden' : 'block'} md:w-1/3 lg:w-1/4`}>
        <TicketList 
          selectedTicketId={selectedTicket?.id} 
          onSelectTicket={(ticket) => {
            handleSelectTicket(ticket);
            setShowDetail(true); // On mobile, switch to detail view
          }} 
        />
      </div>

      {/* Ticket detail */}
      <div className={`md:block ${!showDetail ? 'hidden' : 'block'} md:w-2/3 lg:w-3/4`}>
        {selectedTicket ? (
          <TicketDetail ticket={selectedTicket} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <div className="text-center p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <h3 className="text-lg font-medium text-slate-900">No Ticket Selected</h3>
              <p className="mt-2 text-sm text-slate-500">
                Select a ticket from the list to view its details.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
