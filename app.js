document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "aPvcUYh9AF66rUdXlMeGK640KNGrqjgY"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
        getForecast(city); // Fetch 5-day forecast data when submitting the form
        getHourlyForecast(city); // Fetch hourly forecast data when submitting the form
    });

    function getWeather(city) {
        const url = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function getForecast(city) {
        const url = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchForecastData(locationKey);
                } else {
                    console.error("City not found for forecast:", city);
                }
            })
            .catch(error => {
                console.error("Error fetching location data for forecast:", error);
            });
    }

    function fetchForecastData(locationKey) {
        const url = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML += `<p>No forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching forecast data.</p>`;
            });
    }

    function displayForecast(forecasts) {
        let forecastContent = `<h2>5-Day Forecast</h2>`;
        forecasts.forEach(forecast => {
            const date = new Date(forecast.Date);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            const temperatureMin = forecast.Temperature.Minimum.Value;
            const temperatureMax = forecast.Temperature.Maximum.Value;
            const weather = forecast.Day.IconPhrase;

            forecastContent += `
                <div>
                    <h3>${day}</h3>
                    <p>Min Temp: ${temperatureMin}°C</p>
                    <p>Max Temp: ${temperatureMax}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        });
        weatherDiv.innerHTML += forecastContent;
    }

    function getHourlyForecast(city) {
        const url = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchHourlyForecastData(locationKey);
                } else {
                    console.error("City not found for hourly forecast:", city);
                }
            })
            .catch(error => {
                console.error("Error fetching location data for hourly forecast:", error);
            });
    }

    function fetchHourlyForecastData(locationKey) {
        const url = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML = `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function displayHourlyForecast(hourlyForecasts) {
        let hourlyForecastContent = `<h2>Hourly Forecast</h2>`;
        hourlyForecasts.forEach(hourlyForecast => {
            const dateTime = new Date(hourlyForecast.DateTime);
            const time = dateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            const temperature = hourlyForecast.Temperature.Value;
            const weather = hourlyForecast.IconPhrase;

            hourlyForecastContent += `
                <div>
                    <h3>${time}</h3>
                    <p>Time: ${time}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        });
        weatherDiv.innerHTML += hourlyForecastContent;
    }
});
