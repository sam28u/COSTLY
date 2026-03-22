import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  boolean,
  doublePrecision,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  hourlyWage: doublePrecision("hourly_wage").default(0),
  totalMoneySaved: doublePrecision("total_money_saved").default(0),
  totalTimeSaved: integer("total_time_saved").default(0),
  currentMoneyBalance: doublePrecision("current_money_balance").default(0),
  currentTimeBalance: integer("current_time_balance").default(0),
});

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"), // Added this
    access_token: text("access_token"), // Added this
    expires_at: integer("expires_at"), // Added this
    token_type: text("token_type"), // Added this
    scope: text("scope"), // Added this
    id_token: text("id_token"), // Added this
    session_state: text("session_state"), // Added this
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const habits = pgTable("habit", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  costPerUnit: doublePrecision("cost_per_unit").notNull().default(0),
  timePerUnit: integer("time_per_unit").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const goals = pgTable("goal", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  targetMoney: doublePrecision("target_money").default(0),
  targetTimeMinutes: integer("target_time_minutes").default(0),
  currentMoneySaved: doublePrecision("current_money_saved").default(0),
  currentTimeSavedMinutes: integer("current_time_saved_minutes").default(0),
  status: text("status").$type<"active" | "achieved">().default("active"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habitLogs = pgTable("habit_log", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }),
  goalId: integer("goal_id").references(() => goals.id, {
    onDelete: "set null",
  }),
  moneySaved: doublePrecision("money_saved").notNull(), 
  timeSaved: integer("time_saved").notNull(),
  
  isSkipped: boolean("is_skipped").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
});
