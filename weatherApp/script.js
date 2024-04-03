const error = document.querySelector(".error");
const offline = document.querySelector(".offline");
const group = document.querySelector(".group");
const weekContainer = document.querySelector("#week-container");
const cityInput = document.querySelector("#search-box");

function populateWeatherData(weather) {
    document.querySelector("#condition").innerHTML = weather.condition;
    document.querySelector("#temperature").innerHTML = Math.round(weather.temp);
    document.querySelector("#date").innerHTML = weather.date;
    document.querySelector("#day").innerHTML = weather.day;
    document.querySelector("#city-name").innerHTML = weather.name;
    document.querySelector("#pressure").innerHTML = weather.pressure;
    document.querySelector("#wind-speed").innerHTML = weather.windSpeed;
    document.querySelector("#humidity").innerHTML = weather.humidity;
    document.querySelector("#weather-icon").src = `http://openweathermap.org/img/wn/${weather.icon}.png`;
}

async function fetchData(cityName) {
    try {
        // Fetching weather data based on the city name
        const apiKey = "b9042ec5d9a26c6e11c152ed3cf8ec90";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            // add error
            error.classList.remove("hide");
            Array.from(group).forEach((node) => node.classList.add("hide"));
        } else {
            // remove error
            error.classList.add("hide");
            Array.from(group).forEach((node) => node.classList.remove("hide"));

            const data = await response.json();//convets json format into javascript object
            console.log(data);
            // For the current day and date
            const currentDate = new Date();
            let weekdays = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ];
            // Define the option for formatting the date
            let options = {
                year: "numeric",
                month: "short",
                day: "numeric",
            };
            // Adding the weather data to an object
            const weather = {
                name: data.name, // city name
                day: weekdays[currentDate.getDay()], // current day
                date: currentDate.toLocaleDateString("en-US", options), // current date
                condition: data.weather[0].description, // Weather condition
                icon: data.weather[0].icon, // weather icon
                temp: data.main.temp, // city temperature
                pressure: data.main.pressure, // pressure
                windSpeed: data.wind.speed, // wind speed
                humidity: data.main.humidity, // humidity
            };

            // Adding the data to the HTML using DOM
            populateWeatherData(weather);

            localStorage.setItem(weather.name, JSON.stringify(weather));
        }
    } catch (error) {
        // Handle the error
        console.error(error);
        // Display an error message to the user
        error.classList.remove("hide");
        Array.from(group).forEach((node) => node.classList.add("hide"));
        alert("An error occurred while fetching weather data. Please try again later.");
    }
}

async function get7days() {
    const apiKey = "b9042ec5d9a26c6e11c152ed3cf8ec90";
    const cityName = "Zharkent";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    const response = await fetch('pastWeatherAPI.php');
    const data = await response.json();
    console.log(data)
    const container = document.querySelector('.past-data');

    if (document.querySelector('.day')) {
        document.querySelector('.day').innerHTML = ''
    }

    data.forEach((obj) => {
        newDiv = document.createElement('div');
        newDiv.classList.add('day');

        newDiv.innerHTML = `
        <p class='temperature-past'>Date: ${obj.Day_of_week},${obj.Day_and_date}</p>
        <p class='temperature-past'>Temperature: ${obj.Temperature}</p>
        <p class='temperature-past'>Humidity: ${obj.Humidity}</p>
        <p class='temperature-past'>Pressure: ${obj.Pressure}</p>
        <p class='temperature-past'>Wind Speed: ${obj.Wind_Speed}</p>
        <p class='temperature-past'>Condition: ${obj.Weather_Condition}</p>
        <br>
      `
        container.appendChild(newDiv);

    })
}

// For default location weather
fetchData("Zharkent");

const cachedWeatherData = localStorage.getItem("defaultWeatherData");
if (cachedWeatherData) {
    const weather = JSON.parse(cachedWeatherData);
    populateWeatherData(weather);
}

function searchWeather() {
    const cityName = cityInput.value.trim();
    if (cityName !== "") {
        fetchData(cityName);
        cityInput.value = "";
    }
}

// Event listener for the "Enter" key press on the input element
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchWeather();
    }
});
