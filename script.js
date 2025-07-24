console.log(import.meta.env.VITE_WEATHER_API_KEY);
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            // Fixed URL construction - removed curly braces around API key
            const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;
            
            fetch(url).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data);
                console.log(new Date().getTime());
                var dat = new Date(data.dt * 1000); // Fixed: multiply by 1000 for correct timestamp
                console.log(dat.toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}));
                console.log(new Date().getMinutes());
                weatherReport(data);
            }).catch((error) => {
                console.error('Error fetching weather data:', error);
                alert('Error fetching weather data. Please try again.');
            });
        }, (error) => {
            console.error('Geolocation error:', error);
            alert('Unable to get your location. Please search for a city manually.');
        });
    }
});

function searchByCity() {
    var place = document.getElementById('input').value.trim();
    
    if (!place) {
        alert('Please enter a city name');
        return;
    }
    
    // Fixed URL construction - properly use template literals and variables
    var urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(place)}&appid=${apikey}`;

    fetch(urlsearch).then((res) => {
        return res.json();
    }).then((data) => {
        if (data.cod === '404') {
            alert('City not found. Please check the spelling and try again.');
            return;
        }
        console.log(data);
        weatherReport(data);
    }).catch((error) => {
        console.error('Error searching city:', error);
        alert('Error searching for city. Please try again.');
    });
    
    document.getElementById('input').value = '';
}

function weatherReport(data) {
    // Fixed URL construction for forecast
    var urlcast = `http://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(data.name)}&appid=${apikey}`;

    fetch(urlcast).then((res) => {
        return res.json();
    }).then((forecast) => {
        console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast);

        console.log(data);
        document.getElementById('city').innerText = data.name + ', ' + data.sys.country;
        console.log(data.name, data.sys.country);

        // Convert temperature from Kelvin to Celsius
        console.log(Math.floor(data.main.temp - 273.15));
        document.getElementById('temperature').innerText = Math.floor(data.main.temp - 273.15) + ' °C';

        document.getElementById('clouds').innerText = data.weather[0].description;
        console.log(data.weather[0].description);

        let icon1 = data.weather[0].icon;
        let iconurl = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
        document.getElementById('img').src = iconurl;
    }).catch((error) => {
        console.error('Error fetching forecast:', error);
        alert('Error fetching forecast data.');
    });
}

function hourForecast(forecast) {
    document.querySelector('.templist').innerHTML = '';
    for (let i = 0; i < 5; i++) {
        var date = new Date(forecast.list[i].dt * 1000);
        console.log((date.toLocaleTimeString('en-US', {timeZone: 'Asia/Kolkata'})).replace(':00', ''));

        let hourR = document.createElement('div');
        hourR.setAttribute('class', 'next');

        let div = document.createElement('div');
        let time = document.createElement('p');
        time.setAttribute('class', 'time');
        time.innerText = (date.toLocaleTimeString('en-US', {timeZone: 'Asia/Kolkata'})).replace(':00', '');

        let temp = document.createElement('p');
        // Fixed temperature conversion
        temp.innerText = Math.floor((forecast.list[i].main.temp_max - 273.15)) + ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273.15)) + ' °C';

        div.appendChild(time);
        div.appendChild(temp);

        let desc = document.createElement('p');
        desc.setAttribute('class', 'desc');
        desc.innerText = forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc);
        document.querySelector('.templist').appendChild(hourR);
    }
}

function dayForecast(forecast) {
    document.querySelector('.weekF').innerHTML = '';
    for (let i = 8; i < forecast.list.length; i += 8) {
        console.log(forecast.list[i]);
        let div = document.createElement('div');
        div.setAttribute('class', 'dayF');

        let day = document.createElement('p');
        day.setAttribute('class', 'date');
        day.innerText = new Date(forecast.list[i].dt * 1000).toDateString();
        div.appendChild(day);

        let temp = document.createElement('p');
        // Fixed temperature conversion
        temp.innerText = Math.floor((forecast.list[i].main.temp_max - 273.15)) + ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273.15)) + ' °C';
        div.appendChild(temp);

        let description = document.createElement('p');
        description.setAttribute('class', 'desc');
        description.innerText = forecast.list[i].weather[0].description;
        div.appendChild(description);

        document.querySelector('.weekF').appendChild(div);
    }
}

// Enhanced search function that handles international locations better
function searchByLocation() {
    var place = document.getElementById('input').value.trim();
    
    if (!place) {
        alert('Please enter a location (city, state, country)');
        return;
    }
    
    // This allows for more flexible searches like "Paris, France" or "New York, NY, US"
    var urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(place)}&appid=${apikey}`;

    fetch(urlsearch).then((res) => {
        return res.json();
    }).then((data) => {
        if (data.cod === '404') {
            alert('Location not found. Try formats like:\n- "City Name"\n- "City, Country"\n- "City, State, Country"');
            return;
        }
        console.log(data);
        weatherReport(data);
    }).catch((error) => {
        console.error('Error searching location:', error);
        alert('Error searching for location. Please try again.');
    });
    
    document.getElementById('input').value = '';
}