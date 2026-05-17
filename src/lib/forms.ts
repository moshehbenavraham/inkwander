/**
 * Centralized form submission helpers.
 *
 * Newsletter and contact forms POST to a configured endpoint when
 * `VITE_NEWSLETTER_ENDPOINT` / `VITE_CONTACT_FORM_ENDPOINT` are set at build time.
 * When unset, they fall back to opening a prefilled `mailto:` draft so visitor
 * messages never get silently dropped (the old `setTimeout` shim pretended to
 * succeed and lost every submission).
 *
 * Override the destination address via `VITE_CONTACT_EMAIL` (defaults to
 * `hello@perspective.blog`, the address already published in the site UI).
 */

const NEWSLETTER_ENDPOINT = import.meta.env.VITE_NEWSLETTER_ENDPOINT;
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_FORM_ENDPOINT;

export const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL ?? "hello@perspective.blog";

export const HAS_NEWSLETTER_ENDPOINT = Boolean(NEWSLETTER_ENDPOINT);
export const HAS_CONTACT_ENDPOINT = Boolean(CONTACT_ENDPOINT);

export type SubmitResult =
  | { ok: true; mode: "endpoint" | "mailto" }
  | { ok: false; error: string };

interface SubscribeInput {
  email: string;
  /** Optional source label baked into the mailto body (e.g. an article title). */
  source?: string;
}

export async function subscribeNewsletter({
  email,
  source,
}: SubscribeInput): Promise<SubmitResult> {
  if (NEWSLETTER_ENDPOINT) {
    try {
      const response = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, source }),
      });
      if (!response.ok) {
        return {
          ok: false,
          error: `Subscription failed (HTTP ${response.status}). Please try again in a moment.`,
        };
      }
      return { ok: true, mode: "endpoint" };
    } catch {
      return {
        ok: false,
        error:
          "Couldn't reach the subscription service. Please check your connection and try again.",
      };
    }
  }

  // Mailto fallback — opens the user's default mail client with a prefilled draft
  // so the request actually reaches a human instead of being silently dropped.
  const subject = encodeURIComponent("Subscribe me to Perspective");
  const lines = [
    "Hi Perspective team,",
    "",
    `Please add ${email} to your newsletter list.`,
  ];
  if (source) {
    lines.push("", `Sent from: ${source}`);
  }
  lines.push("", "Thanks!");
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  return { ok: true, mode: "mailto" };
}

interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(
  input: ContactInput
): Promise<SubmitResult> {
  if (CONTACT_ENDPOINT) {
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        return {
          ok: false,
          error: `Couldn't send your message (HTTP ${response.status}). Please email us directly at ${CONTACT_EMAIL}.`,
        };
      }
      return { ok: true, mode: "endpoint" };
    } catch {
      return {
        ok: false,
        error:
          "Couldn't reach our message service. Please check your connection and try again.",
      };
    }
  }

  const subjectLine = input.subject.trim() || `Message from ${input.name}`;
  const subject = encodeURIComponent(subjectLine);
  const body = encodeURIComponent(
    [
      `From: ${input.name} <${input.email}>`,
      "",
      input.message,
      "",
      "— Sent from perspective.blog/contact",
    ].join("\n")
  );
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  return { ok: true, mode: "mailto" };
}
