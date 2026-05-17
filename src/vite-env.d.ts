/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Newsletter subscribe endpoint. POST { email, source? } as JSON. */
  readonly VITE_NEWSLETTER_ENDPOINT?: string;
  /** Contact form submission endpoint. POST { name, email, subject, message }. */
  readonly VITE_CONTACT_FORM_ENDPOINT?: string;
  /** Destination address for mailto: fallbacks and the Contact card. */
  readonly VITE_CONTACT_EMAIL?: string;

  /** Canonical production URL. Defaults to https://perspective.blog. */
  readonly VITE_SITE_URL?: string;

  /** Optional social profile URLs. Each row is rendered only when set. */
  readonly VITE_SOCIAL_TWITTER?: string;
  readonly VITE_SOCIAL_INSTAGRAM?: string;
  readonly VITE_SOCIAL_FACEBOOK?: string;
  readonly VITE_SOCIAL_LINKEDIN?: string;
  readonly VITE_SOCIAL_YOUTUBE?: string;

  /** Optional human-readable contact info shown on /contact. Unset = hidden. */
  readonly VITE_CONTACT_PHONE?: string;
  readonly VITE_CONTACT_LOCATION?: string;
  readonly VITE_CONTACT_HOURS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
