"use client";
import { useState, useEffect } from "react";
import {
  api,
  money,
  dateLabel,
  type EventItem,
  type OutreachItem,
} from "@/lib/shared";
import { HeartHandshake, CalendarDays } from "lucide-react";
export function PublicContent({ type }: { type: "events" | "outreach" }) {
  const [data, setData] = useState<{
      events: EventItem[];
      outreach: OutreachItem[];
    } | null>(null),
    [error, setError] = useState("");
  async function load() {
    setError("");
    try {
      setData(await api("public"));
    } catch {
      setError("Updates are temporarily unavailable. Please try again.");
    }
  }
  useEffect(() => {
    void load();
  }, []);
  if (error)
    return (
      <div className="notice" role="alert">
        {error}{" "}
        <button onClick={load}>
          <u>Retry</u>
        </button>
      </div>
    );
  if (!data) return <p role="status">Loading {type}…</p>;
  const events = data.events.filter(
    (e) =>
      e.date >=
      new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" }),
  );
  if (type === "events")
    return events.length ? (
      <div className="event-list">
        {events.map((e) => (
          <article className="event-card" key={e.id}>
            <time dateTime={e.date}>{dateLabel(e.date)}</time>
            <h2 style={{ marginTop: 12, fontSize: "1.65rem" }}>{e.title}</h2>
            <strong>{e.location}</strong>
            <p>{e.description}</p>
          </article>
        ))}
      </div>
    ) : (
      <div className="empty-state">
        <CalendarDays size={34} />
        <h3>More event details to come.</h3>
        <p>
          Confirmed dates, locations, and event updates will be posted here.
        </p>
      </div>
    );
  return data.outreach.length ? (
    <div className="event-list">
      {data.outreach.map((o) => (
        <article className="event-card" key={o.id}>
          <time dateTime={o.date}>{dateLabel(o.date)}</time>
          <h2 style={{ marginTop: 12, fontSize: "1.65rem" }}>{o.title}</h2>
          {o.amount > 0 && (
            <span className="status-pill">
              Charitable contribution · {money(o.amount)}
            </span>
          )}
          <p>{o.description}</p>
        </article>
      ))}
    </div>
  ) : (
    <div className="empty-state">
      <HeartHandshake size={34} />
      <h3>Our service continues.</h3>
      <p>
        More charitable initiatives, donations, and outreach stories will be shared here.
      </p>
    </div>
  );
}
