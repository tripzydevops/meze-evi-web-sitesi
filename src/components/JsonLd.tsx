interface JsonLdProps {
  type?: 'Restaurant' | 'MenuItem' | 'ItemList' | 'FAQPage';
  data?: any;
}

export default function JsonLd({ type = 'Restaurant', data }: JsonLdProps) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Bispecial Meze",
    "image": "https://www.bispecialmeze.com/og-image.jpg",
    "url": "https://www.bispecialmeze.com",
    "telephone": "+905334344406",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Paşa Alanı",
      "addressLocality": "Balıkesir",
      "addressRegion": "TR",
      "postalCode": "10100",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 39.6484,
      "longitude": 27.8824
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "11:00",
        "closes": "23:00"
      }
    ],
    "menu": "https://www.bispecialmeze.com/menu",
    "servesCuisine": "Turkish Meze",
    "priceRange": "$$"
  };

  let structuredData: any = baseData;

  if (type === 'MenuItem' && data) {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "MenuItem",
      "name": data.name,
      "description": data.description,
      "image": data.imageUrl || "https://www.bispecialmeze.com/og-image.jpg",
      "offers": {
        "@type": "Offer",
        "price": data.price?.replace(/[^0-9.]/g, '') || "0",
        "priceCurrency": "TRY",
        "availability": "https://schema.org/InStock"
      },
      "suitableForDiet": "https://schema.org/HealthyDiet"
    };
  }

  if (type === 'ItemList' && data) {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": data.map((item: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "MenuItem",
          "name": item.name,
          "url": `https://www.bispecialmeze.com/menu/${item.id}`
        }
      }))
    };
  }

  if (type === 'FAQPage' && data) {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.map((faq: any) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
