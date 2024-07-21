async function fetchWeather(cityInput) {
    const display = document.getElementById('weatherDisplay');
    display.innerHTML = '<p>Loading weather data...</p>';
    const apiKey = '9598ab201cd04171bd1145314241907'; // Consider securing your API key
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityInput}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        displayWeather(data);
        updateWeatherStyles(data.current.condition.text);
    } catch (error) {
        console.error('Error:', error);
        display.innerHTML = `Error: ${error.message}`;
    }
}


document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const cityInput = document.getElementById('cityInput').value;
    fetchWeather(cityInput);
});

function updateWeatherStyles(weatherCondition) {
    const weatherApp = document.getElementById('weather-app');
    const body = document.body;
    const styles = {
        'Clear': { backgroundImage: 'url(images/clear-sky.jpg)', textColor: '#f7c576', bgColor: '#e2f0cb' },
        'Clouds': { backgroundImage: 'url(images/cloudy.jpg)', textColor: '#d9d9d9', bgColor: '#b6b6b6' },
        'Rain': { backgroundImage: 'url(images/rain.jpg)', textColor: '#a4b0be', bgColor: '#6c757d' },
        'Snow': { backgroundImage: 'url(images/snow.jpg)', textColor: '#ffffff', bgColor: '#aaa' },
        'default': { backgroundImage: 'url(images/default.jpg)', textColor: '#333333', bgColor: '#eef1f7' }
    };
    const { backgroundImage, textColor, bgColor } = styles[weatherCondition] || styles['default'];
    weatherApp.style.backgroundImage = backgroundImage;
    weatherApp.style.color = textColor;
    body.style.backgroundColor = bgColor;
}

function displayWeather(data) {
    const weather = data.current;
    const display = document.getElementById('weatherDisplay');
    display.innerHTML = `<h3>Weather in ${data.location.name}</h3>
                         <p>Temperature: ${weather.temp_c}°C (${weather.temp_f}°F)</p>
                         <p>Condition: ${weather.condition.text}</p>
                         <img src="${weather.condition.icon}" alt="Weather icon showing ${weather.condition.text}">
                         <p>Humidity: ${weather.humidity}%</p>
                         <p>Wind: ${weather.wind_kph} km/h (${weather.wind_mph} mph)</p>`;
}
