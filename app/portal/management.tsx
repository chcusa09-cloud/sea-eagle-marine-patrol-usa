"use client";
import {
  useEffect,
  useState,
  useRef,
  type ReactNode,
  type FormEvent,
} from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  api,
  money,
  dateLabel,
  nextDue,
  balance,
  chargeStatus,
  type User,
  type Management,
} from "@/lib/shared";
import { Field, Empty } from "./portal-client";
const today = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
function Choice({
  label,
  name,
  items,
  value,
  onValueChange,
  defaultValue,
}: {
  label: string;
  name: string;
  items: { value: string; label: string }[];
  value?: string;
  onValueChange?: (s: string) => void;
  defaultValue?: string;
}) {
  return (
    <div className="field">
      <span id={name + "-label"}>{label}</span>
      <Select
        name={name}
        value={value}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        required
      >
        <SelectTrigger aria-labelledby={name + "-label"}>
          <SelectValue placeholder="Choose an option" />
        </SelectTrigger>
        <SelectContent>
          {items.map((i) => (
            <SelectItem key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
function Confirm({
  label,
  title,
  description,
  action,
}: {
  label: string;
  title: string;
  description: string;
  action: () => Promise<void>;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button">{label}</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => void action()}>
            {label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
function DataForm({
  title,
  children,
  submit,
  onSubmit,
}: {
  title: string;
  children: ReactNode;
  submit: string;
  onSubmit: (f: Record<string, FormDataEntryValue>) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [ok, setOk] = useState(false),
    [generation, setGeneration] = useState(0);
  const requestId = useRef("");
  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    setError("");
    setOk(false);
    try {
      requestId.current ||= crypto.randomUUID();
      await onSubmit({ ...f, requestId: requestId.current });
      requestId.current = "";
      setOk(true);
      setGeneration((n) => n + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="panel">
      <h2>{title}</h2>
      <form key={generation} onSubmit={send}>
        {children}
        {error && (
          <p role="alert" className="notice">
            {error}
          </p>
        )}
        {ok && (
          <p role="status" className="notice success">
            Saved successfully.
          </p>
        )}
        <button className="button red" disabled={busy}>
          {busy ? "Saving…" : submit}
        </button>
      </form>
    </div>
  );
}
export function ManagementPanel({ user }: { user: User }) {
  const [data, setData] = useState<Management | null>(null),
    [error, setError] = useState(""),
    [kind, setKind] = useState("monthly");
  async function load() {
    try {
      setData(await api("manage"));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function save(path: string, payload: unknown) {
    await api(path, payload);
    await load();
  }
  async function act(path: string, payload: unknown) {
    try {
      await save(path, payload);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const full = user.role === "admin";
  if (!data)
    return (
      <div className="panel">
        {error ? (
          <p role="alert">
            {error} <button onClick={load}>Retry</button>
          </p>
        ) : (
          <p role="status">Loading administration…</p>
        )}
      </div>
    );
  const active = data.members.filter((m) => m.active),
    memberOptions = active.map((m) => ({
      value: m.id,
      label: `${m.name} (${m.email})`,
    }));
  const openCharges = data.charges.filter((c) => balance(c) > 0);
  return (
    <>
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
      <Tabs defaultValue="charges">
        <TabsList className="tabs-list">
          <TabsTrigger value="charges">Dues & payments</TabsTrigger>
          {full && <TabsTrigger value="members">Members</TabsTrigger>}
          {full && <TabsTrigger value="public">Events & outreach</TabsTrigger>}
          <TabsTrigger value="audit">Activity log</TabsTrigger>
        </TabsList>
        <TabsContent value="charges">
          <div className="grid-two">
            <DataForm
              title="Assign a charge"
              submit="Assign charge"
              onSubmit={async (f) =>
                save("charges", {
                  ...f,
                  amount: Math.round(Number(f.amount || 0) * 100),
                })
              }
            >
              <Choice label="Member" name="memberId" items={memberOptions} />
              <Choice
                label="Fee type"
                name="kind"
                value={kind}
                onValueChange={setKind}
                items={[
                  { value: "monthly", label: "Monthly membership — $20" },
                  { value: "converge", label: "Converge — $250" },
                  { value: "retreat", label: "Leadership retreat — $100" },
                  { value: "other", label: "Other amount" },
                ]}
              />
              <div className="form-grid">
                <Field
                  label={
                    kind === "monthly"
                      ? "Membership month"
                      : "Billing period / year"
                  }
                  name="period"
                  type={kind === "monthly" ? "month" : "text"}
                  defaultValue={
                    kind === "monthly"
                      ? today().slice(0, 7)
                      : today().slice(0, 4)
                  }
                />
                <Field
                  label="Due date"
                  name="dueDate"
                  type="date"
                  defaultValue={today()}
                />
              </div>
              {kind === "other" && (
                <>
                  <Field label="Charge description" name="label" />
                  <label className="field">
                    Amount (USD)
                    <input
                      name="amount"
                      type="number"
                      min="0.01"
                      max="100000"
                      step="0.01"
                      required
                    />
                  </label>
                </>
              )}
              <p className="form-help">
                Each charge applies only to the selected member. Monthly dues
                are assigned one month at a time. The same fee cannot be
                assigned twice for the same period.
              </p>
            </DataForm>
            <DataForm
              title="Record a received payment"
              submit="Record payment"
              onSubmit={async (f) =>
                save("payments", {
                  ...f,
                  amount: Math.round(Number(f.amount) * 100),
                  requestId: f.requestId,
                })
              }
            >
              <Choice
                label="Outstanding charge"
                name="chargeId"
                items={openCharges.map((c) => ({
                  value: c.id,
                  label: `${c.member_name} · ${c.label} (${c.period}) · ${money(balance(c))} owed`,
                }))}
              />
              <div className="form-grid">
                <label className="field">
                  Amount received (USD)
                  <input
                    type="number"
                    name="amount"
                    min="0.01"
                    max="100000"
                    step="0.01"
                    required
                  />
                </label>
                <Field
                  label="Date received"
                  name="paidDate"
                  type="date"
                  defaultValue={today()}
                />
              </div>
              <Field label="Receipt / payment reference" name="reference" />
              <p className="form-help">
                Record only payments already received. Partial payments reduce
                the member’s balance. This does not collect or transfer money.
              </p>
            </DataForm>
          </div>
          <DataForm
            title="Arrange a payment plan"
            submit="Create payment plan"
            onSubmit={async (f) => save("plans", f)}
          >
            <div className="form-grid">
              <Choice
                label="Outstanding charge"
                name="chargeId"
                items={openCharges
                  .filter((c) => c.paid_baseline === null)
                  .map((c) => ({
                    value: c.id,
                    label: `${c.member_name} · ${c.label} · ${money(balance(c))} owed`,
                  }))}
              />
              <Choice
                label="Monthly installments"
                name="count"
                defaultValue="3"
                items={[2, 3, 4, 6].map((n) => ({
                  value: String(n),
                  label: `${n} monthly installments`,
                }))}
              />
              <Field
                label="First installment due"
                name="startDate"
                type="date"
                min={today()}
                defaultValue={today()}
              />
            </div>
            <p className="form-help">
              Splits the remaining balance evenly across monthly dates. Paid
              amounts are preserved. The installment schedule replaces the
              original due date for overdue calculations. No automatic charges
              or withdrawals occur.
            </p>
          </DataForm>
          <div className="panel">
            <h2>All member balances</h2>
            <p className="form-help">
              Total outstanding:{" "}
              <strong>
                {money(data.charges.reduce((s, c) => s + balance(c), 0))}
              </strong>
            </p>
            {data.charges.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Charge / period</TableHead>
                    <TableHead>Due date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Owed</TableHead>
                    <TableHead>Status</TableHead>
                    {full && <TableHead>Action</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.charges.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.member_name}</TableCell>
                      <TableCell>
                        {c.label}
                        <div className="balance-detail">{c.period}</div>
                      </TableCell>
                      <TableCell>{dateLabel(nextDue(c))}</TableCell>
                      <TableCell>{money(c.amount)}</TableCell>
                      <TableCell>{money(c.paid)}</TableCell>
                      <TableCell>{money(balance(c))}</TableCell>
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
                      {full && (
                        <TableCell>
                          <div className="row-actions">
                            {!c.paid && (
                              <Confirm
                                label="Void"
                                title="Void this charge?"
                                description="This unpaid charge will be removed from the member’s balance. Its audit record will be retained."
                                action={() => act("charges/void", { id: c.id })}
                              />
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Empty
                title="No charges yet"
                description="Assign a fee to an individual member above."
              />
            )}
          </div>
          <div className="panel">
            <h2>Recorded payments</h2>
            {data.payments.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Charge</TableHead>
                    <TableHead>Date received</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.member_name}</TableCell>
                      <TableCell>{p.label}</TableCell>
                      <TableCell>{dateLabel(p.paid_date)}</TableCell>
                      <TableCell>{p.reference}</TableCell>
                      <TableCell>{money(p.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="muted">No payments recorded.</p>
            )}
          </div>
        </TabsContent>
        {full && (
          <TabsContent value="members">
            <div className="grid-two">
              <DataForm
                title="Add a member"
                submit="Create member account"
                onSubmit={async (f) => save("members", f)}
              >
                <div className="form-grid">
                  <Field label="Full name" name="name" />
                  <Field label="Email address" name="email" type="email" />
                </div>
                <Choice
                  label="Account role"
                  name="role"
                  defaultValue="member"
                  items={[
                    {
                      value: "member",
                      label: "Member — own dues and directory",
                    },
                    {
                      value: "finance",
                      label:
                        "Finance administrator — assign charges and record payments",
                    },
                    {
                      value: "admin",
                      label:
                        "Full administrator — members, finance, and public content",
                    },
                  ]}
                />
                <Choice
                  label="Flotilla"
                  name="flotilla"
                  defaultValue="Unassigned"
                  items={[
                    "Unassigned",
                    "Gulf",
                    "NLF",
                    "Kattegat",
                    "Debullz",
                    "Atlantic",
                    "Pacific",
                  ].map((x) => ({ value: x, label: x }))}
                />
                <Field
                  label="Temporary password (at least 14 characters)"
                  name="password"
                  type="password"
                />
                <p className="form-help">
                  Share the temporary password privately. The member must change
                  it at first login. No automatic email is sent.
                </p>
              </DataForm>
              <DataForm
                title="Reset a member’s password"
                submit="Set temporary password"
                onSubmit={async (f) => save("members/reset", f)}
              >
                <Choice
                  label="Member to reset"
                  name="id"
                  items={memberOptions.filter((m) => m.value !== user.id)}
                />
                <Field
                  label="New temporary password"
                  name="password"
                  type="password"
                />
                <p className="form-help">
                  This signs the member out on every device and requires a new
                  password at next login.
                </p>
              </DataForm>
            </div>
            <div className="panel">
              <h2>Member accounts</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Flotilla</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Access</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.members.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <strong>{m.name}</strong>
                        <div className="balance-detail">{m.email}</div>
                      </TableCell>
                      <TableCell>
                        {m.role === "finance"
                          ? "Finance administrator"
                          : m.role === "admin"
                            ? "Full administrator"
                            : "Member"}
                      </TableCell>
                      <TableCell>{m.flotilla || "Unassigned"}</TableCell>
                      <TableCell>{m.active ? "Active" : "Removed"}</TableCell>
                      <TableCell>
                        <div className="row-actions">
                          {m.id === user.id ? (
                            "Your account"
                          ) : m.active ? (
                            <Confirm
                              label="Remove access"
                              title={`Remove access for ${m.name}?`}
                              description="They will be signed out and cannot log in. Financial history is retained, and you can restore access later."
                              action={() =>
                                act("members/status", { id: m.id, active: 0 })
                              }
                            />
                          ) : (
                            <button
                              onClick={() =>
                                act("members/status", { id: m.id, active: 1 })
                              }
                            >
                              Restore access
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        )}
        {full && (
          <TabsContent value="public">
            <p className="notice">
              Events and outreach stories published here are visible on the
              public website. Do not include private member or donor
              information.
            </p>
            <div className="grid-two">
              <DataForm
                title="Publish an upcoming event"
                submit="Publish event"
                onSubmit={async (f) => save("events", f)}
              >
                <Field label="Event title" name="title" />
                <Field label="Date" name="date" type="date" />
                <Field label="Location / meeting details" name="location" />
                <label className="field">
                  Description
                  <textarea name="description" required maxLength={5000} />
                </label>
              </DataForm>
              <DataForm
                title="Publish charitable outreach"
                submit="Publish outreach story"
                onSubmit={async (f) =>
                  save("outreach", {
                    ...f,
                    amount: Math.round(Number(f.amount || 0) * 100),
                  })
                }
              >
                <Field label="Initiative / donation title" name="title" />
                <Field label="Date" name="date" type="date" />
                <label className="field">
                  Donation value (USD, optional)
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    max="10000000"
                    step="0.01"
                  />
                </label>
                <label className="field">
                  Public story / charitable impact
                  <textarea name="description" required maxLength={5000} />
                </label>
              </DataForm>
            </div>
            <div className="grid-two">
              <div className="panel">
                <h2>Published events</h2>
                {data.events.length ? (
                  data.events.map((e) => (
                    <article key={e.id} className="event-card">
                      <h3>{e.title}</h3>
                      <p>
                        {dateLabel(e.date)} · {e.location}
                      </p>
                      <div className="row-actions">
                        <Confirm
                          label="Remove event"
                          title="Remove this public event?"
                          description="It will no longer appear on the public events page or member dashboard."
                          action={() => act("events/remove", { id: e.id })}
                        />
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="muted">No published events.</p>
                )}
              </div>
              <div className="panel">
                <h2>Published outreach</h2>
                {data.outreach.length ? (
                  data.outreach.map((o) => (
                    <article key={o.id} className="event-card">
                      <h3>{o.title}</h3>
                      <p>
                        {dateLabel(o.date)}
                        {o.amount > 0 ? ` · ${money(o.amount)}` : ""}
                      </p>
                      <div className="row-actions">
                        <Confirm
                          label="Remove story"
                          title="Remove this outreach story?"
                          description="It will no longer appear on the public outreach page."
                          action={() => act("outreach/remove", { id: o.id })}
                        />
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="muted">No published outreach stories.</p>
                )}
              </div>
            </div>
          </TabsContent>
        )}
        <TabsContent value="audit">
          <div className="panel">
            <h2>Recent account activity</h2>
            <p className="form-help">The latest 100 management actions.</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time (UTC)</TableHead>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.audit.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      {a.created_at.replace("T", " ").slice(0, 19)}
                    </TableCell>
                    <TableCell>{a.actor_name || "System"}</TableCell>
                    <TableCell>{a.action}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

