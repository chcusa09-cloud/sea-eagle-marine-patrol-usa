import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";
export const members = sqliteTable("members", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("member"),
  flotilla: text("flotilla").notNull().default(""),
  active: integer("active").notNull().default(1),
  mustChange: integer("must_change").notNull().default(1),
  createdAt: text("created_at").notNull(),
});
export const sessions = sqliteTable("sessions", {
  token: text("token").primaryKey(),
  memberId: text("member_id")
    .notNull()
    .references(() => members.id),
  expires: integer("expires").notNull(),
});
export const charges = sqliteTable(
  "charges",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id),
    label: text("label").notNull(),
    kind: text("kind").notNull(),
    period: text("period").notNull(),
    amount: integer("amount").notNull(),
    dueDate: text("due_date").notNull(),
    createdAt: text("created_at").notNull(),
    createdBy: text("created_by").notNull(),
    voided: integer("voided").notNull().default(0),
  },
  (t) => [
    uniqueIndex("charge_member_kind_period").on(t.memberId, t.kind, t.period),
  ],
);
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  chargeId: text("charge_id")
    .notNull()
    .references(() => charges.id),
  amount: integer("amount").notNull(),
  reference: text("reference").notNull(),
  paidDate: text("paid_date").notNull(),
  createdAt: text("created_at").notNull(),
  createdBy: text("created_by").notNull(),
});
export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  createdAt: text("created_at").notNull(),
});
export const outreach = sqliteTable("outreach", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  amount: integer("amount").notNull().default(0),
  createdAt: text("created_at").notNull(),
});
export const audit = sqliteTable("audit", {
  id: text("id").primaryKey(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  target: text("target").notNull(),
  createdAt: text("created_at").notNull(),
});
export const limits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  expires: integer("expires").notNull(),
});
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
export const plans = sqliteTable("plans", {
  id: text("id").primaryKey(),
  chargeId: text("charge_id")
    .notNull()
    .unique()
    .references(() => charges.id),
  paidBaseline: integer("paid_baseline").notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull(),
});
export const installments = sqliteTable(
  "installments",
  {
    id: text("id").primaryKey(),
    planId: text("plan_id")
      .notNull()
      .references(() => plans.id),
    amount: integer("amount").notNull(),
    dueDate: text("due_date").notNull(),
  },
  (t) => [index("installments_plan").on(t.planId)],
);
