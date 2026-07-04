import React from 'react';

const LocalBusinessSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Gym",
    "name": "MultiFit Aundh",
    "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "D.P. Road Medipoint Hospital Road, opp. to Indian Bank",
      "addressLocality": "Aundh",
      "addressRegion": "Maharashtra",
      "postalCode": "411067",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 18.562876,
      "longitude": 73.7845873
    },
    "url": "https://www.multifitaundh.com",
    "telephone": "+917507008009",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "06:00",
        "closes": "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "07:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "08:00",
        "closes": "18:00"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default LocalBusinessSchema;