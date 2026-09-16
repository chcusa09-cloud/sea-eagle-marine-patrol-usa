"use client";
import { useEffect, useState, type FormEvent } from "react";
import { Anchor, CalendarDays, LockKeyhole, Users, Wallet } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  api,
  money,
  dateLabel,
  nextDue,
  balance,
  chargeStatus,
  overdue,
  schedule,
  type User,
  type Charge,
  type Dashboard,
  type EventItem,
} from "@/lib/shared";
import { ManagementPanel } from "./management";
export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required = true,
  min,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  min?: string;
  placeholder?: string;
}) {
  return (
    <label className="field">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        minLength={type === "password" ? 14 : undefined}
        maxLength={type === "password" ? 128 : undefined}
        autoComplete={
          type === "password"
            ? "new-password"
            : type === "email"
              ? "email"
              : undefined
        }
        placeholder={placeholder}
      />
    </label>
  );
}
export function Empty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state">
      <Anchor size={28} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export function EventList({ events }: { events: EventItem[] }) {
  return events.length ? (
    <div className="event-list">
      {events.map((e) => (
        <article className="event-card" key={e.id}>
          <time dateTime={e.date}>{dateLabel(e.date)}</time>
          <h3 style={{ marginTop: 12 }}>{e.title}</h3>
          <strong>{e.location}</strong>
          <p>{e.description}</p>
        </article>
      ))}
    </div>
  ) : (
    <Empty
      title="No upcoming events yet"
      description="Check back for the next SEMP USA gathering."
    />
  );
}
export function ChargeTable({ charges }: { charges: Charge[] }) {
  return charges.length ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Charge</TableHead>
          <TableHead>Due date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Paid</TableHead>
          <TableHead>Owed</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {charges.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <strong>{c.label}</strong>
              <div className="balance-detail">
                {c.period}
                {schedule(c).length ? " · Payment plan" : ""}
              </div>
            </TableCell>
            <TableCell>{dateLabel(nextDue(c))}</TableCell>
            <TableCell>{money(c.amount)}</TableCell>
            <TableCell>{money(c.paid)}</TableCell>
            <TableCell>
              <strong>{money(balance(c))}</strong>
            </TableCell>
            <TableCell>
              <span
                className={
                  "status-pill " +
                  (chargeStatus(c) === "Past due"
                    ? "overdue"
                    : chargeStatus(c) === "Paid"
                      ? "paid"
                      : "")
                }
              >
                {chargeStatus(c)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <Empty
      title="No charges assigned"
      description="Your assigned dues and fees will appear here."
    />
  );
}
function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(e.currentTarget);
    try {
      const r = await api("login", {
        email: data.get("email"),
        password: data.get("password"),
      });
      onLogin(r.user);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="login-layout">
      <aside className="login-story">
        <img src="/sea-eagle-logo.jpeg" alt="SEMP USA emblem" />
        <p className="eyebrow">THE MEMBER PORTAL</p>
        <h1>
          One crew.
          <br />A shared purpose.
        </h1>
        <p>Your dues, your community, and the next opportunity to serve.</p>
      </aside>
      <div className="login-area">
        <form className="form-card" onSubmit={submit}>
          <LockKeyhole color="#b5162d" size={28} />
          <h2 style={{ marginTop: 22 }}>Welcome aboard.</h2>
          <p className="muted">Sign in to your SEMP USA account.</p>
          <Field label="Email address" name="email" type="email" />
          <label className="field">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              maxLength={128}
            />
          </label>
          {error && (
            <p role="alert" className="notice">
              {error}
            </p>
          )}
          <button className="button red" disabled={busy}>
            {busy ? "Signing in…" : "Sign in to member portal"}
          </button>
          <p className="privacy-note">
            Membership accounts are created by an administrator. There is no
            public signup.
          </p>
          <p className="form-help">
            Need access or a password reset? Contact your SEMP administrator or{" "}
            <a href="mailto:info@sempusa.org">
              <u>info@sempusa.org</u>
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
function PasswordForm({
  onChanged,
  required = false,
}: {
  onChanged: () => void;
  required?: boolean;
}) {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setBusy(true);
        setMessage("");
        try {
          if (f.get("password") !== f.get("confirm"))
            throw new Error("The new passwords do not match.");
          await api("password", {
            current: f.get("current"),
            password: f.get("password"),
          });
          onChanged();
          setMessage("Password updated. Other sessions have been signed out.");
        } catch (e) {
          setMessage((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2>{required ? "Set your personal password" : "Change password"}</h2>
      <p className="form-help">
        {required
          ? "Replace your temporary password before accessing your member account."
          : "Use at least 14 characters. A memorable passphrase works well."}
      </p>
      <Field label="Current password" name="current" type="password" />
      <Field label="New password" name="password" type="password" />
      <Field label="Confirm new password" name="confirm" type="password" />
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      <button className="button red" disabled={busy}>
        {busy ? "Saving…" : "Save password"}
      </button>
    </form>
  );
}
export function Setup() {
  const [msg, setMsg] = useState(""),
    [busy, setBusy] = useState(false),
    [done, setDone] = useState(false);
  return (
    <div className="content-wrap" style={{ maxWidth: 600 }}>
      <h1>Administrator setup</h1>
      <p className="muted">
        This one-time setup requires the private setup key provided to the site
        owner.
      </p>
      {done ? (
        <>
          <p className="notice success">{msg}</p>
          <a href="/portal" className="button red">
            Continue to sign in
          </a>
        </>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setMsg("");
            try {
              const f = new FormData(e.currentTarget);
              const r = await api("setup", Object.fromEntries(f));
              setMsg(r.message);
              setDone(true);
            } catch (e) {
              setMsg((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field label="Private setup key" name="key" type="password" />
          <Field label="Administrator name" name="name" />
          <Field label="Administrator email" name="email" type="email" />
          <Field
            label="Password (at least 14 characters)"
            name="password"
            type="password"
          />
          {msg && (
            <p role="alert" className="notice">
              {msg}
            </p>
          )}
          <button className="button red" disabled={busy}>
            {busy ? "Creating account…" : "Create first administrator"}
          </button>
        </form>
      )}
    </div>
  );
}
export function Portal() {
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(true),
    [data, setData] = useState<Dashboard | null>(null),
    [error, setError] = useState(""),
    [tab, setTab] = useState("dues");
  async function reload() {
    setError("");
    try {
      const r = await api("dashboard");
      setData(r);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    api("me")
      .then((r) => setUser(r.user))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (user && !user.must_change) void reload();
  }, [user]);
  useEffect(() => {
    if (!user || user.must_change) return;
    type Context = {
      registerTool: (
        tool: unknown,
        options: { signal: AbortSignal },
      ) => void | Promise<void>;
    };
    const context = (document as Document & { modelContext?: Context })
      .modelContext;
    if (!context) return;
    const lifecycle = new AbortController();
    void Promise.resolve(
      context.registerTool(
        {
          name: "view_member_dues",
          description:
            "Open the signed-in member’s dues tab and return current and past-due balances. Does not change any financial records.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, untrustedContentHint: true },
          execute: async (input: unknown) => {
            if (
              !input ||
              typeof input !== "object" ||
              Object.keys(input).length
            )
              throw new Error("Expected an empty object.");
            const latest = await api("dashboard");
            setData(latest);
            setTab("dues");
            return {
              charges: latest.charges,
              totalOwed: latest.charges.reduce(
                (sum: number, c: Charge) => sum + balance(c),
                0,
              ),
              currency: "USD",
              amountUnit: "cents",
            };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {});
    return () => lifecycle.abort();
  }, [user]);
  if (loading)
    return (
      <div className="content-wrap" role="status">
        Loading your member portal…
      </div>
    );
  if (!user) return <Login onLogin={setUser} />;
  async function signout() {
    try {
      await api("logout", {});
      setData(null);
      setUser(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <div className="portal-bg">
      <div className="portal-heading">
        <div>
          <h1>Welcome, {user.name}.</h1>
          <p>
            <span className="badge">
              {user.role === "finance"
                ? "Finance administrator"
                : user.role === "admin"
                  ? "Administrator"
                  : "Member"}
            </span>{" "}
            {user.flotilla && ` · ${user.flotilla} Flotilla`}
          </p>
        </div>
        <button className="button outline compact" onClick={signout}>
          Sign out
        </button>
      </div>
      <div className="portal-content">
        {error && (
          <div role="alert" className="notice">
            {error}{" "}
            <button onClick={reload}>
              <u>Try again</u>
            </button>
          </div>
        )}
        {user.must_change ? (
          <div className="panel" style={{ maxWidth: 550, margin: "auto" }}>
            <PasswordForm
              required
              onChanged={() => setUser({ ...user, must_change: 0 })}
            />
          </div>
        ) : (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="tabs-list">
              <TabsTrigger value="dues">
                <Wallet size={16} /> My dues
              </TabsTrigger>
              <TabsTrigger value="events">
                <CalendarDays size={16} /> Events
              </TabsTrigger>
              <TabsTrigger value="directory">
                <Users size={16} /> Directory
              </TabsTrigger>
              {user.role !== "member" && (
                <TabsTrigger value="management">
                  {user.role === "admin" ? "Administration" : "Finance"}
                </TabsTrigger>
              )}
              <TabsTrigger value="account">My account</TabsTrigger>
            </TabsList>
            <TabsContent value="dues">
              {data ? (
                <>
                  <div className="metrics">
                    <div className="metric">
                      <p>Total owed</p>
                      <strong>
                        {money(
                          data.charges.reduce((s, c) => s + balance(c), 0),
                        )}
                      </strong>
                    </div>
                    <div className="metric">
                      <p>Currently due</p>
                      <strong>
                        {money(
                          data.charges.reduce(
                            (s, c) => s + balance(c) - overdue(c),
                            0,
                          ),
                        )}
                      </strong>
                    </div>
                    <div className="metric danger">
                      <p>Past due</p>
                      <strong>
                        {money(
                          data.charges.reduce((s, c) => s + overdue(c), 0),
                        )}
                      </strong>
                    </div>
                  </div>
                  <div className="panel">
                    <h2>My dues & fees</h2>
                    <p className="form-help">
                      Monthly membership: $20 · Converge: $250 · Leadership
                      retreat: $100
                    </p>
                    <ChargeTable charges={data.charges} />
                    <p className="privacy-note">
                      Only charges assigned to your account are included.
                      Payments are recorded by your administrator; online
                      payment is not available. Contact your finance
                      administrator for payment instructions.
                    </p>
                  </div>
                  <div className="panel">
                    <h2>My payment plans</h2>
                    <p className="form-help">
                      Need to spread out a payment? Ask your finance
                      administrator about 2, 3, 4, or 6 monthly installments.
                      Payments are recorded manually.
                    </p>
                    {data.charges.some((c) => schedule(c).length) ? (
                      data.charges
                        .filter((c) => schedule(c).length)
                        .map((c) => (
                          <div className="event-card" key={c.id}>
                            <h3>
                              {c.label} · {c.period}
                            </h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Installment date</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Remaining</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {schedule(c).map((i) => (
                                  <TableRow key={i.id}>
                                    <TableCell>
                                      {dateLabel(i.due_date)}
                                    </TableCell>
                                    <TableCell>{money(i.amount)}</TableCell>
                                    <TableCell>{money(i.remaining)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ))
                    ) : (
                      <p className="muted">No payment plan assigned yet.</p>
                    )}
                  </div>
                  <div className="panel">
                    <h2>Payment history</h2>
                    {data.payments.length ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Charge</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.payments.map((p) => (
                            <TableRow key={p.id}>
                              <TableCell>{dateLabel(p.paid_date)}</TableCell>
                              <TableCell>{p.label}</TableCell>
                              <TableCell>{p.reference}</TableCell>
                              <TableCell>{money(p.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="muted">No payments recorded yet.</p>
                    )}
                  </div>
                </>
              ) : (
                <p role="status">Loading your balances…</p>
              )}
            </TabsContent>
            <TabsContent value="events">
              <div className="panel">
                <h2>Upcoming events</h2>
                <EventList events={data?.events || []} />
              </div>
            </TabsContent>
            <TabsContent value="directory">
              <div className="panel">
                <h2>Member directory</h2>
                <p className="form-help">
                  Names and flotilla affiliations are visible to active members.
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Flotilla</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.directory.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.name}</TableCell>
                        <TableCell>{m.flotilla || "Not assigned"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            {user.role !== "member" && (
              <TabsContent value="management">
                <ManagementPanel user={user} />
              </TabsContent>
            )}
            <TabsContent value="account">
              <div className="grid-two">
                <div className="panel">
                  <h2>My membership</h2>
                  <p>
                    <strong>{user.name}</strong>
                    <br />
                    {user.email}
                  </p>
                  <p>Flotilla: {user.flotilla || "Not assigned"}</p>
                  <p className="form-help">
                    Contact your administrator if your membership details need
                    to change.
                  </p>
                </div>
                <div className="panel">
                  <PasswordForm onChanged={() => void reload()} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

