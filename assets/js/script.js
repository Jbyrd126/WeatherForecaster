const getCurrent = async (lat, lon) => {
    console.log(`In current ${(lat, lon)}`);
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=3be2b2b6acc21e3760901d15acf91f72`
    );
    // get the body out of the response
    const weather = await response.json();
    console.log(weather);
    // /log the data
    $(".current").append($(`<h1>${weather.name}</h1>`));
    const myImage = $(`<img>`);
    myImage.attr(
        "src",
        `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    );
    $(".current").append(myImage);
    $(".current").append($(`<p>Temp: ${weather.main.temp}</p>`));
    $(".current").append($(`<p>Wind: ${weather.wind.speed}</p>`));
    $(".current").append($(`<p>Humidity: ${weather.main.humidity}</p>`));

    $(".day").append($(`<p>${weather.name}<p>`));

    console.log(weather);
    console.log(weather.name);
    console.log(weather.main.temp);
    console.log(weather.wind.speed);
};
const getForecast = async (lat, lon) => {
    $(".forecast");
    console.log(`In forecast ${(lat, lon)}`);
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=f6406638f7d67d23a5c2c55298a961a1`
    );
    // get the body out of the response
    const forecast = await response.json();
    console.log(forecast);
    // for loop to filter the list from response to pull out each day at noon
    const hourly = forecast.list.filter((list) => list.dt_txt.includes("12:00"));
    console.log(hourly);
    // to make container and put the filter list items on the page
    hourly.forEach((index) => {
        $(".forecast").append(
            $(`
        <div class="col bg-danger m-3 text-center">
          <p>${index.dt_txt}</p> <p>${index.main.temp}</p>
          <p>${index.wind.speed}</p> <p>${index.main.humidity}</p>
        </div>`
            )
        );
    });


};

const getCoords = async (city) => {
    console.log(city);
    const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=3be2b2b6acc21e3760901d15acf91f72`
    );
    // get the body out of the response
    const data = await response.json();
    // get our values
    const lat = data[0].lat;
    const lon = data[0].lon;

    getCurrent(lat, lon);
    getForecast(lat, lon);
};

//listen for a click
$(".weather_btn").on("click", () => {
    // get the value form the form
    $(".current").empty();
    // get the coords
    getCoords($(".city").val());
    //pass the coords to the current weather
    // get the weather on th epage
});
