import { env } from "cloudflare:workers";
export type Member = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "finance" | "member";
  flotilla: string;
  active: number;
  must_change: number;
  password: string;
};
export function database() {
  if (!env.DB)
    throw new Error(
      "Member services are temporarily unavailable. Please try again later.",
    );
  return env.DB;
}
export const now = () => new Date().toISOString();
export const uid = () => crypto.randomUUID();
export const safeMember = (m: Member) => ({
  id: m.id,
  name: m.name,
  email: m.email,
  role: m.role,
  flotilla: m.flotilla,
  active: m.active,
  must_change: m.must_change,
});
export async function digest(value: string) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
    (x) => x.toString(16).padStart(2, "0"),
  ).join("");
}
function hex(bytes: Uint8Array) {
  return Array.from(bytes, (x) => x.toString(16).padStart(2, "0")).join("");
}
export async function passwordHash(
  password: string,
  salt = hex(crypto.getRandomValues(new Uint8Array(16))),
) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const result = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: new TextEncoder().encode(salt),
      iterations: 100000,
    },
    key,
    256,
  );
  return `pbkdf2$100000$${salt}$${hex(new Uint8Array(result))}`;
}
export function same(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}
export async function verify(password: string, stored: string) {
  const parts = stored.split("$");
  return (
    parts.length === 4 && same(await passwordHash(password, parts[2]), stored)
  );
}
export async function currentUser(req: Request) {
  const token = req.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)semp_session=([a-f0-9]{64})(?:;|$)/)?.[1];
  if (!token) return null;
  return await database()
    .prepare(
      "SELECT m.* FROM members m JOIN sessions s ON s.member_id=m.id WHERE s.token=? AND s.expires>? AND m.active=1",
    )
    .bind(await digest(token), Date.now())
    .first<Member>();
}
export async function startSession(memberId: string, req: Request) {
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  await database()
    .prepare("INSERT INTO sessions(token,member_id,expires) VALUES(?,?,?)")
    .bind(await digest(token), memberId, Date.now() + 8 * 60 * 60 * 1000)
    .run();
  return `semp_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${new URL(req.url).hostname === "localhost" || new URL(req.url).hostname === "127.0.0.1" ? "" : "; Secure"}`;
}
export function auditStatement(actor: string, action: string, target: string) {
  return database()
    .prepare(
      "INSERT INTO audit(id,actor,action,target,created_at) VALUES(?,?,?,?,?)",
    )
    .bind(uid(), actor, action, target, now());
}
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function need(
  value: unknown,
  message: string,
  status = 400,
): asserts value {
  if (!value) throw new HttpError(status, message);
}
export function textValue(value: unknown, label: string, max = 200) {
  need(
    typeof value === "string" &&
      value.trim().length > 0 &&
      value.trim().length <= max,
    `${label} is required (maximum ${max} characters).`,
  );
  return value.trim();
}
export function validDate(value: unknown) {
  const date = textValue(value, "Date", 10);
  need(
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
      !Number.isNaN(Date.parse(date)) &&
      new Date(date).toISOString().slice(0, 10) === date,
    "Enter a valid date.",
  );
  return date;
}
export function validPassword(value: unknown) {
  need(
    typeof value === "string" && value.length >= 14 && value.length <= 128,
    "Use a password with 14–128 characters.",
  );
  return value;
}
export function validEmail(value: unknown) {
  const email = textValue(value, "Email", 254).toLowerCase();
  need(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    "Enter a valid email address.",
  );
  return email;
}
export async function rateLimit(req: Request, account: string) {
  const db = database();
  const ip = req.headers.get("cf-connecting-ip") || "unknown";
  const window = Math.floor(Date.now() / 900000);
  for (const [label, limit] of [
    [ip, 40],
    [`${ip}:${account}`, 7],
  ] as const) {
    const key = await digest(`${label}:${window}`);
    const result = await db
      .prepare(
        "INSERT INTO rate_limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
      )
      .bind(key, Date.now() + 900000)
      .first<{ count: number }>();
    need(
      result && result.count <= limit,
      "Too many attempts. Please try again in 15 minutes.",
      429,
    );
  }
  await db
    .prepare("DELETE FROM rate_limits WHERE expires<?")
    .bind(Date.now())
    .run();
}
export function setupKey() {
  return (env as unknown as { ADMIN_SETUP_KEY?: string }).ADMIN_SETUP_KEY;
}
export const chargeQuery =
  "SELECT c.*, COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.charge_id=c.id),0) AS paid, m.name AS member_name, plan.paid_baseline, (SELECT json_group_array(json_object('id',i.id,'amount',i.amount,'due_date',i.due_date) ORDER BY i.due_date,i.id) FROM installments i WHERE i.plan_id=plan.id) AS installments FROM charges c JOIN members m ON m.id=c.member_id LEFT JOIN plans plan ON plan.charge_id=c.id";
