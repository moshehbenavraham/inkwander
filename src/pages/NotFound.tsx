import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import { useSEO } from "@/lib/seo";

const NotFound = () => {
  const location = useLocation();

  useSEO({
    title: "Page Not Found",
    description:
      "The page you're looking for doesn't exist. Browse our latest articles on Perspective.",
    path: "/404",
    noindex: true,
  });

  useEffect(() => {
    // Use console.warn rather than console.error — a missing route is a
    // routing miss, not an application error. console.error in dev tooling
    // (and some error trackers) gets treated as a failure signal.
    console.warn("404: no route matched", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />

      <main
        id="main"
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
      >
        <p className="text-sm font-semibold tracking-widest uppercase text-accent mb-4 animate-slide-down">
          404 — Page not found
        </p>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-down">
          We couldn't find that page.
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed animate-slide-up stagger-1">
          The article or page you're looking for may have moved, been retitled,
          or never existed. Try one of the paths below — or head back to the
          homepage to keep exploring.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up stagger-2">
          <Link
            to="/"
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Return home
          </Link>
          <Link
            to="/#articles"
            className="px-8 py-3 rounded-full border border-border hover:bg-muted/60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Browse articles
          </Link>
        </div>

        <nav
          aria-label="Browse categories"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto animate-slide-up stagger-3"
        >
          <Link
            to="/wellness"
            className="px-4 py-3 rounded-full bg-card hover:bg-muted/60 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Wellness
          </Link>
          <Link
            to="/travel"
            className="px-4 py-3 rounded-full bg-card hover:bg-muted/60 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Travel
          </Link>
          <Link
            to="/creativity"
            className="px-4 py-3 rounded-full bg-card hover:bg-muted/60 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Creativity
          </Link>
          <Link
            to="/growth"
            className="px-4 py-3 rounded-full bg-card hover:bg-muted/60 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Growth
          </Link>
        </nav>
      </main>
    </div>
  );
};

export default NotFound;
