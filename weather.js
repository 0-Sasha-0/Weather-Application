document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    const city = document.getElementById('cityInput').value;
    fetchWeather(city);
});

function fetchWeather(city) {
    document.getElementById('weatherDisplay').innerHTML = '<p>Loading weather data...</p>'; // Show loading message
    const apiKey = '9598ab201cd04171bd1145314241907'; // Use your secured API key method
    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            throw new Error(data.error.message);
        }
        displayWeather(data);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('weatherDisplay').innerHTML = `Error: ${error.message}`;
    });
}

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