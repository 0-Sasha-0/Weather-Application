const apiKey = '9598ab201cd04171bd1145314241907'; // Your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const cache = new Map(); // Simple in-memory cache

async function getWeather(city) {
  if (cache.has(city)) {
    return cache.get(city); // Return cached response if available
  }

  try {
    const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;
    console.log('Request URL:', url); // Log request URL for debugging

    const response = await fetch(url);
    console.log('Response Status:', response.status); // Log response status

    const data = await response.json();
    console.log('Response Data:', data); // Log response data

    if (data.cod !== 200) {
      throw new Error(data.message || 'An error occurred while fetching weather data');
    }

    cache.set(city, data); // Cache the response
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
      <h2>${weather.name}, ${weather.sys.country}</h2>
      <p>Temperature: ${weather.main.temp}°C</p>
      <p>Feels Like: ${weather.main.feels_like}°C</p>
      <p>Min Temp: ${weather.main.temp_min}°C</p>
      <p>Max Temp: ${weather.main.temp_max}°C</p>
      <p>Humidity: ${weather.main.humidity}%</p>
      <p>Wind Speed: ${weather.wind.speed} m/s</p>
      <p>Conditions: ${weather.weather[0].description}</p>
    `;
    resultDiv.classList.remove('error');
  } catch (error) {
    resultDiv.innerHTML = `<p>${error.message}</p>`;
    resultDiv.classList.add('error');
  }
  resultDiv.classList.remove('hidden');
});
