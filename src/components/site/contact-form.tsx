"use client";

import { useState } from "react";
import { href } from "@/lib/paths";
import styles from "./contact-form.module.css";

type State = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");

    const form = event.currentTarget;
    try {
      // `fetch` gets no base path automatically — only next/link, router.push
      // and /_next do. Under /risr2 a bare "/api/contact" would hit the other
      // site's app and 404.
      const res = await fetch(href("/api/contact"), {
        method: "POST",
        body: new FormData(form),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "Something went wrong.");
      form.reset();
      setState("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className={styles.done} role="status">
        <h3>Thank you</h3>
        <p>
          Your message has reached the school office. Someone will reply to the
          address you gave.
        </p>
        <button className="btn btn--navy" type="button" onClick={() => setState("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.pair}>
        <label>
          <span>Your name</span>
          <input name="name" required autoComplete="name" maxLength={120} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" maxLength={160} />
        </label>
      </div>
      <div className={styles.pair}>
        <label>
          <span>
            Telephone <em>optional</em>
          </span>
          <input name="telephone" autoComplete="tel" maxLength={40} />
        </label>
        <label>
          <span>Subject</span>
          <input name="subject" required maxLength={200} />
        </label>
      </div>
      <label>
        <span>Message</span>
        <textarea name="comment" rows={6} maxLength={4000} />
      </label>

      {/* Honeypot. Hidden from sight and from screen readers, so only a bot
          fills it in; a submission that does is accepted and discarded. */}
      <div className={styles.trap} aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button className="btn btn--accent" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
