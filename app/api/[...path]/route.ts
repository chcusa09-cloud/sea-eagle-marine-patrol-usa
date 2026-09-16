import {
  currentUser,
  database,
  passwordHash,
  verify,
  startSession,
  digest,
  same,
  now,
  uid,
  safeMember,
  auditStatement,
  HttpError,
  need,
  textValue,
  validDate,
  validEmail,
  validPassword,
  rateLimit,
  setupKey,
  chargeQuery,
  type Member,
} from "@/lib/server";
export const dynamic = "force-dynamic";
function json(data: unknown, status = 200, cookie?: string) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(cookie ? { "Set-Cookie": cookie } : {}),
    },
  });
}
async function handler(req: Request) {
  try {
    const path = new URL(req.url).pathname.replace(/^\/api\//, "");
    const db = database();
    if (req.method === "GET" && path === "public") {
      const [events, outreach] = await Promise.all([
        db.prepare("SELECT * FROM events ORDER BY date ASC").all(),
        db.prepare("SELECT * FROM outreach ORDER BY date DESC").all(),
      ]);
      return json({ events: events.results, outreach: outreach.results });
    }
    let body: Record<string, unknown> = {};
    if (req.method === "POST") {
      const origin = req.headers.get("origin");
      need(
        origin === new URL(req.url).origin,
        "Please submit this form from the Sea Eagle website.",
        403,
      );
      need(
        req.headers.get("content-type")?.includes("application/json"),
        "JSON is required.",
        415,
      );
      const raw = await req.text();
      need(raw.length <= 20000, "Request is too large.", 413);
      try {
        body = JSON.parse(raw);
      } catch {
        throw new HttpError(400, "Invalid request.");
      }
      need(
        body && typeof body === "object" && !Array.isArray(body),
        "Invalid request.",
      );
    }
    if (req.method === "POST" && path === "login") {
      const email = validEmail(body.email);
      await rateLimit(req, email);
      const password =
        typeof body.password === "string" && body.password.length <= 128
          ? body.password
          : "";
      const user = await db
        .prepare("SELECT * FROM members WHERE email=? AND active=1")
        .bind(email)
        .first<Member>();
      const dummy =
        "pbkdf2$100000$00000000000000000000000000000000$" + "0".repeat(64);
      const matched = await verify(password, user?.password || dummy);
      need(user && matched, "Email or password is incorrect.", 401);
      return json(
        { user: safeMember(user) },
        200,
        await startSession(user.id, req),
      );
    }
    if (req.method === "POST" && path === "setup") {
      await rateLimit(req, "setup");
      const key = setupKey();
      need(
        key &&
          typeof body.key === "string" &&
          same(await digest(body.key), await digest(key)),
        "Setup access is invalid.",
        403,
      );
      need(
        !(await db
          .prepare("SELECT value FROM settings WHERE key='initialized'")
          .first()),
        "Administrator setup has already been completed.",
        409,
      );
      const email = validEmail(body.email),
        name = textValue(body.name, "Name", 100),
        password = await passwordHash(validPassword(body.password)),
        id = uid();
      await db.batch([
        db.prepare("INSERT INTO settings(key,value) VALUES('initialized','1')"),
        db
          .prepare(
            "INSERT INTO members(id,email,name,password,role,flotilla,active,must_change,created_at) VALUES(?,?,?,?,'admin','',1,0,?)",
          )
          .bind(id, email, name, password, now()),
        auditStatement(id, "Initial administrator created", id),
      ]);
      return json(
        { message: "Administrator created. You can now sign in." },
        201,
      );
    }
    const user = await currentUser(req);
    need(user, "Please sign in.", 401);
    if (req.method === "POST" && path === "logout") {
      const token = req.headers
        .get("cookie")
        ?.match(/(?:^|;\s*)semp_session=([a-f0-9]{64})(?:;|$)/)?.[1];
      if (token)
        await db
          .prepare("DELETE FROM sessions WHERE token=?")
          .bind(await digest(token))
          .run();
      return json(
        { ok: true },
        200,
        "semp_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure",
      );
    }
    if (req.method === "GET" && path === "me")
      return json({ user: safeMember(user) });
    if (req.method === "POST" && path === "password") {
      need(
        await verify(
          typeof body.current === "string" ? body.current : "",
          user.password,
        ),
        "Current password is incorrect.",
        403,
      );
      const password = validPassword(body.password);
      need(
        !(await verify(password, user.password)),
        "Choose a different password.",
      );
      await db.batch([
        db
          .prepare("UPDATE members SET password=?,must_change=0 WHERE id=?")
          .bind(await passwordHash(password), user.id),
        db.prepare("DELETE FROM sessions WHERE member_id=?").bind(user.id),
        auditStatement(user.id, "Password changed", user.id),
      ]);
      return json({ ok: true }, 200, await startSession(user.id, req));
    }
    need(
      !user.must_change,
      "Change your temporary password before continuing.",
      403,
    );
    if (req.method === "GET" && path === "dashboard") {
      const [charges, payments, events, directory] = await Promise.all([
        db
          .prepare(
            chargeQuery +
              " WHERE c.member_id=? AND c.voided=0 ORDER BY c.due_date",
          )
          .bind(user.id)
          .all(),
        db
          .prepare(
            "SELECT p.*,c.label FROM payments p JOIN charges c ON c.id=p.charge_id WHERE c.member_id=? ORDER BY p.paid_date DESC",
          )
          .bind(user.id)
          .all(),
        db
          .prepare("SELECT * FROM events WHERE date>=? ORDER BY date")
          .bind(now().slice(0, 10))
          .all(),
        db
          .prepare(
            "SELECT id,name,flotilla FROM members WHERE active=1 ORDER BY name",
          )
          .all(),
      ]);
      return json({
        charges: charges.results,
        payments: payments.results,
        events: events.results,
        directory: directory.results,
      });
    }
    const finance = user.role === "admin" || user.role === "finance";
    need(finance, "You do not have permission to manage this area.", 403);
    if (req.method === "GET" && path === "manage") {
      const [members, charges, payments, events, outreach, audit] =
        await Promise.all([
          db
            .prepare(
              "SELECT id,name,email,role,flotilla,active,must_change FROM members ORDER BY active DESC,name",
            )
            .all(),
          db
            .prepare(chargeQuery + " WHERE c.voided=0 ORDER BY c.due_date")
            .all(),
          db
            .prepare(
              "SELECT p.*,c.label,m.name AS member_name FROM payments p JOIN charges c ON c.id=p.charge_id JOIN members m ON m.id=c.member_id ORDER BY p.created_at DESC",
            )
            .all(),
          db.prepare("SELECT * FROM events ORDER BY date").all(),
          db.prepare("SELECT * FROM outreach ORDER BY date DESC").all(),
          db
            .prepare(
              "SELECT a.*,m.name AS actor_name FROM audit a LEFT JOIN members m ON m.id=a.actor ORDER BY a.created_at DESC LIMIT 100",
            )
            .all(),
        ]);
      return json({
        members: members.results,
        charges: charges.results,
        payments: payments.results,
        events: events.results,
        outreach: outreach.results,
        audit: audit.results,
      });
    }
    need(req.method === "POST", "Not found.", 404);
    if (path === "charges") {
      const memberId = textValue(body.memberId, "Member"),
        kind = textValue(body.kind, "Fee type");
      need(
        ["monthly", "converge", "retreat", "other"].includes(kind),
        "Choose a fee type.",
      );
      need(
        await db
          .prepare("SELECT id FROM members WHERE id=? AND active=1")
          .bind(memberId)
          .first(),
        "Select an active member.",
      );
      const due = validDate(body.dueDate),
        period = textValue(body.period, "Billing period", 40);
      if (kind === "monthly")
        need(
          /^\d{4}-(0[1-9]|1[0-2])$/.test(period),
          "Use YYYY-MM for monthly dues.",
        );
      const fixed: { [key: string]: number } = {
        monthly: 2000,
        converge: 25000,
        retreat: 10000,
      };
      const amount = fixed[kind] ?? Number(body.amount);
      need(
        Number.isSafeInteger(amount) && amount > 0 && amount <= 10000000,
        "Enter a valid amount.",
      );
      const label =
        kind === "other"
          ? textValue(body.label, "Description", 120)
          : {
              monthly: "Monthly membership dues",
              converge: "Converge fee",
              retreat: "Leadership retreat fee",
            }[kind]!;
      const id = uid();
      try {
        await db.batch([
          db
            .prepare(
              "INSERT INTO charges(id,member_id,label,kind,period,amount,due_date,created_at,created_by) VALUES(?,?,?,?,?,?,?,?,?)",
            )
            .bind(
              id,
              memberId,
              label,
              kind,
              period,
              amount,
              due,
              now(),
              user.id,
            ),
          auditStatement(
            user.id,
            `Charge assigned: ${label}; ${amount} cents; ${period}`,
            memberId,
          ),
        ]);
      } catch (e) {
        if (String(e).includes("UNIQUE"))
          throw new HttpError(
            409,
            "This member already has that fee for the selected billing period.",
          );
        throw e;
      }
      return json({ id }, 201);
    }
    if (path === "payments") {
      const chargeId = textValue(body.chargeId, "Charge"),
        amount = Number(body.amount),
        reference = textValue(body.reference, "Payment reference", 160),
        paidDate = validDate(body.paidDate),
        id = textValue(body.requestId, "Request ID", 80);
      need(
        Number.isSafeInteger(amount) && amount > 0,
        "Enter a positive payment amount.",
      );
      need(
        paidDate <= now().slice(0, 10),
        "Payment date cannot be in the future.",
      );
      const prior = await db
        .prepare(
          "SELECT id,charge_id,amount,reference,paid_date FROM payments WHERE id=?",
        )
        .bind(id)
        .first<{
          id: string;
          charge_id: string;
          amount: number;
          reference: string;
          paid_date: string;
        }>();
      if (prior) {
        need(
          prior.charge_id === chargeId &&
            prior.amount === amount &&
            prior.reference === reference &&
            prior.paid_date === paidDate,
          "Payment reference conflict.",
          409,
        );
        return json({ id: prior.id });
      }
      const result = await db.batch([
        db
          .prepare(
            "INSERT INTO payments(id,charge_id,amount,reference,paid_date,created_at,created_by) SELECT ?,id,?,?,?,?,? FROM charges WHERE id=? AND voided=0 AND amount-COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.charge_id=charges.id),0)>=?",
          )
          .bind(
            id,
            amount,
            reference,
            paidDate,
            now(),
            user.id,
            chargeId,
            amount,
          ),
        db
          .prepare(
            "INSERT INTO audit(id,actor,action,target,created_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM payments WHERE id=?)",
          )
          .bind(
            uid(),
            user.id,
            `Payment recorded: ${amount} cents`,
            chargeId,
            now(),
            id,
          ),
      ]);
      need(
        result[0].meta.changes === 1,
        "Payment exceeds the remaining balance, or this charge is unavailable.",
        409,
      );
      return json({ id }, 201);
    }
    if (path === "plans") {
      const chargeId = textValue(body.chargeId, "Charge"),
        count = Number(body.count),
        startDate = validDate(body.startDate);
      need([2, 3, 4, 6].includes(count), "Choose 2, 3, 4, or 6 installments.");
      need(
        startDate >=
          new Date().toLocaleDateString("en-CA", {
            timeZone: "America/New_York",
          }),
        "The first installment date must be today or later.",
      );
      const charge = await db
        .prepare(chargeQuery + " WHERE c.id=? AND c.voided=0")
        .bind(chargeId)
        .first<{
          amount: number;
          paid: number;
          paid_baseline: number | null;
        }>();
      need(
        charge && charge.amount - charge.paid >= count,
        "Choose an outstanding charge.",
      );
      need(
        charge.paid_baseline === null,
        "This charge already has a payment plan.",
        409,
      );
      const remaining = charge.amount - charge.paid,
        base = Math.floor(remaining / count),
        remainder = remaining % count,
        id = uid();
      const statements = [
        db
          .prepare(
            "INSERT INTO plans(id,charge_id,paid_baseline,created_by,created_at) SELECT ?,id,?,?,? FROM charges WHERE id=? AND voided=0 AND COALESCE((SELECT SUM(amount) FROM payments WHERE charge_id=charges.id),0)=?",
          )
          .bind(id, charge.paid, user.id, now(), chargeId, charge.paid),
      ];
      for (let i = 0; i < count; i++) {
        const date = new Date(startDate + "T12:00:00Z"),
          day = date.getUTCDate();
        date.setUTCDate(1);
        date.setUTCMonth(date.getUTCMonth() + i);
        const lastDay = new Date(
          Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
        ).getUTCDate();
        date.setUTCDate(Math.min(day, lastDay));
        statements.push(
          db
            .prepare(
              "INSERT INTO installments(id,plan_id,amount,due_date) VALUES(?,?,?,?)",
            )
            .bind(
              uid(),
              id,
              base + (i < remainder ? 1 : 0),
              date.toISOString().slice(0, 10),
            ),
        );
      }
      statements.push(
        auditStatement(
          user.id,
          `Payment plan assigned: ${count} monthly installments`,
          chargeId,
        ),
      );
      try {
        await db.batch(statements);
      } catch (e) {
        if (String(e).includes("UNIQUE"))
          throw new HttpError(409, "This charge already has a payment plan.");
        if (String(e).includes("FOREIGN KEY"))
          throw new HttpError(
            409,
            "The balance changed. Refresh and try again.",
          );
        throw e;
      }
      return json({ id }, 201);
    }
    need(
      user.role === "admin",
      "Only a full administrator can manage members or public content.",
      403,
    );
    if (path === "members") {
      const email = validEmail(body.email),
        name = textValue(body.name, "Name", 100),
        role = textValue(body.role, "Role");
      need(["member", "finance", "admin"].includes(role), "Invalid role.");
      const flotilla =
          typeof body.flotilla === "string"
            ? body.flotilla.trim().slice(0, 80)
            : "",
        password = await passwordHash(validPassword(body.password)),
        id = uid();
      try {
        await db.batch([
          db
            .prepare(
              "INSERT INTO members(id,email,name,password,role,flotilla,created_at) VALUES(?,?,?,?,?,?,?)",
            )
            .bind(id, email, name, password, role, flotilla, now()),
          auditStatement(user.id, `Member added (${role})`, id),
        ]);
      } catch (e) {
        if (String(e).includes("UNIQUE"))
          throw new HttpError(
            409,
            "An account already exists for this email. Restore it if inactive.",
          );
        throw e;
      }
      return json({ id }, 201);
    }
    if (path === "members/status") {
      const id = textValue(body.id, "Member");
      need(id !== user.id, "You cannot deactivate your own account.");
      need(body.active === 0 || body.active === 1, "Invalid account status.");
      const target = await db
        .prepare("SELECT id FROM members WHERE id=?")
        .bind(id)
        .first();
      need(target, "Member not found.", 404);
      await db.batch([
        db
          .prepare("UPDATE members SET active=? WHERE id=?")
          .bind(body.active, id),
        db.prepare("DELETE FROM sessions WHERE member_id=?").bind(id),
        auditStatement(
          user.id,
          body.active ? "Member restored" : "Member access removed",
          id,
        ),
      ]);
      return json({ ok: true });
    }
    if (path === "members/reset") {
      const id = textValue(body.id, "Member");
      need(
        id !== user.id,
        "Use your account settings to change your own password.",
      );
      need(
        await db
          .prepare("SELECT id FROM members WHERE id=? AND active=1")
          .bind(id)
          .first(),
        "Member not found.",
        404,
      );
      await db.batch([
        db
          .prepare("UPDATE members SET password=?,must_change=1 WHERE id=?")
          .bind(await passwordHash(validPassword(body.password)), id),
        db.prepare("DELETE FROM sessions WHERE member_id=?").bind(id),
        auditStatement(user.id, "Temporary password reset", id),
      ]);
      return json({ ok: true });
    }
    if (path === "charges/void") {
      const id = textValue(body.id, "Charge");
      const result = await db.batch([
        db
          .prepare(
            "UPDATE charges SET voided=1 WHERE id=? AND voided=0 AND NOT EXISTS(SELECT 1 FROM payments WHERE charge_id=?)",
          )
          .bind(id, id),
        db
          .prepare(
            "INSERT INTO audit(id,actor,action,target,created_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM charges WHERE id=? AND voided=1)",
          )
          .bind(uid(), user.id, "Unpaid charge voided", id, now(), id),
      ]);
      need(
        result[0].meta.changes === 1,
        "Only an unpaid, active charge can be voided.",
        409,
      );
      return json({ ok: true });
    }
    if (path === "events" || path === "outreach") {
      const id = uid(),
        title = textValue(body.title, "Title", 150),
        date = validDate(body.date),
        description = textValue(body.description, "Description", 5000);
      if (path === "events") {
        const location = textValue(body.location, "Location", 200);
        await db.batch([
          db
            .prepare(
              "INSERT INTO events(id,title,date,location,description,created_at) VALUES(?,?,?,?,?,?)",
            )
            .bind(id, title, date, location, description, now()),
          auditStatement(user.id, "Public event published", id),
        ]);
      } else {
        const amount = Number(body.amount || 0);
        need(
          Number.isSafeInteger(amount) && amount >= 0 && amount <= 1000000000,
          "Enter a valid donation amount.",
        );
        await db.batch([
          db
            .prepare(
              "INSERT INTO outreach(id,title,date,description,amount,created_at) VALUES(?,?,?,?,?,?)",
            )
            .bind(id, title, date, description, amount, now()),
          auditStatement(user.id, "Public outreach story published", id),
        ]);
      }
      return json({ id }, 201);
    }
    if (path === "events/remove" || path === "outreach/remove") {
      const id = textValue(body.id, "Record"),
        table = path.startsWith("events") ? "events" : "outreach";
      await db.batch([
        db.prepare(`DELETE FROM ${table} WHERE id=?`).bind(id),
        auditStatement(user.id, `Public ${table} record removed`, id),
      ]);
      return json({ ok: true });
    }
    throw new HttpError(404, "Not found.");
  } catch (error) {
    if (error instanceof HttpError)
      return json({ error: error.message }, error.status);
    console.error(
      "SEMP request failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return json(
      {
        error:
          "This service is temporarily unavailable. Your changes were not confirmed. Please try again.",
      },
      503,
    );
  }
}
export const GET = handler;
export const POST = handler;
