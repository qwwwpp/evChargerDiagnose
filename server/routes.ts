import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertTicketSchema, 
  insertEventSchema, 
  insertMaintenanceHistorySchema,
  type Ticket 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Ticket routes
  app.get("/api/tickets", async (req: Request, res: Response) => {
    try {
      const tickets = await storage.getTickets();
      
      // Handle query parameter for status filtering
      const status = req.query.status as string | undefined;
      if (status) {
        const filteredTickets = tickets.filter(ticket => ticket.status === status);
        return res.json(filteredTickets);
      }
      
      // Handle search query
      const search = req.query.search as string | undefined;
      if (search && search.trim() !== '') {
        const searchResults = await storage.searchTickets(search);
        return res.json(searchResults);
      }
      
      // Handle sorting
      const sortBy = req.query.sortBy as string | undefined;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' | undefined;
      
      if (sortBy) {
        let sortedTickets = [...tickets];
        sortedTickets.sort((a, b) => {
          const aValue = a[sortBy as keyof Ticket];
          const bValue = b[sortBy as keyof Ticket];
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'desc' 
              ? bValue.localeCompare(aValue) 
              : aValue.localeCompare(bValue);
          }
          
          if (aValue instanceof Date && bValue instanceof Date) {
            return sortOrder === 'desc'
              ? bValue.getTime() - aValue.getTime()
              : aValue.getTime() - bValue.getTime();
          }
          
          return 0;
        });
        
        return res.json(sortedTickets);
      }
      
      // Default: return all tickets sorted by most recently updated
      const sortedTickets = [...tickets].sort((a, b) => 
        b.updatedAt.getTime() - a.updatedAt.getTime()
      );
      
      res.json(sortedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.get("/api/tickets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }
      
      const ticket = await storage.getTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      res.json(ticket);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res.status(500).json({ message: "Failed to fetch ticket" });
    }
  });

  app.post("/api/tickets", async (req: Request, res: Response) => {
    try {
      const validationResult = insertTicketSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid ticket data", 
          errors: validationResult.error.format() 
        });
      }
      
      const newTicket = await storage.createTicket(validationResult.data);
      res.status(201).json(newTicket);
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ message: "Failed to create ticket" });
    }
  });

  app.patch("/api/tickets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }
      
      const ticket = await storage.getTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      const updateSchema = z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.string().optional(),
        priority: z.string().optional(),
        assignedTo: z.string().optional().nullable(),
        // Add other fields that can be updated
      });
      
      const validationResult = updateSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid update data", 
          errors: validationResult.error.format() 
        });
      }
      
      const updatedTicket = await storage.updateTicket(id, validationResult.data);
      res.json(updatedTicket);
    } catch (error) {
      console.error("Error updating ticket:", error);
      res.status(500).json({ message: "Failed to update ticket" });
    }
  });

  // Event routes
  app.get("/api/tickets/:id/events", async (req: Request, res: Response) => {
    try {
      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }
      
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      const events = await storage.getEvents(ticketId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/tickets/:id/events", async (req: Request, res: Response) => {
    try {
      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }
      
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      const eventData = { ...req.body, ticketId };
      const validationResult = insertEventSchema.safeParse(eventData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid event data", 
          errors: validationResult.error.format() 
        });
      }
      
      const newEvent = await storage.createEvent(validationResult.data);
      res.status(201).json(newEvent);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  // Maintenance history routes
  app.get("/api/tickets/:id/maintenance-history", async (req: Request, res: Response) => {
    try {
      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }
      
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      const histories = await storage.getMaintenanceHistories(ticketId);
      res.json(histories);
    } catch (error) {
      console.error("Error fetching maintenance history:", error);
      res.status(500).json({ message: "Failed to fetch maintenance history" });
    }
  });

  app.post("/api/tickets/:id/maintenance-history", async (req: Request, res: Response) => {
    try {
      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }
      
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      const historyData = { ...req.body, ticketId };
      const validationResult = insertMaintenanceHistorySchema.safeParse(historyData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid maintenance history data", 
          errors: validationResult.error.format() 
        });
      }
      
      const newHistory = await storage.createMaintenanceHistory(validationResult.data);
      res.status(201).json(newHistory);
    } catch (error) {
      console.error("Error creating maintenance history:", error);
      res.status(500).json({ message: "Failed to create maintenance history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
