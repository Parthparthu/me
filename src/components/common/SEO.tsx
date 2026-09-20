import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'profile';
  schema?: Record<string, unknown>;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Pradyumna | CSE (AI/ML) · Software Developer · Product Builder',
  description = 'Production-grade portfolio and architectural case studies of Pradyumna, Computer Science & Engineering (AI/ML) student at GL Bajaj ITM.',
  canonical = 'https://parthparthu.github.io/',
  type = 'website',
  schema
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to set meta tags
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);
    setMeta('og:url', canonical, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    // Canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonical);

    // JSON-LD Structured Data
    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Pradyumna',
      jobTitle: 'Software Developer & CSE (AI/ML) Student',
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'GL Bajaj Institute of Technology & Management',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Greater Noida',
          addressRegion: 'Uttar Pradesh',
          addressCountry: 'India'
        }
      },
      url: canonical,
      sameAs: [
        'https://github.com/Parthparthu'
      ]
    };

    const activeSchema = schema || defaultSchema;
    let scriptTag = document.getElementById('json-ld-data') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(activeSchema);
  }, [title, description, canonical, type, schema]);

  return null;
};
