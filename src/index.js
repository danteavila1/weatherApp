const searchBtn = document.querySelector(".search button");
const searchBar = document.querySelector(".search-bar");
const dailyContainer = document.querySelector(".daily-container");

searchBtn.addEventListener("click", function(){
    let city = searchBar.value;
    getWeather(city);
    getWeatherForecast(city);
});

const getWeather = (city) => {
    const apiCurrent = `http://api.weatherapi.com/v1/current.json?key=dcf626c1b3c54fc5aca215757243001&q=${city}`;
    fetch (apiCurrent).then(response=> {
        if(!response.ok){
            alert("Invalid Location!");
            throw new Error (`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data=>{
        let weatherInfo = {};
        weatherInfo.currentTemperature = data.current.temp_c;
        weatherInfo.humidity = data.current.humidity;
        weatherInfo.weatherWind = data.current.wind_kph;
        weatherInfo.conditionText = data.current.condition.text;
        weatherInfo.conditionIcon = "https:"+ data.current.condition.icon;
        let date = new Date (data.current.last_updated);
        let hour = date.getHours();
        let minute = date.getMinutes();
        minute = (minute<10) ? "0"+minute : minute;
        let dayOfWeekNum = date.getDay();
        let daysOfWeekArray = ["Sunday","Monday","Tuesday","Wednesday","Tuesday",
        "Friday","Saturday"];
        let dayOfWeekStr = daysOfWeekArray[dayOfWeekNum];
        dayOfWeekStr += " "+hour+" : "+minute;
        weatherInfo.dayOfWeekStr = dayOfWeekStr;
        showDailyForecastDetails(weatherInfo,city);
    })
    .catch(error=>console.log(`There was a problem with fetch operation `+error.message));
}

const showDailyForecastDetails = (weatherInfo,city) => {
    cityName.innerHTML = city.charAt(0).toUpperCase()+city.slice(1);
    today.innerHTML = weatherInfo.dayOfWeekStr;
    currentTemp.innerHTML = weatherInfo.currentTemperature+"°C";
    condition.innerHTML = weatherInfo.conditionText;
    humidity.innerHTML = "Humidity: "+weatherInfo.humidity+"%";
    wind.innerHTML = "Wind speed: "+weatherInfo.weatherWind+" km/h";
    document.getElementById("currentIcon").src = weatherInfo.conditionIcon;
}

const getWeatherForecast = (city) => {
    const apiForecast = `http://api.weatherapi.com/v1/forecast.json?key=dcf626c1b3c54fc5aca215757243001&q=${city}&days=3`;
    
    fetch(apiForecast)
    .then (response=>{
        if(!response.ok){
            alert("Invalid Location!");
            throw new (`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data=>{
        data.forecast.forecastday.forEach(day=>{
            let weatherInfo={};
            weatherInfo.currentTemperature = Math.round(day.day.avgtemp_c);
            weatherInfo.conditionIcon = "https:"+day.day.condition.icon;
            let date = new Date (day.date);
            let dayOfWeekNum=date.getDay();
            weatherInfo.windSpeed = day.day.maxwind_kph;
            weatherInfo.humidity = day.day.avghumidity;
            weatherInfo.conditionText = day.day.condition.text;
            weatherInfo.minTemp = Math.round(day.day.mintemp_c);
            weatherInfo.maxTemp = Math.round(day.day.maxtemp_c);
            let daysOfWeekArray = ["Sunday","Monday","Tuesday","Wednesday","Tuesday",
            "Friday","Saturday"];
            weatherInfo.dayOfWeekStr = daysOfWeekArray[dayOfWeekNum];
            let dailyForecastHtml = generateDailyForecastHtml(weatherInfo,city);
            dailyContainer.appendChild(dailyForecastHtml);
        })
    })
    .catch(error=>console.log(`There was a problem with the fetch operation `+error.message));
}

const generateDailyForecastHtml = (weatherInfo,city) =>{
   
    let div = document.createElement("div");
    div.className = "daily-forecast";

    let weekDayDiv = document.createElement("div");
    weekDayDiv.className = "weekday";
    weekDayDiv.textContent = weatherInfo.dayOfWeekStr.substring(0,3);
    div.appendChild(weekDayDiv);

    let imageDiv = document.createElement("div");
    let img = document.createElement("img");
    img.id = "currentIcon";
    img.src = weatherInfo.conditionIcon;
    imageDiv.appendChild(img);
    div.appendChild(imageDiv);

    let maxMinTempDiv = document.createElement("div");
    maxMinTempDiv.className = "max-min-temp";

    let tempSpan1 = document.createElement("span");
    tempSpan1.className="temp";
    tempSpan1.textContent=weatherInfo.maxTemp+"°";
    maxMinTempDiv.appendChild(tempSpan1);
    let tempSpan2 = document.createElement("span");
    tempSpan2.className="temp";
    tempSpan2.textContent=weatherInfo.minTemp+"°";
    maxMinTempDiv.appendChild(tempSpan2);

    div.appendChild(maxMinTempDiv);
    div.addEventListener("click",function(){
        showDailyForecastDetails(weatherInfo,city);
    });
    return div;
}
