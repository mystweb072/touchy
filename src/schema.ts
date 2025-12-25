import { relations, sql } from "drizzle-orm";
import {
  timestamp,
  pgTable,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey(),
  inviteCode: varchar("invite_code", { length: 100 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  isProfileCompleted: boolean("is_profile_completed").default(false),
  avatarUrl: varchar("avatar_url", { length: 100 })
    .notNull()
    .default("user.png"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const invitations = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  inviteCode: varchar("invite_code", { length: 100 }).notNull().unique(),
  from_user: uuid("from_user")
    .notNull()
    .references(() => profiles.userId, { onDelete: "cascade" }),
  to_user: uuid("to_user").references(() => profiles.userId, {
    onDelete: "set null",
  }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  isAccepted: boolean("is_accepted").default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),

  expiresAt: timestamp("expires_at", { mode: "date" }).default(
    sql`NOW() + INTERVAL '1 day'`,
  ),
});

export const connections = pgTable("connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderUserId: uuid("sender_user_id")
    .notNull()
    .references(() => profiles.userId, { onDelete: "cascade" }),
  recipientUserId: uuid("recipient_user_id")
    .notNull()
    .references(() => profiles.userId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  connectionId: uuid("connection_id")
    .notNull()
    .references(() => connections.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const reactions = pgTable("reactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  senderUserId: uuid("sender_id")
    .notNull()
    .references(() => profiles.userId, { onDelete: "cascade" }),
  recipientUserId: uuid("recipient_id")
    .notNull()
    .references(() => profiles.userId, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const invitationsRelations = relations(invitations, ({ one }) => ({
  fromUser: one(profiles, {
    fields: [invitations.from_user],
    references: [profiles.userId],
  }),
  toUser: one(profiles, {
    fields: [invitations.to_user],
    references: [profiles.userId],
  }),
}));

export const connectionRelations = relations(connections, ({ one }) => ({
  sender: one(profiles, {
    fields: [connections.senderUserId],
    references: [profiles.userId],
  }),
  recipient: one(profiles, {
    fields: [connections.recipientUserId],
    references: [profiles.userId],
  }),
  room: one(rooms, {
    fields: [connections.id],
    references: [rooms.connectionId],
  }),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  connection: one(connections, {
    fields: [rooms.connectionId],
    references: [connections.id],
  }),
  reactions: many(reactions),
}));

export const reactionsRelations = relations(reactions, ({ one }) => ({
  room: one(rooms, {
    fields: [reactions.roomId],
    references: [rooms.id],
  }),
  sender: one(profiles, {
    fields: [reactions.senderUserId],
    references: [profiles.userId],
  }),
  recipient: one(profiles, {
    fields: [reactions.recipientUserId],
    references: [profiles.userId],
  }),
}));
