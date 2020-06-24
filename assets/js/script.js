function weather() {
const APIKey = "23b0c10bfa2357a7260c158935df0490";
var inputEl = document.getElementById("city");
    searchEl = document.getElementById("search-button");
    historyEl = document.getElementById("history");
    clearEl = document.getElementById("clear");

var cityNameEl = document.getElementById("city-name");
    weathericonEl = document.getElementById("weather-pic");
    currentTempEl = document.getElementById("temperature");
    currentHumidityEl = document.getElementById("humidity");
    currentWindEl = document.getElementById("wind-speed");
    currentUVEl = document.getElementById("UV-index");

var history = JSON.parse(localStorage.getItem("search")) || []; 
// i found this code in a youtube video that was also using open weather map 
// im still really confused about how axios functions
function getWeather(cityName) {
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    axios.get(queryURL)
    .then(function(response){
var currentDate = new Date(response.data.dt*1000); // i got this straight from stackoverflow
    year = currentDate.getFullYear();
    month = currentDate.getMonth() + 1;
    day = currentDate.getDate();
cityNameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
// since open weather map had icons i just used those here  
var weatherPic = response.data.weather[0].icon;
    weathericonEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
    currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F"; // i was super confused before i got the k2f function 
    currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
    currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
var lat = response.data.coord.lat;
    lon = response.data.coord.lon;
var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
    axios.get(UVQueryURL)
    .then(function(response){
var UVI = document.createElement("span");
    UVI.setAttribute("class","badge badge-danger"); // i originally was gonna make an element wrapping this and make it red but im glad bootstrap had a solution 
    UVI.innerHTML = response.data[0].value;
    currentUVEl.innerHTML = "UV Index: ";
    currentUVEl.append(UVI);
    });

var cityID = response.data.id;
    weatherQurl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
    axios.get(weatherQurl)
    .then(function(response){

// i still feel unconfident producing html with js i found this code and reworked it 
const forecastEls = document.querySelectorAll(".forecast");
            for (i=0; i<forecastEls.length; i++) {
                forecastEls[i].innerHTML = "";

            var forecastIndex = i*8 + 4;
                forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                forecastYear = forecastDate.getFullYear();
                forecastMonth = forecastDate.getMonth() + 1;
                forecastDay = forecastDate.getDate();

            var forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class","mt-3 h5");
                forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecastEls[i].append(forecastDateEl);
                
            var forecastWeatherEl = document.createElement("img"); // i had no idea how to create an image with js before i found this 
                forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastEls[i].append(forecastWeatherEl);

            var forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                forecastEls[i].append(forecastTempEl);

            var forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                forecastEls[i].append(forecastHumidityEl);
                }
            })
        });  
    }

searchEl.addEventListener("click",function() {
var userInput = inputEl.value;
    history.push(userInput); // i was originally using another method using the event listener to generate html but quickly realized how impractical that is
    getWeather(userInput);
    localStorage.setItem("search",JSON.stringify(history));
    showHistory();
    })
clearEl.addEventListener("click",function() {
        history = [];
        showHistory();
    })

// since the api is in kelvin this is the conversion function found in an open weather map example
function k2f(K) {
        return Math.floor((K - 273.15) *1.8 +32);
}
// i found this method to show your history i was originally having problems generating html 
// with js but luckily this has been done before in a similar way, i realized my first problem
// was not defining it as an empty string seen on line 104 
function showHistory() {
historyEl.innerHTML = "";
    for (var i=0; i<history.length; i++) {
        const searches = document.createElement("input");
        searches.setAttribute("value", history[i]);
        searches.setAttribute("readonly",true);
        searches.setAttribute("type","text");
        searches.setAttribute("class", "form-control d-block");
        searches.addEventListener("click",function() {
            getWeather(searches.value);
        })
        historyEl.append(searches);
    }
}
showHistory();
    if (history.length > 0) {
        getWeather(history[history.length - 1]);
    }
}

weather();
