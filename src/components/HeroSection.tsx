import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getActiveSocialLinks,
  type SocialPlatform,
} from "@/lib/site";

const SOCIAL_ICONS: Record<SocialPlatform, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

const HeroSection = () => {
  // Previously rendered three icons hardlinked to `#instagram`, `#facebook`,
  // `#linkedin` — all dead anchors. We now pull real URLs from `site.ts`
  // and simply skip platforms that aren't configured, so the page never
  // ships icons that go nowhere.
  const socialLinks = getActiveSocialLinks();

  return (
    <section className="relative rounded-[2.5rem] overflow-hidden bg-muted my-12 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6 md:gap-12 p-6 md:p-12 lg:p-16">
        {/* Left side - Image */}
        <div className="relative aspect-[4/3] md:aspect-auto rounded-[2rem] overflow-hidden animate-scale-in">
          <img
            src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80"
            alt="Hero"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>

        {/* Right side - Content */}
        <div className="flex flex-col justify-center space-y-6 md:space-y-8">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight animate-slide-down">
              Journey Through Life's Spectrum
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl animate-slide-up stagger-1">
              Welcome to Perspective's Blog: A Realm of Reflection, Inspiration, and Discovery. Where Words Illuminate
              Paths of Meaning and Thoughts Unravel the Mysteries of Life's Spectrum.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 pt-4 animate-slide-up stagger-2">
            {/* "Join Now" used to be a bare <Button> with no handler — now it
                scrolls to the newsletter section just like the header CTA. */}
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-4 md:px-10 md:py-6 text-base font-medium transition-all hover:scale-105 w-full sm:w-auto"
            >
              <Link to="/#newsletter">Join Now</Link>
            </Button>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4" aria-label="Social media">
                {socialLinks.map(({ platform, url, label }) => {
                  const Icon = SOCIAL_ICONS[platform];
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center hover:scale-110"
                      aria-label={`Perspective on ${label}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
