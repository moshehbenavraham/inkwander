import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import { getArticleById, getRelatedArticles } from "@/data/articles";
import { Facebook, Twitter, Linkedin, Link2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSEO, jsonLd, toIsoDate } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  HAS_NEWSLETTER_ENDPOINT,
  subscribeNewsletter,
} from "@/lib/forms";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const article = id ? getArticleById(id) : undefined;
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<
    { tone: "success" | "error"; message: string } | null
  >(null);

  // Always call useSEO before any conditional return — Rules of Hooks.
  useSEO({
    title: article?.title ?? "Article not found",
    description:
      article?.subtitle ??
      "The article you're looking for couldn't be found. Browse our latest essays on Perspective.",
    path: article ? `/article/${article.id}` : "/404",
    image: article?.image,
    ogType: article ? "article" : "website",
    noindex: !article,
    jsonLd: article
      ? [
          jsonLd.article({
            headline: article.title,
            description: article.subtitle,
            image: article.image,
            path: `/article/${article.id}`,
            datePublished: toIsoDate(article.date),
            authorName: article.author.name,
            authorBio: article.author.bio,
            category: article.category,
            keywords: article.tags,
          }),
          jsonLd.breadcrumb([
            { name: "Home", path: "/" },
            { name: article.category, path: `/${article.category.toLowerCase()}` },
            { name: article.title, path: `/article/${article.id}` },
          ]),
        ]
      : undefined,
  });

  if (!article) {
    return <Navigate to="/404" replace />;
  }

  const relatedArticles = getRelatedArticles(article.id);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

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
      source: `Article: ${article.title}`,
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

  const getCategoryClass = (cat: string) => {
    const normalized = cat.toLowerCase();
    if (normalized.includes("financ")) return "tag-financing";
    if (normalized.includes("lifestyle")) return "tag-lifestyle";
    if (normalized.includes("community")) return "tag-community";
    if (normalized.includes("wellness")) return "tag-wellness";
    if (normalized.includes("travel")) return "tag-travel";
    if (normalized.includes("creativ")) return "tag-creativity";
    if (normalized.includes("growth")) return "tag-growth";
    return "tag-lifestyle";
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />

      <main id="main">
        {/* Back Navigation */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/#articles"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to articles
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] mb-12">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          {/* Article Header */}
          <div className="mb-12 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryClass(article.category)}`}>
                {article.category}
              </span>
              <span className="text-sm text-muted-foreground">{article.date}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{article.readTime} read</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              {article.subtitle}
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between border-t border-b border-border py-6">
              <div className="flex items-center gap-4">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-14 h-14 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold">{article.author.name}</p>
                  <p className="text-sm text-muted-foreground">{article.author.bio}</p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                  aria-label="Copy link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-16 animate-slide-up stagger-2">
            <p className="text-lg leading-relaxed text-muted-foreground mb-8">
              {article.content.introduction}
            </p>

            {article.content.sections.map((section, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {section.content}
                </p>
              </div>
            ))}

            <div className="mt-12 p-6 rounded-2xl bg-muted border-l-4 border-accent">
              <p className="text-lg leading-relaxed italic text-foreground">
                {article.content.conclusion}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-12 pb-12 border-b border-border">
            <div className="flex flex-wrap gap-3">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full text-sm bg-muted text-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Mobile Share Buttons */}
          <div className="md:hidden mb-12 pb-12 border-b border-border">
            <p className="text-sm font-semibold mb-4">Share this article</p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-3 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                <span className="text-sm">Copy link</span>
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="mb-16 rounded-2xl bg-card p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Enjoyed this article?</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to receive more insights like this directly in your inbox.
            </p>
            <form
              onSubmit={handleSubscribe}
              noValidate
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              aria-label="Newsletter signup"
              aria-describedby="article-newsletter-status"
            >
              <label htmlFor="article-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="article-newsletter-email"
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
                className="flex-1 px-4 py-3 rounded-full border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
              />
              <Button
                type="submit"
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>
            <p
              id="article-newsletter-status"
              role={feedback?.tone === "error" ? "alert" : "status"}
              aria-live={feedback?.tone === "error" ? "assertive" : "polite"}
              className={
                feedback
                  ? feedback.tone === "error"
                    ? "text-sm text-destructive max-w-md mx-auto mt-4"
                    : "text-sm text-muted-foreground max-w-md mx-auto mt-4"
                  : "sr-only"
              }
            >
              {feedback?.message ?? ""}
            </p>
            {!HAS_NEWSLETTER_ENDPOINT && !feedback && (
              <p className="text-xs text-muted-foreground max-w-md mx-auto mt-3">
                No newsletter backend connected — submitting opens your email client.
              </p>
            )}
          </div>
        </article>

        {/* Related Articles */}
        <section className="bg-muted py-16 animate-fade-in" aria-label="Related articles">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 animate-slide-up">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle, index) => (
                <div key={relatedArticle.id} className={`animate-slide-up stagger-${Math.min(index + 1, 3)}`}>
                  <ArticleCard {...relatedArticle} size="small" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Article;
