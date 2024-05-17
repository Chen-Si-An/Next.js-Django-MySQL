import React, { useState, useEffect } from 'react';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://localhost:8000/myapp/hotels');
        const data = await response.json(); // Parse the response to JSON
        // console.log(data); // Log the data to see its structure
        setHotels(data.data);
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div>
      <h1>Hotel Data</h1>
      <ul>
        {hotels.map((hotel) => (
          <li key={`${hotel.Name}-${hotel.CityName}`}>{hotel.Name} - {hotel.CityName}</li>
        ))}
      </ul>
    </div>
  );
};

export default Hotels;