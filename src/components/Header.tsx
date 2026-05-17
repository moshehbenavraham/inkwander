import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Initialize from the `.dark` class the inline bootstrap script in index.html
  // already applied. Defaulting to `false` caused the Moon icon to flash for one
  // frame on first render before the useEffect ran — sync at construction time
  // so the toggle icon and `aria-pressed` value agree with the actual theme
  // immediately on first paint.
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  const closeMobileMenu = () => setIsMenuOpen(false);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      {/* Skip link for keyboard / screen reader users. Visually hidden until focused. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-primary focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 py-2 sm:py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 pill-nav px-4 sm:px-6">
            {/* Logo */}
            <div className="flex items-center min-w-0">
              <Link
                to="/"
                className="flex items-center gap-1.5 sm:gap-2"
                aria-label="Perspective — home"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-base sm:text-lg">P</span>
                </div>
                <span className="text-base sm:text-xl font-bold font-serif truncate">Perspective</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2" aria-label="Primary">
              <Link
                to="/"
                className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all"
              >
                Home
              </Link>
              <Link
                to="/#articles"
                className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all"
              >
                Articles
              </Link>
              <Link
                to="/wellness"
                className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all"
              >
                Wellness
              </Link>
              <Link
                to="/travel"
                className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all"
              >
                Travel
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all"
              >
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full hover:bg-muted/60 transition-all"
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                aria-pressed={isDark}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>

              {/* "Join Now" used to be an inert <Button> with no onClick or href —
                  visitors got nothing when they clicked it. Wire it to the
                  newsletter section so the call-to-action actually does
                  something (ScrollManager handles the smooth-scroll). */}
              <Button
                asChild
                className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-2 hover:scale-105 transition-all"
              >
                <Link to="/#newsletter">Join Now</Link>
              </Button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-1.5 sm:p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <nav className="flex flex-col gap-4" aria-label="Mobile">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="text-sm font-medium hover:text-accent transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/#articles"
                  onClick={closeMobileMenu}
                  className="text-sm font-medium hover:text-accent transition-colors"
                >
                  Articles
                </Link>
                <Link
                  to="/wellness"
                  onClick={closeMobileMenu}
                  className="text-sm font-medium hover:text-accent transition-colors"
                >
                  Wellness
                </Link>
                <Link
                  to="/travel"
                  onClick={closeMobileMenu}
                  className="text-sm font-medium hover:text-accent transition-colors"
                >
                  Travel
                </Link>
                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className="text-sm font-medium hover:text-accent transition-colors"
                >
                  About
                </Link>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-full"
                >
                  <Link to="/#newsletter" onClick={closeMobileMenu}>
                    Join Now
                  </Link>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
