import axios from 'axios';

// IMPORTANT: Replace this with the API key you just created
const API_KEY = '23ce523785b3661d1c35e032fbac9907';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeather = async (latitude, longitude) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: API_KEY,
        units: 'metric', // Use 'imperial' for Fahrenheit
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw new Error('Could not fetch weather data.');
  }
};