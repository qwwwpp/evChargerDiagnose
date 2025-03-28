import { 
  users, type User, type InsertUser,
  tickets, type Ticket, type InsertTicket,
  events, type Event, type InsertEvent,
  maintenanceHistories, type MaintenanceHistory, type InsertMaintenanceHistory,
  emojiReactions, type EmojiReaction, type InsertEmojiReaction, type EmojiReactionWithUsers,
  type SysErrorLog
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Ticket operations
  getTickets(): Promise<Ticket[]>;
  getTicket(id: number): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<Ticket>): Promise<Ticket | undefined>;
  deleteTicket(id: number): Promise<boolean>;
  searchTickets(query: string): Promise<Ticket[]>;
  
  // Event operations
  getEvents(ticketId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Maintenance history operations
  getMaintenanceHistories(ticketId: number): Promise<MaintenanceHistory[]>;
  createMaintenanceHistory(history: InsertMaintenanceHistory): Promise<MaintenanceHistory>;
  
  // Emoji reaction operations
  getEmojiReactions(ticketId: number): Promise<EmojiReactionWithUsers[]>;
  addEmojiReaction(reaction: InsertEmojiReaction): Promise<EmojiReactionWithUsers>;
  removeEmojiReaction(reactionId: number, username: string): Promise<EmojiReactionWithUsers | undefined>;
  
  // System error log operations
  getSystemErrorLogs(ticketId: number): Promise<SysErrorLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tickets: Map<number, Ticket>;
  private events: Map<number, Event>;
  private maintenanceHistories: Map<number, MaintenanceHistory>;
  private emojiReactions: Map<number, EmojiReaction>;
  
  userCurrentId: number;
  ticketCurrentId: number;
  eventCurrentId: number;
  maintenanceHistoryCurrentId: number;
  emojiReactionCurrentId: number;

  constructor() {
    this.users = new Map();
    this.tickets = new Map();
    this.events = new Map();
    this.maintenanceHistories = new Map();
    this.emojiReactions = new Map();
    
    this.userCurrentId = 1;
    this.ticketCurrentId = 1;
    this.eventCurrentId = 1;
    this.maintenanceHistoryCurrentId = 1;
    this.emojiReactionCurrentId = 1;
    
    // Add some initial data
    this.initializeData();
  }

  private initializeData() {
    // Create tickets
    const ticket1: InsertTicket = {
      title: "Charger not powering on",
      description: "Unit shows no power indication. Customer reports breaker has not tripped. Last maintenance was 3 months ago.",
      location: "Parkside Apartments",
      locationDetails: "4502 Main St",
      status: "in-progress",
      priority: "normal",
      chargerModel: "PowerFlow AC200",
      chargerType: "Level 2 Charger",
      chargerSerialNumber: "PF-2022-45678",
      reportedBy: "Jane Smith",
      assignedTo: "Technician #08",
      installedAt: new Date("2022-01-15"),
      lastMaintenance: new Date("2022-10-20"),
      firmwareVersion: "v2.1.3",
      connectivity: "WiFi",
      siteContact: "Mark Johnson",
      contactPhone: "(555) 789-0123",
      operatingHours: "6:00 AM - 10:00 PM"
    };
    
    const ticket2: InsertTicket = {
      title: "Connection errors during charging",
      description: "Unit is showing intermittent connection errors during charging sessions. Error code E-304 appears on display. Multiple customer complaints.",
      location: "Metro Charging Hub",
      locationDetails: "123 Electric Ave",
      status: "open",
      priority: "high",
      chargerModel: "PowerFlow DC5000",
      chargerType: "DC Fast Charger",
      chargerSerialNumber: "PF-2023-76548",
      reportedBy: "Michael Chen",
      assignedTo: "Technician #14",
      installedAt: new Date("2022-03-15"),
      lastMaintenance: new Date("2023-01-10"),
      firmwareVersion: "v3.2.1",
      connectivity: "WiFi + Cellular Backup",
      siteContact: "Sarah Johnson",
      contactPhone: "(555) 123-4567",
      operatingHours: "24/7 Access"
    };
    
    const ticket3: InsertTicket = {
      title: "Display screen flickering",
      description: "Display screen is flickering and sometimes goes blank during charging sessions. Charging functionality appears to be working normally.",
      location: "Downtown Parking Garage",
      locationDetails: "78 Pine St",
      status: "open",
      priority: "normal",
      chargerModel: "PowerFlow AC300",
      chargerType: "Level 2 Charger",
      chargerSerialNumber: "PF-2022-34567",
      reportedBy: "David Wilson",
      assignedTo: "Technician #05",
      installedAt: new Date("2022-05-10"),
      lastMaintenance: new Date("2022-11-15"),
      firmwareVersion: "v2.3.0",
      connectivity: "WiFi",
      siteContact: "Robert Taylor",
      contactPhone: "(555) 456-7890",
      operatingHours: "24/7 Access"
    };
    
    const ticket4: InsertTicket = {
      title: "Incorrect charging rate",
      description: "Customers reporting unit delivers lower charging rate than advertised. Should deliver 50kW but appears to max out at 30kW.",
      location: "Riverfront Mall",
      locationDetails: "890 Waterside Dr",
      status: "resolved",
      priority: "normal",
      chargerModel: "PowerFlow DC3000",
      chargerType: "DC Fast Charger",
      chargerSerialNumber: "PF-2021-56789",
      reportedBy: "Emma Rodriguez",
      assignedTo: "Technician #11",
      installedAt: new Date("2021-11-20"),
      lastMaintenance: new Date("2022-09-05"),
      firmwareVersion: "v3.0.2",
      connectivity: "WiFi + Ethernet",
      siteContact: "Lisa Brown",
      contactPhone: "(555) 987-6543",
      operatingHours: "9:00 AM - 9:00 PM"
    };
    
    this.createTicket(ticket1);
    this.createTicket(ticket2);
    this.createTicket(ticket3);
    this.createTicket(ticket4);
    
    // Create events for ticket #2
    const events: InsertEvent[] = [
      {
        ticketId: 2,
        timestamp: new Date("2023-05-12T08:23:00"),
        eventType: "Power On",
        value: "System Check: Pass",
        status: "Normal"
      },
      {
        ticketId: 2,
        timestamp: new Date("2023-05-12T09:15:00"),
        eventType: "Charging Session #1458",
        value: "Connection Established",
        status: "Normal"
      },
      {
        ticketId: 2,
        timestamp: new Date("2023-05-12T09:24:00"),
        eventType: "Charging Session #1458",
        value: "Error E-304",
        status: "Error"
      },
      {
        ticketId: 2,
        timestamp: new Date("2023-05-12T10:05:00"),
        eventType: "System Diagnostic",
        value: "Auto-Reset Completed",
        status: "Warning"
      },
      {
        ticketId: 2,
        timestamp: new Date("2023-05-12T11:32:00"),
        eventType: "Charging Session #1459",
        value: "Error E-187",
        status: "Error"
      }
    ];
    
    events.forEach(event => this.createEvent(event));
    
    // Create maintenance history for ticket #2
    const histories: InsertMaintenanceHistory[] = [
      {
        ticketId: 2,
        title: "Scheduled Maintenance",
        description: "Performed firmware update to v3.2.1, cleaned connectors, tested power output across all ports. All systems functioning normally.",
        performedBy: "Alex Rodriguez",
        performedAt: new Date("2023-01-10")
      },
      {
        ticketId: 2,
        title: "Repair Visit",
        description: "Replaced damaged charging cable on port #2. Calibrated voltage sensor. Verified stable operation under load.",
        performedBy: "Marcus Johnson",
        performedAt: new Date("2022-10-05")
      },
      {
        ticketId: 2,
        title: "Initial Installation",
        description: "Completed installation and commissioning of DC Fast Charger. Connected to network and verified remote monitoring functionality.",
        performedBy: "Installation Team: Alpha Group",
        performedAt: new Date("2022-03-15")
      }
    ];
    
    histories.forEach(history => this.createMaintenanceHistory(history));
    
    // Create some example emoji reactions for ticket #2
    const emojiReactions: InsertEmojiReaction[] = [
      {
        ticketId: 2,
        emoji: "👍",
        createdBy: "Michael Chen",
        users: ["Michael Chen", "Sarah Johnson"] as any
      },
      {
        ticketId: 2,
        emoji: "🔧",
        createdBy: "Technician #14",
        users: ["Technician #14"] as any
      },
      {
        ticketId: 2,
        emoji: "⚡",
        createdBy: "Sarah Johnson",
        users: ["Sarah Johnson", "Michael Chen", "Technician #14"] as any
      }
    ];
    
    emojiReactions.forEach(reaction => this.addEmojiReaction(reaction));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Ticket methods
  async getTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }
  
  async getTicket(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }
  
  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = this.ticketCurrentId++;
    const createdAt = new Date();
    const updatedAt = createdAt;
    const ticket: Ticket = { ...insertTicket, id, createdAt, updatedAt };
    this.tickets.set(id, ticket);
    return ticket;
  }
  
  async updateTicket(id: number, updatedFields: Partial<Ticket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    
    const updatedTicket: Ticket = {
      ...ticket,
      ...updatedFields,
      updatedAt: new Date()
    };
    
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }
  
  async deleteTicket(id: number): Promise<boolean> {
    return this.tickets.delete(id);
  }
  
  async searchTickets(query: string): Promise<Ticket[]> {
    const lowerCaseQuery = query.toLowerCase();
    return Array.from(this.tickets.values()).filter(ticket => 
      ticket.title.toLowerCase().includes(lowerCaseQuery) ||
      ticket.description.toLowerCase().includes(lowerCaseQuery) ||
      ticket.location.toLowerCase().includes(lowerCaseQuery) ||
      ticket.chargerModel.toLowerCase().includes(lowerCaseQuery) ||
      ticket.chargerSerialNumber.toLowerCase().includes(lowerCaseQuery)
    );
  }
  
  // Event methods
  async getEvents(ticketId: number): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter(event => event.ticketId === ticketId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventCurrentId++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }
  
  // Maintenance history methods
  async getMaintenanceHistories(ticketId: number): Promise<MaintenanceHistory[]> {
    return Array.from(this.maintenanceHistories.values())
      .filter(history => history.ticketId === ticketId)
      .sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime());
  }
  
  async createMaintenanceHistory(insertHistory: InsertMaintenanceHistory): Promise<MaintenanceHistory> {
    const id = this.maintenanceHistoryCurrentId++;
    const history: MaintenanceHistory = { ...insertHistory, id };
    this.maintenanceHistories.set(id, history);
    return history;
  }
  
  // Emoji reaction methods
  async getEmojiReactions(ticketId: number): Promise<EmojiReactionWithUsers[]> {
    return Array.from(this.emojiReactions.values())
      .filter(reaction => reaction.ticketId === ticketId)
      .map(reaction => {
        const users = reaction.users as unknown as string[];
        return {
          id: reaction.id,
          ticketId: reaction.ticketId,
          emoji: reaction.emoji,
          count: reaction.count,
          createdBy: reaction.createdBy,
          createdAt: reaction.createdAt,
          users
        };
      });
  }
  
  async addEmojiReaction(insertReaction: InsertEmojiReaction): Promise<EmojiReactionWithUsers> {
    // Check if the same emoji already exists for this ticket
    const existingReaction = Array.from(this.emojiReactions.values()).find(
      reaction => reaction.ticketId === insertReaction.ticketId && 
                 reaction.emoji === insertReaction.emoji
    );
    
    if (existingReaction) {
      // Check if user already reacted with this emoji
      const users = existingReaction.users as unknown as string[];
      
      if (!users.includes(insertReaction.createdBy)) {
        // Add user to the reaction
        const updatedUsers = [...users, insertReaction.createdBy];
        const updatedCount = existingReaction.count + 1;
        
        // Update the reaction
        const updatedReaction: EmojiReaction = {
          ...existingReaction,
          count: updatedCount,
          users: updatedUsers as any
        };
        
        this.emojiReactions.set(existingReaction.id, updatedReaction);
        
        // Return updated reaction
        return {
          id: updatedReaction.id,
          ticketId: updatedReaction.ticketId,
          emoji: updatedReaction.emoji,
          count: updatedReaction.count,
          createdBy: updatedReaction.createdBy,
          createdAt: updatedReaction.createdAt,
          users: updatedUsers
        };
      } else {
        // User already reacted with this emoji, return the existing reaction
        return {
          id: existingReaction.id,
          ticketId: existingReaction.ticketId,
          emoji: existingReaction.emoji,
          count: existingReaction.count,
          createdBy: existingReaction.createdBy,
          createdAt: existingReaction.createdAt,
          users
        };
      }
    } else {
      // Create a new reaction
      const id = this.emojiReactionCurrentId++;
      const createdAt = new Date();
      const users = [insertReaction.createdBy];
      
      const reaction: EmojiReaction = {
        ...insertReaction,
        id,
        count: 1,
        createdAt,
        users: users as any
      };
      
      this.emojiReactions.set(id, reaction);
      
      // Return new reaction
      return {
        id: reaction.id,
        ticketId: reaction.ticketId,
        emoji: reaction.emoji,
        count: reaction.count,
        createdBy: reaction.createdBy,
        createdAt: reaction.createdAt,
        users
      };
    }
  }
  
  async removeEmojiReaction(reactionId: number, username: string): Promise<EmojiReactionWithUsers | undefined> {
    const reaction = this.emojiReactions.get(reactionId);
    
    if (!reaction) {
      return undefined;
    }
    
    const users = reaction.users as unknown as string[];
    
    if (!users.includes(username)) {
      // User has not reacted with this emoji
      return {
        id: reaction.id,
        ticketId: reaction.ticketId,
        emoji: reaction.emoji,
        count: reaction.count,
        createdBy: reaction.createdBy,
        createdAt: reaction.createdAt,
        users
      };
    }
    
    // Remove user from the reaction
    const updatedUsers = users.filter(user => user !== username);
    const updatedCount = reaction.count - 1;
    
    if (updatedCount <= 0) {
      // No more reactions, remove it
      this.emojiReactions.delete(reactionId);
      return undefined;
    }
    
    // Update the reaction
    const updatedReaction: EmojiReaction = {
      ...reaction,
      count: updatedCount,
      users: updatedUsers as any
    };
    
    this.emojiReactions.set(reactionId, updatedReaction);
    
    // Return updated reaction
    return {
      id: updatedReaction.id,
      ticketId: updatedReaction.ticketId,
      emoji: updatedReaction.emoji,
      count: updatedReaction.count,
      createdBy: updatedReaction.createdBy,
      createdAt: updatedReaction.createdAt,
      users: updatedUsers
    };
  }
  
  // System error log methods
  async getSystemErrorLogs(ticketId: number): Promise<SysErrorLog[]> {
    // In a real application, this would fetch actual logs from a database or API
    // Here, we'll return hardcoded sample data based on the ticket ID
    
    const currentDate = new Date();
    
    // Create sample error logs with different patterns based on the ticket ID
    const sampleLogs: SysErrorLog[] = [
      {
        id: 1001,
        timestamp: currentDate.getTime() - 3600000, // 1 hour ago
        createTime: new Date(currentDate.getTime() - 3600000).toISOString(),
        ip: "192.168.1.100",
        tags: ["charger", "connection", "error"],
        moduleName: "ConnectionManager",
        errorCode: "E-304",
        action: "CONNECT",
        description: "Failed to establish secure connection with payment processor",
        info: {
          requestUri: "/api/payment/process",
          errorDetails: "TLS handshake timeout after 30s"
        }
      },
      {
        id: 1002,
        timestamp: currentDate.getTime() - 7200000, // 2 hours ago
        createTime: new Date(currentDate.getTime() - 7200000).toISOString(),
        ip: "192.168.1.100",
        tags: ["charger", "system", "warning"],
        moduleName: "PowerManagement",
        errorCode: "E-187",
        action: "POWER_DELIVERY",
        description: "Voltage fluctuation detected outside of normal parameters",
        info: {
          voltage: "242V (expected 220-240V)",
          fluctuation: "±8V"
        }
      },
      {
        id: 1003,
        timestamp: currentDate.getTime() - 86400000, // 1 day ago
        createTime: new Date(currentDate.getTime() - 86400000).toISOString(),
        ip: "192.168.1.100",
        tags: ["charger", "hardware", "critical"],
        moduleName: "ThermalControl",
        errorCode: "E-501",
        action: "TEMPERATURE_CHECK",
        description: "Critical temperature threshold exceeded, emergency shutdown initiated",
        info: {
          temperature: "78°C",
          threshold: "75°C",
          location: "Main converter"
        }
      },
      {
        id: 1004,
        timestamp: currentDate.getTime() - 172800000, // 2 days ago
        createTime: new Date(currentDate.getTime() - 172800000).toISOString(),
        ip: "192.168.1.100",
        tags: ["charger", "authentication", "error"],
        moduleName: "AuthService",
        errorCode: "E-203",
        action: "AUTHENTICATE",
        description: "RFID authentication failed - card not recognized",
        info: {
          cardId: "******7890",
          attemptCount: 3
        }
      },
      {
        id: 1005,
        timestamp: currentDate.getTime() - 259200000, // 3 days ago
        createTime: new Date(currentDate.getTime() - 259200000).toISOString(),
        ip: "192.168.1.100",
        tags: ["charger", "firmware", "info"],
        moduleName: "UpdateManager",
        errorCode: "I-100",
        action: "FIRMWARE_UPDATE",
        description: "Firmware update process interrupted",
        info: {
          fromVersion: "v3.1.5",
          toVersion: "v3.2.1",
          progress: "68%"
        }
      }
    ];
    
    return sampleLogs;
  }
}

export const storage = new MemStorage();
