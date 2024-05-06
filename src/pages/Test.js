import React, { useState } from 'react';
import NavBar from '../components/Navbar/NavBar';
import Footer from '../components/Footer';

const api = {
  key: "64e1840d7b35b9c7872cf31651158510",
  base: "https://api.openweathermap.org/data/2.5/",
};

const Test = (props) => {
  const [cities] = useState([
    "Verkhoyansk",
    "Oymyakon",
    "Barrow",
    "Yellowknife",
    "Norilsk",
    "Ulaanbaatar",
    "Harbin",
    "Yakutsk",
    "Winnipeg",
    "Fairbanks",
    "Dudinka",
    "Vorkuta",
    "Iqaluit",
    "Murmansk",
    "Yakutsk",
    "Astana",
    "Tromsø",
    "Chita",
    "Magadan",
    "Longyearbyen"

  ]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [weathers, setWeathers] = useState([]);
  const [showWeather, setShowWeather] = useState(false);
  const [weatherCode, setWeatherCode] = useState("");

  const fetchWeatherData = async () => {
    const randomCities = [];
    while (randomCities.length < 3) {
      const randomIndex = Math.floor(Math.random() * cities.length);
      const randomCity = cities[randomIndex];
      if (!randomCities.includes(randomCity)) {
        randomCities.push(randomCity);
      }
    }
    const weatherData = [];
    for (let city of randomCities) {
      try {
        const response = await fetch(
          `${api.base}weather?q=${city}&units=metric&APPID=${api.key}`
        );
        const result = await response.json();
        weatherData.push({ name: result.name, temp: Math.ceil(result.main.temp) });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
    setWeathers(weatherData);
    setShowWeather(true);
    setSelectedCities(randomCities);
    const code = weatherData.map(weather => formatTemperature(weather.temp)).join("");
    setWeatherCode(code);
  };

  const formatTemperature = (temperature) => {
    let formattedTemp = Math.ceil(Math.abs(temperature));
    if (formattedTemp < 10) {
      formattedTemp = `0${formattedTemp}`;
    }
    return formattedTemp;
  };

  const handleButtonClick = () => {
    fetchWeatherData();
  };

  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="flex justify-center items-center min-h-screen">
        <div id='demo' className="text-center">
          <div className="container mx-auto my-8 px-4 lg:px-20" data-aos="zoom-in">

            <button
              onClick={handleButtonClick}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg border border-blue-600 hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              style={{
                boxShadow: '0px 4px 8px rgba(0, 0, 255, 0.2)'
              }}
            >
              Click to see the Coldest cities in the world - Testing
            </button>

            {showWeather && (
              <div style={{ marginTop: '30px', fontSize: '2.5em' }}>
                <p>Weather Code: {weatherCode}</p>
                {weathers.map((weather, index) => (
                  <p key={index} style={{ marginTop: '10px' }}>{weather.name}: {weather.temp}°C</p>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer className="mt-auto" />
    </>
  )
}

export default Test;
