import { useEffect } from "react";

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  keywords?: string;
  structuredData?: Record<string, unknown> | null;
}

const DEFAULT_TITLE = "Meet Your Maker (MYM) — Multidisciplinary Creative Studio & Portfolio";
const DEFAULT_DESCRIPTION =
  "Meet Your Maker (MYM) is a multidisciplinary creative studio specializing in content creation, brand identity & graphic design, cinematic video editing, and modern software development.";
const BASE_URL =
  typeof window !== "undefined" && window.location.origin && !window.location.origin.includes("localhost")
    ? window.location.origin
    : "https://mym-portfolio-gamma.vercel.app";
const DEFAULT_OG_IMAGE = `${BASE_URL}/logos/portfolio/official-logo-1.svg`;

function setMetaTag(selector: string, attributeName: string, attributeValue: string, content: string) {
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = "",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  keywords,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title
      ? `${title} | Meet Your Maker (MYM)`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // 2. Update Primary Meta Tags
    setMetaTag('meta[name="description"]', "name", "description", description);
    setMetaTag('meta[name="title"]', "name", "title", formattedTitle);
    if (keywords) {
      setMetaTag('meta[name="keywords"]', "name", "keywords", keywords);
    }

    // 3. Update Canonical Link
    const cleanPath = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
    const fullCanonicalUrl = `${BASE_URL}${cleanPath === "/" ? "" : cleanPath}`;
    setLinkTag("canonical", fullCanonicalUrl);

    // 4. Update Open Graph Meta Tags
    setMetaTag('meta[property="og:title"]', "property", "og:title", formattedTitle);
    setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    setMetaTag('meta[property="og:url"]', "property", "og:url", fullCanonicalUrl);
    setMetaTag('meta[property="og:type"]', "property", "og:type", ogType);
    setMetaTag('meta[property="og:image"]', "property", "og:image", ogImage);

    // 5. Update Twitter Card Meta Tags
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", formattedTitle);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", ogImage);
    setMetaTag('meta[name="twitter:url"]', "name", "twitter:url", fullCanonicalUrl);

    // 6. Handle Dynamic Route JSON-LD Structured Data
    const scriptId = "dynamic-route-jsonld";
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (structuredData) {
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.id = scriptId;
        scriptElement.type = "application/ld+json";
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    return () => {
      // Cleanup dynamic JSON-LD on unmount
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.remove();
      }
    };
  }, [title, description, canonicalPath, ogImage, ogType, keywords, structuredData]);

  return null;
}
