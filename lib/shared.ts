export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
export const dateLabel = (date: string) =>
  new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "finance" | "member";
  flotilla: string;
  active: number;
  must_change: number;
};
export type Installment = { id: string; amount: number; due_date: string };
export type Charge = {
  id: string;
  member_id: string;
  member_name: string;
  label: string;
  kind: string;
  period: string;
  amount: number;
  paid: number;
  due_date: string;
  paid_baseline: number | null;
  installments: string;
};
export type Payment = {
  id: string;
  charge_id: string;
  amount: number;
  reference: string;
  paid_date: string;
  label: string;
  member_name?: string;
};
export type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
};
export type OutreachItem = {
  id: string;
  title: string;
  date: string;
  description: string;
  amount: number;
};
export type AuditItem = {
  id: string;
  actor_name: string;
  action: string;
  target: string;
  created_at: string;
};
export type Dashboard = {
  charges: Charge[];
  payments: Payment[];
  events: EventItem[];
  directory: { id: string; name: string; flotilla: string }[];
};
export type Management = {
  members: User[];
  charges: Charge[];
  payments: Payment[];
  events: EventItem[];
  outreach: OutreachItem[];
  audit: AuditItem[];
};
export function balance(c: Charge) {
  return c.amount - c.paid;
}
export function schedule(c: Charge) {
  let paid = Math.max(0, c.paid - (c.paid_baseline || 0));
  const rows = JSON.parse(c.installments || "[]") as Installment[];
  rows.sort((a,b)=>a.due_date.localeCompare(b.due_date)||a.id.localeCompare(b.id));
  return rows.map((i) => {
    const applied = Math.min(paid, i.amount);
    paid -= applied;
    return { ...i, remaining: i.amount - applied };
  });
}
export function nextDue(c:Charge){return schedule(c).find(i=>i.remaining>0)?.due_date||c.due_date}
export function overdue(
  c: Charge,
  today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  }),
) {
  const rows = schedule(c);
  return rows.length
    ? rows
        .filter((i) => i.due_date < today)
        .reduce((s, i) => s + i.remaining, 0)
    : c.due_date < today
      ? balance(c)
      : 0;
}
export function chargeStatus(c: Charge) {
  return balance(c) <= 0
    ? "Paid"
    : overdue(c) > 0
      ? "Past due"
      : "Currently due";
}
type Responses = {
  me: { user: User };
  login: { user: User };
  setup: { message: string };
  dashboard: Dashboard;
  manage: Management;
  public: { events: EventItem[]; outreach: OutreachItem[] };
};
export async function api<T extends string>(
  path: T,
  body?: unknown,
): Promise<T extends keyof Responses ? Responses[T] : Record<string, unknown>> {
  const r = await fetch("/api/" + path, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
    cache: "no-store",
  });
  const data = (await r.json()) as { error?: string };
  if (!r.ok) throw new Error(data.error || "Please try again.");
  return data as T extends keyof Responses
    ? Responses[T]
    : Record<string, unknown>;
}
