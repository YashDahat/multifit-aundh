import React from 'react';

interface GoogleMapsEmbedProps {
  latitude: number;
  longitude: number;
}

const GoogleMapsEmbed: React.FC<GoogleMapsEmbedProps> = ({ latitude, longitude }) => {
  // Construct the Google Maps embed URL.
  // 'z=15' sets the zoom level. 'output=embed' is crucial for embedding.
  const mapSrc = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Gym Location on Google Maps"
      ></iframe>
    </div>
  );
};

export default GoogleMapsEmbed;