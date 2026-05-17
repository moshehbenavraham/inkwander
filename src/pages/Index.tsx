import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import { articles } from "@/data/articles";
import { useSEO, jsonLd } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  HAS_NEWSLETTER_ENDPOINT,
  subscribeNewsletter,
} from "@/lib/forms";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Index = () => {
  const featuredArticles = articles.slice(0, 6);
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<
    { tone: "success" | "error"; message: string } | null
  >(null);

  useSEO({
    title: "Perspective — Personal Blog for Everyday Inspiration",
    description:
      "A space for exploring ideas, finding inspiration, and discovering new ways of seeing the world through lifestyle, wellness, travel, and personal growth.",
    path: "/",
    ogType: "website",
    noTitleSuffix: true,
    jsonLd: [jsonLd.organization(), jsonLd.website()],
  });

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      const message = "Please enter a valid email address.";
      toast.error(message);
      setFeedback({ tone: "error", message });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    const result = await subscribeNewsletter({
      email: trimmed,
      source: "Homepage newsletter section",
    });
    setSubmitting(false);

    if (result.ok) {
      const message =
        result.mode === "endpoint"
          ? "You're on the list! Watch your inbox for a confirmation."
          : `Opening your email client to subscribe via ${CONTACT_EMAIL}.`;
      toast.success(message);
      setFeedback({ tone: "success", message });
      setEmail("");
    } else {
      toast.error(result.error);
      setFeedback({ tone: "error", message: result.error });
    }
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />

      <main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Intro Section */}
        <IntroSection />

        {/* Featured Articles Grid */}
        <section id="articles" className="py-12 scroll-mt-24">
          <div className="flex items-center justify-between mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Articles</h2>
            {/* "View all" used to point at the same #articles anchor we're
                already inside of — it was a no-op. Send visitors to the
                Authors page where every contributor's work is browsable. */}
            <Link
              to="/authors"
              className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors px-4 py-2 rounded-full hover:bg-muted/60"
            >
              View authors →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                <ArticleCard {...article} size="small" />
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section
          id="newsletter"
          className="my-20 rounded-[2.5rem] bg-card p-12 md:p-16 text-center animate-scale-in scroll-mt-24"
        >
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Stay inspired.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Subscribe to receive our latest articles and insights directly in your inbox.
            </p>
            <form
              onSubmit={handleSubscribe}
              noValidate
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              aria-label="Newsletter signup"
              aria-describedby="newsletter-status"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                required
                disabled={submitting}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (feedback) setFeedback(null);
                }}
                placeholder="Your email"
                className="flex-1 px-6 py-4 rounded-full border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-10 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
            <p
              id="newsletter-status"
              role={feedback?.tone === "error" ? "alert" : "status"}
              aria-live={feedback?.tone === "error" ? "assertive" : "polite"}
              className={
                feedback
                  ? feedback.tone === "error"
                    ? "text-sm text-destructive max-w-md mx-auto"
                    : "text-sm text-muted-foreground max-w-md mx-auto"
                  : "sr-only"
              }
            >
              {feedback?.message ?? ""}
            </p>
            {!HAS_NEWSLETTER_ENDPOINT && !feedback && (
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No newsletter backend connected — submitting opens your email client
                with a prefilled message to {CONTACT_EMAIL}.
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/wellness" className="hover:text-accent transition-colors">Wellness</Link></li>
                <li><Link to="/travel" className="hover:text-accent transition-colors">Travel</Link></li>
                <li><Link to="/creativity" className="hover:text-accent transition-colors">Creativity</Link></li>
                <li><Link to="/growth" className="hover:text-accent transition-colors">Growth</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-accent transition-colors">Our Story</Link></li>
                <li><Link to="/authors" className="hover:text-accent transition-colors">Authors</Link></li>
                <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/style-guide" className="hover:text-accent transition-colors">Style Guide</Link></li>
                <li><Link to="/#newsletter" className="hover:text-accent transition-colors">Newsletter</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {currentYear} Perspective. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
