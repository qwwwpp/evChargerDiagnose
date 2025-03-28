import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertTicketSchema, 
  insertEventSchema, 
  insertMaintenanceHistorySchema,
  insertEmojiReactionSchema,
  type Ticket,
  type EmojiReactionWithUsers,
  type SysErrorLog
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

  // Emoji Reaction routes
  app.get("/api/tickets/:id/reactions", async (req: Request, res: Response) => {
    try {
      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }
      
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      const reactions = await storage.getEmojiReactions(ticketId);
      res.json(reactions);
    } catch (error) {
      console.error("Error fetching emoji reactions:", error);
      res.status(500).json({ message: "Failed to fetch emoji reactions" });
    }
  });

  app.post("/api/tickets/:id/reactions", async (req: Request, res: Response) => {
    try {
      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }
      
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      const reactionData = { ...req.body, ticketId };
      const validationResult = insertEmojiReactionSchema.safeParse(reactionData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid emoji reaction data", 
          errors: validationResult.error.format() 
        });
      }
      
      const newReaction = await storage.addEmojiReaction(validationResult.data);
      res.status(201).json(newReaction);
    } catch (error) {
      console.error("Error adding emoji reaction:", error);
      res.status(500).json({ message: "Failed to add emoji reaction" });
    }
  });

  app.delete("/api/tickets/:ticketId/reactions/:reactionId/users/:username", async (req: Request, res: Response) => {
    try {
      const ticketId = parseInt(req.params.ticketId);
      const reactionId = parseInt(req.params.reactionId);
      const username = req.params.username;
      
      if (isNaN(ticketId) || isNaN(reactionId)) {
        return res.status(400).json({ message: "Invalid ticket ID or reaction ID" });
      }
      
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      const updatedReaction = await storage.removeEmojiReaction(reactionId, username);
      
      if (updatedReaction) {
        res.json(updatedReaction);
      } else {
        res.status(204).send(); // No content, reaction was removed entirely
      }
    } catch (error) {
      console.error("Error removing emoji reaction:", error);
      res.status(500).json({ message: "Failed to remove emoji reaction" });
    }
  });

  const httpServer = createServer(app);

  // Setup WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Track active connections by ticket ID
  const connections: Map<number, Set<WebSocket>> = new Map();

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket connection established');
    
    // Handle ticket subscription messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'subscribe' && data.ticketId) {
          const ticketId = parseInt(data.ticketId);
          
          if (!connections.has(ticketId)) {
            connections.set(ticketId, new Set());
          }
          
          connections.get(ticketId)?.add(ws);
          console.log(`Client subscribed to ticket ${ticketId}`);
          
          // Send initial emoji reactions
          (async () => {
            try {
              const reactions = await storage.getEmojiReactions(ticketId);
              
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'reactions',
                  ticketId,
                  reactions
                }));
              }
            } catch (error) {
              console.error('Error sending initial reactions:', error);
            }
          })();
        }
        else if (data.type === 'unsubscribe' && data.ticketId) {
          const ticketId = parseInt(data.ticketId);
          connections.get(ticketId)?.delete(ws);
          console.log(`Client unsubscribed from ticket ${ticketId}`);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      
      // Remove this connection from all subscriptions
      connections.forEach((clients, ticketId) => {
        clients.delete(ws);
        
        // Clean up empty subscription sets
        if (clients.size === 0) {
          connections.delete(ticketId);
        }
      });
    });
  });

  // Hook into storage API to broadcast reaction updates
  const originalAddEmojiReaction = storage.addEmojiReaction.bind(storage);
  storage.addEmojiReaction = async function(reaction) {
    const result = await originalAddEmojiReaction(reaction);
    broadcastEmojiReactions(reaction.ticketId);
    return result;
  };
  
  const originalRemoveEmojiReaction = storage.removeEmojiReaction.bind(storage);
  storage.removeEmojiReaction = async function(reactionId, username) {
    // Find the ticket ID for this reaction
    const reaction = Array.from(storage['emojiReactions'].values())
      .find(r => r.id === reactionId);
    
    if (!reaction) return undefined;
    
    const ticketId = reaction.ticketId;
    const result = await originalRemoveEmojiReaction(reactionId, username);
    broadcastEmojiReactions(ticketId);
    return result;
  };
  
  // Helper function to broadcast reaction updates
  async function broadcastEmojiReactions(ticketId: number) {
    const clients = connections.get(ticketId);
    if (!clients || clients.size === 0) return;
    
    try {
      const reactions = await storage.getEmojiReactions(ticketId);
      const message = JSON.stringify({
        type: 'reactions',
        ticketId,
        reactions
      });
      
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      console.error('Error broadcasting reactions:', error);
    }
  }
  
  // System Error Log routes - updated endpoint
  app.get("/charging/sys_error_log", async (req: Request, res: Response) => {
    try {
      const ticketId = parseInt(req.query.id as string);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }
      
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      const errorLogs = await storage.getSystemErrorLogs(ticketId);
      res.json(errorLogs);
    } catch (error) {
      console.error("Error fetching system error logs:", error);
      res.status(500).json({ message: "Failed to fetch system error logs" });
    }
  });

  return httpServer;
}
