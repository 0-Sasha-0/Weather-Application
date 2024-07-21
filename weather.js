// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener to the weather form
    document.getElementById('weatherForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const city = document.getElementById('cityInput').value;
        fetchWeather(city);
    });
});

// Function to fetch weather data
async function fetchWeather(city) {
    document.getElementById('weatherDisplay').innerHTML = '<p>Loading weather data...</p>'; // Show loading message
    const apiKey = '9598ab201cd04171bd1145314241907'; // Use your secured API key method
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        displayWeather(data);
        changeBackground(data.current.condition.text); // Assuming condition text is suitable for background logic
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('weatherDisplay').innerHTML = `Error: ${error.message}`;
    }
}

// Function to display weather data
function displayWeather(data) {
    const weather = data.current;
    const display = document.getElementById('weatherDisplay');
    display.innerHTML = `<h3>Weather in ${data.location.name}</h3>
                         <p>Temperature: ${weather.temp_c}°C (${weather.temp_f}°F)</p>
                         <p>Condition: ${weather.condition.text}</p>
                         <img src="${weather.condition.icon}" alt="Icon representing ${weather.condition.text}">
                         <p>Humidity: ${weather.humidity}%</p>
                         <p>Wind: ${weather.wind_kph} km/h (${weather.wind_mph} mph)</p>`;
}

// Function to change the background based on weather conditions
function changeBackground(weatherCondition) {
    const weatherApp = document.getElementById('weather-app');
    switch (weatherCondition) {
        case 'Clear':
            weatherApp.style.backgroundImage = 'url(images/clear-sky.jpg)';
            weatherApp.style.color = '#f7c576'; // Light yellow text color for clear sky
            break;
        case 'Clouds':
            weatherApp.style.backgroundImage = 'url(images/cloudy.jpg)';
            weatherApp.style.color = '#d9d9d9'; // Grey text color for cloudy weather
            break;
        case 'Rain':
            weatherApp.style.backgroundImage = 'url(images/rain.jpg)';
            weatherApp.style.color = '#a4b0be'; // Blue text color for rain
            break;
        case 'Snow':
            weatherApp.style.backgroundImage = 'url(images/snow.jpg)';
            weatherApp.style.color = '#ffffff'; // White text color for snow
            break;
        // Add more cases as needed
        default:
            weatherApp.style.backgroundImage = 'url(images/default.jpg)';
            weatherApp.style.color = '#333333'; // Default color
    }
}
