import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Ticket schema
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  locationDetails: text("location_details").notNull(),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("normal"),
  chargerModel: text("charger_model").notNull(),
  chargerType: text("charger_type").notNull(),
  chargerSerialNumber: text("charger_serial_number").notNull(),
  reportedBy: text("reported_by").notNull(),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  installedAt: timestamp("installed_at"),
  lastMaintenance: timestamp("last_maintenance"),
  firmwareVersion: text("firmware_version"),
  connectivity: text("connectivity"),
  siteContact: text("site_contact"),
  contactPhone: text("contact_phone"),
  operatingHours: text("operating_hours"),
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;

// Error events schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  eventType: text("event_type").notNull(),
  value: text("value").notNull(),
  status: text("status").notNull(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Maintenance history schema
export const maintenanceHistories = pgTable("maintenance_histories", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  performedBy: text("performed_by").notNull(),
  performedAt: timestamp("performed_at").notNull(),
});

export const insertMaintenanceHistorySchema = createInsertSchema(maintenanceHistories).omit({
  id: true
});

export type InsertMaintenanceHistory = z.infer<typeof insertMaintenanceHistorySchema>;
export type MaintenanceHistory = typeof maintenanceHistories.$inferSelect;
