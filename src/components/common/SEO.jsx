import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({
  title,
  description,
  canonicalUrl,
  type = 'website',
  imageUrl = 'https://kokkarakko.shop/logo.webp',
  robots = 'index, follow',
  structuredData,
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Document Title
    if (title) {
      document.title = title;
    }

    // Helper to update or append meta tag
    const updateMeta = (attribute, value, attributeType = 'name') => {
      if (!value) return;
      let element = document.querySelector(`meta[${attributeType}="${attribute}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeType, attribute);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    // 2. Meta Description
    if (description) {
      updateMeta('description', description);
    }

    // 3. Robots
    if (robots) {
      updateMeta('robots', robots);
    }

    // 4. Canonical URL
    const resolvedCanonical = canonicalUrl || `https://kokkarakko.shop${location.pathname}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', resolvedCanonical);

    // 5. Open Graph Meta Tags (Facebook, WhatsApp, LinkedIn)
    if (title) updateMeta('og:title', title, 'property');
    if (description) updateMeta('og:description', description, 'property');
    if (type) updateMeta('og:type', type, 'property');
    updateMeta('og:url', resolvedCanonical, 'property');
    if (imageUrl) updateMeta('og:image', imageUrl, 'property');
    updateMeta('og:site_name', 'Kokkarakko Crispy Chicken', 'property');

    // 6. Twitter Card Meta Tags
    updateMeta('twitter:card', 'summary_large_image');
    if (title) updateMeta('twitter:title', title);
    if (description) updateMeta('twitter:description', description);
    if (imageUrl) updateMeta('twitter:image', imageUrl);

    // 7. Structured Data (JSON-LD)
    let jsonLdScript = document.getElementById('json-ld-structured-data');
    if (jsonLdScript) {
      jsonLdScript.remove();
    }

    if (structuredData) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'json-ld-structured-data';
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.innerHTML = JSON.stringify(structuredData);
      document.head.appendChild(jsonLdScript);
    }

    return () => {
      // Clean up JSON-LD on route changes to prevent duplication
      const scriptToRemove = document.getElementById('json-ld-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, canonicalUrl, type, imageUrl, robots, structuredData, location.pathname]);

  return null;
};

export default SEO;
