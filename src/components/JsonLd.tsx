export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Bispecial Meze",
    "image": "https://www.bispecialmeze.com/og-image.jpg",
    "url": "https://www.bispecialmeze.com",
    "telephone": "+90212XXXXXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Şişli",
      "addressLocality": "İstanbul",
      "addressRegion": "TR",
      "postalCode": "34000",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.06,
      "longitude": 28.98
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "11:00",
        "closes": "22:00"
      }
    ],
    "menu": "https://www.bispecialmeze.com/menu",
    "servesCuisine": "Turkish Meze",
    "priceRange": "$$"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
