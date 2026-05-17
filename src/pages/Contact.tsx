import Header from "@/components/Header";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useSEO } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  HAS_CONTACT_ENDPOINT,
  sendContactMessage,
} from "@/lib/forms";
import { CONTACT_PHONE, CONTACT_LOCATION, CONTACT_HOURS } from "@/lib/site";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });

  useSEO({
    title: "Contact Us",
    description:
      "Questions, suggestions, or pitches? Get in touch with the Perspective team. We typically respond within 24 hours.",
    path: "/contact",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || !email || !subject || !message) {
      setStatus({
        kind: "error",
        message: "Please fill in every field before sending.",
      });
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setStatus({
        kind: "error",
        message: "That email address doesn't look right. Please double-check it.",
      });
      return;
    }

    setStatus({ kind: "submitting" });

    const result = await sendContactMessage({ name, email, subject, message });

    if (result.ok) {
      const successMessage =
        result.mode === "endpoint"
          ? "Message sent! We'll get back to you within 24 hours."
          : `Opening your email client to send to ${CONTACT_EMAIL}.`;
      toast.success(successMessage);
      setStatus({ kind: "success", message: successMessage });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      toast.error(result.error);
      setStatus({ kind: "error", message: result.error });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (status.kind === "error" || status.kind === "success") {
      setStatus({ kind: "idle" });
    }
  };

  const submitting = status.kind === "submitting";
  const submitLabel = submitting
    ? "Sending…"
    : HAS_CONTACT_ENDPOINT
    ? "Send Message"
    : "Send via Email";

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />

      <main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-down">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
            Have a question, suggestion, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="rounded-2xl bg-card p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6 animate-slide-up stagger-2"
              aria-describedby="contact-form-status"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  inputMode="email"
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-60"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              {/* Live region for screen readers — announces success/error inline. */}
              <p
                id="contact-form-status"
                role={status.kind === "error" ? "alert" : "status"}
                aria-live={status.kind === "error" ? "assertive" : "polite"}
                className={
                  status.kind === "error"
                    ? "text-sm text-destructive"
                    : status.kind === "success"
                    ? "text-sm text-accent-foreground"
                    : "sr-only"
                }
              >
                {status.kind === "error" || status.kind === "success"
                  ? status.message
                  : ""}
              </p>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitLabel}
              </Button>

              {!HAS_CONTACT_ENDPOINT && (
                <p className="text-xs text-muted-foreground text-center">
                  We haven't connected a backend yet — sending opens your email client
                  with a prefilled draft to{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="underline hover:text-accent transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="rounded-2xl bg-card p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="hover:text-accent transition-colors"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </p>
                    <p className="text-muted-foreground text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>

                {/*
                  Previously this card hardcoded a fake "+1 (555) 123-4567"
                  phone and a "San Francisco, CA" location regardless of
                  whether the operator actually had a phone line or that
                  address. Visitors would dial the number and hit nothing.
                  Both rows now come from env vars (CONTACT_PHONE,
                  CONTACT_LOCATION, CONTACT_HOURS) and are simply omitted
                  when unset — no placeholder data shipped to production.
                */}
                {CONTACT_LOCATION && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground">{CONTACT_LOCATION}</p>
                      <p className="text-muted-foreground text-sm">Remote-first team</p>
                    </div>
                  </div>
                )}

                {CONTACT_PHONE && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-muted-foreground">
                        <a
                          href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}
                          className="hover:text-accent transition-colors"
                        >
                          {CONTACT_PHONE}
                        </a>
                      </p>
                      {CONTACT_HOURS && (
                        <p className="text-muted-foreground text-sm">
                          {CONTACT_HOURS}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-muted p-8">
              <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">Can I contribute to Perspective?</h4>
                  <p className="text-muted-foreground">
                    Yes! We welcome guest contributions. Please use the form to submit your pitch or article idea.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">How do I advertise with you?</h4>
                  <p className="text-muted-foreground">
                    For advertising inquiries, email{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Advertising inquiry")}`}
                      className="underline hover:text-accent transition-colors"
                    >
                      {CONTACT_EMAIL}
                    </a>{" "}
                    with details about your brand.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Can I republish your content?</h4>
                  <p className="text-muted-foreground">
                    Please contact us for permissions and licensing. We're generally open to republishing with proper attribution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
