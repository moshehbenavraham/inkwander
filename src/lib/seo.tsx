import { useEffect } from "react";

/**
 * Canonical base URL for the production deployment.
 * Override at build time or change here when the site ships under a new domain.
 */
export const SITE_URL = "https://perspective.blog";
export const SITE_NAME = "Perspective";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/social-card.svg`;
export const TWITTER_HANDLE = "@perspectiveblog";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

export interface SeoOptions {
  /** Browser tab + <title>. Will be suffixed with the site name unless `titleTemplate` is overridden. */
  title: string;
  /** Meta description (and OG/Twitter description). Aim for 50-160 characters. */
  description: string;
  /** Path relative to SITE_URL (e.g. "/about"). Defaults to the current pathname at runtime. */
  path?: string;
  /** Absolute URL for OG/Twitter card image. Defaults to the site's social card SVG. */
  image?: string;
  /** "website" for landing/category pages, "article" for blog posts. */
  ogType?: "website" | "article";
  /** Skip the " | Perspective" suffix when true (use for pages where the title already includes the brand). */
  noTitleSuffix?: boolean;
  /** Discourage indexing for utility pages (StyleGuide, 404, etc.). */
  noindex?: boolean;
  /** Optional JSON-LD payload. Pass a single object or an array of objects. */
  jsonLd?: JsonLd;
}

/**
 * Set or replace a `<meta>` element by name or property.
 * Returns a cleanup function that restores the previous value on unmount.
 */
function setMeta(
  selector: { name?: string; property?: string },
  content: string
): () => void {
  const attr = selector.name ? "name" : "property";
  const key = selector.name ?? selector.property!;
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  const created = !el;
  const previous = el?.getAttribute("content") ?? null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return () => {
    if (created) {
      el?.remove();
    } else if (previous !== null) {
      el?.setAttribute("content", previous);
    }
  };
}

function setLink(rel: string, href: string): () => void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  const created = !el;
  const previous = el?.getAttribute("href") ?? null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return () => {
    if (created) {
      el?.remove();
    } else if (previous !== null) {
      el?.setAttribute("href", previous);
    }
  };
}

/**
 * useSEO — declaratively set <title>, meta description, canonical, OG/Twitter tags,
 * and JSON-LD structured data for the current route.
 *
 * Restores prior values on unmount so navigation between pages doesn't leak metadata.
 * Dependency-free (no react-helmet); works with React Router by running on every prop change.
 */
export function useSEO({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  ogType = "website",
  noTitleSuffix = false,
  noindex = false,
  jsonLd,
}: SeoOptions): void {
  // Serialize structured data so the effect's deps are stable primitives,
  // even when callers pass a fresh object literal on every render.
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    // <title>
    const fullTitle = noTitleSuffix ? title : `${title} | ${SITE_NAME}`;
    const previousTitle = document.title;
    document.title = fullTitle;
    cleanups.push(() => {
      document.title = previousTitle;
    });

    // Canonical URL
    const resolvedPath =
      path ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    const canonical = `${SITE_URL}${resolvedPath}`;
    cleanups.push(setLink("canonical", canonical));

    // Core meta tags
    cleanups.push(setMeta({ name: "description" }, description));
    cleanups.push(
      setMeta(
        { name: "robots" },
        noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
      )
    );

    // Open Graph
    cleanups.push(setMeta({ property: "og:title" }, fullTitle));
    cleanups.push(setMeta({ property: "og:description" }, description));
    cleanups.push(setMeta({ property: "og:type" }, ogType));
    cleanups.push(setMeta({ property: "og:url" }, canonical));
    cleanups.push(setMeta({ property: "og:image" }, image));
    cleanups.push(setMeta({ property: "og:site_name" }, SITE_NAME));

    // Twitter Card
    cleanups.push(setMeta({ name: "twitter:card" }, "summary_large_image"));
    cleanups.push(setMeta({ name: "twitter:title" }, fullTitle));
    cleanups.push(setMeta({ name: "twitter:description" }, description));
    cleanups.push(setMeta({ name: "twitter:image" }, image));
    cleanups.push(setMeta({ name: "twitter:site" }, TWITTER_HANDLE));

    // JSON-LD structured data (one script per useSEO call)
    let jsonLdEl: HTMLScriptElement | null = null;
    if (jsonLdString) {
      jsonLdEl = document.createElement("script");
      jsonLdEl.type = "application/ld+json";
      jsonLdEl.setAttribute("data-seo", "page");
      jsonLdEl.textContent = jsonLdString;
      document.head.appendChild(jsonLdEl);
      cleanups.push(() => {
        jsonLdEl?.remove();
      });
    }

    return () => {
      // Run cleanups in reverse so we restore in LIFO order.
      for (let i = cleanups.length - 1; i >= 0; i--) {
        cleanups[i]();
      }
    };
  }, [
    title,
    description,
    path,
    image,
    ogType,
    noTitleSuffix,
    noindex,
    jsonLdString,
  ]);
}

/**
 * Helpers for building common JSON-LD blocks. Keeping these here means pages stay
 * declarative and the schema shape is defined in one place.
 */
export const jsonLd = {
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    sameAs: [],
  }),

  website: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "A space for exploring ideas, finding inspiration, and discovering new ways of seeing the world.",
  }),

  article: (input: {
    headline: string;
    description: string;
    image: string;
    path: string;
    datePublished: string;
    authorName: string;
    authorBio?: string;
    category?: string;
    keywords?: string[];
  }) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    image: [input.image],
    datePublished: input.datePublished,
    dateModified: input.datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${input.path}`,
    },
    author: {
      "@type": "Person",
      name: input.authorName,
      ...(input.authorBio ? { description: input.authorBio } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    ...(input.category ? { articleSection: input.category } : {}),
    ...(input.keywords && input.keywords.length
      ? { keywords: input.keywords.join(", ") }
      : {}),
  }),

  collectionPage: (input: {
    name: string;
    description: string;
    path: string;
    itemCount: number;
  }) => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.itemCount,
    },
  }),

  breadcrumb: (
    trail: Array<{ name: string; path: string }>
  ): Record<string, unknown> => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  }),
};

/**
 * Convert a human-readable article date like "Oct 16, 2024" into ISO 8601
 * for schema.org's `datePublished`. Falls back to the original string if it
 * can't be parsed (schema.org accepts plain strings; ISO is just preferred).
 */
export function toIsoDate(humanDate: string): string {
  const parsed = new Date(humanDate);
  if (Number.isNaN(parsed.getTime())) return humanDate;
  return parsed.toISOString().slice(0, 10);
}
