const apiKey = '9598ab201cd04171bd1145314241907'; // Replace with your WeatherAPI key
const apiUrl = 'https://api.weatherapi.com/v1/current.json';
const cache = new Map(); // Simple in-memory cache
const CACHE_DURATION = 30 * 60 * 1000; // Cache duration in milliseconds, e.g., 30 minutes

function setCache(city, data) {
  const cacheEntry = {
    data: data,
    expiry: Date.now() + CACHE_DURATION
  };
  cache.set(city, cacheEntry);
}

function getCache(city) {
  const cacheEntry = cache.get(city);
  if (!cacheEntry) return null;

  if (Date.now() > cacheEntry.expiry) {
    cache.delete(city);
    return null;
  }

  return cacheEntry.data;
}

async function getWeather(city) {
  const cachedData = getCache(city);
  if (cachedData) {
    return cachedData; // Return cached data if not expired
  }

  try {
    const url = `${apiUrl}?key=${apiKey}&q=${city}`;
    console.log('Request URL:', url); // Log request URL for debugging

    const response = await fetch(url);
    console.log('Response Status:', response.status); // Log response status

    const data = await response.json();
    console.log('Response Data:', data); // Log response data

    if (data.error) {
      throw new Error(data.error.message || 'An error occurred while fetching weather data');
    }

    setCache(city, data); // Cache the new data
    return data;
  } catch (error) {
    console.error('Fetch Error:', error); // Log errors for debugging
    throw error; // Rethrow to be caught in the event listener
  }
}

document.getElementById('weatherForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('cityInput').value.trim();
  const resultDiv = document.getElementById('weatherResult');
  
  resultDiv.classList.add('hidden');
  resultDiv.classList.remove('error');
  resultDiv.innerHTML = 'Loading...';

  if (city === "") {
    resultDiv.innerHTML = '<p>Please enter a city name.</p>';
    resultDiv.classList.add('error');
    resultDiv.classList.remove('hidden');
    return;
  }

  try {
    const weather = await getWeather(city);
    resultDiv.innerHTML = `
      <h2>${weather.location.name}, ${weather.location.country}</h2>
      <p>Temperature: ${weather.current.temp_c}°C</p>
      <p>Feels Like: ${weather.current.feelslike_c}°C</p>
      <p>Humidity: ${weather.current.humidity}%</p>
      <p>Wind Speed: ${weather.current.wind_kph} kph</p>
      <p>Conditions: ${weather.current.condition.text}</p>
    `;
    resultDiv.classList.remove('error');
  } catch (error) {
    resultDiv.innerHTML = `<p>${error.message}</p>`;
    resultDiv.classList.add('error');
  }
  resultDiv.classList.remove('hidden');
});
