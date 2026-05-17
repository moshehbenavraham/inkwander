/**
 * Site-wide constants — the single source of truth for off-site links and
 * contact info. Components import from here and render conditionally so we
 * never ship dead "/" or "/#facebook" anchors masquerading as social links,
 * and never publish a placeholder phone number to visitors.
 *
 * Everything that defaults to `null` is deliberately opt-in: the homepage,
 * footer, hero, and Contact card all hide the corresponding row/icon when
 * its value is null. Wire real values via env vars (see .env.example) and
 * the UI lights up automatically.
 */

export const SITE_URL =
  import.meta.env.VITE_SITE_URL ?? "https://perspective.blog";

export const SITE_NAME = "Perspective";

export type SocialPlatform =
  | "twitter"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "youtube";

/**
 * Public social profile URLs. All `null` by default — Perspective is a
 * generic editorial template and shipping Twitter/Facebook/etc. icons that
 * link to brand homepages (or worse, to `#instagram` fragments that go
 * nowhere) actively harms visitors. When a real profile exists, set the
 * matching env var or hardcode the URL here.
 */
export const SOCIAL_LINKS: Record<SocialPlatform, string | null> = {
  twitter: import.meta.env.VITE_SOCIAL_TWITTER ?? null,
  instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM ?? null,
  facebook: import.meta.env.VITE_SOCIAL_FACEBOOK ?? null,
  linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN ?? null,
  youtube: import.meta.env.VITE_SOCIAL_YOUTUBE ?? null,
};

export interface ActiveSocialLink {
  platform: SocialPlatform;
  url: string;
  label: string;
}

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  twitter: "Twitter",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

/**
 * Returns only the social links that have a real URL configured. Components
 * use this so they don't render an icon row that's secretly empty (or full
 * of dead anchors).
 */
export function getActiveSocialLinks(): ActiveSocialLink[] {
  return (Object.keys(SOCIAL_LINKS) as SocialPlatform[])
    .filter((platform) => Boolean(SOCIAL_LINKS[platform]))
    .map((platform) => ({
      platform,
      url: SOCIAL_LINKS[platform] as string,
      label: PLATFORM_LABELS[platform],
    }));
}

export const HAS_SOCIAL_LINKS = getActiveSocialLinks().length > 0;

/**
 * Optional phone number for the Contact page. Previously hardcoded to a
 * "+1 (555) 123-4567" placeholder, which is a textbook anti-pattern:
 * visitors see a real-looking number, try it, and get nowhere. When the
 * env var is unset, the phone row is omitted entirely.
 */
export const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE ?? null;

/**
 * Optional human-readable location. Defaults to `null` so we don't publish
 * a city the operator may not actually be in.
 */
export const CONTACT_LOCATION = import.meta.env.VITE_CONTACT_LOCATION ?? null;

/**
 * Optional support hours displayed next to the phone number.
 */
export const CONTACT_HOURS = import.meta.env.VITE_CONTACT_HOURS ?? null;
