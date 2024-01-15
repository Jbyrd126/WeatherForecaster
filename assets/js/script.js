const getCurrent = async (lat, lon) => {
    console.log(`In current ${(lat, lon)}`);
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=3be2b2b6acc21e3760901d15acf91f72`
    );
    // get the body out of the response
    const weather = await response.json();
    // /log the data
    console.log(weather);

    $(".current").append($(`<h1>${weather.name}</h1>`));
    const myImage = $(`<img>`);
    myImage.attr(
        "src",
        `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    );
    $(".current").append(myImage);
    $(".current").append(
        $(`<p style="font-weight:bold">Temp: ${weather.main.temp} &#8457</p>`)
    );
    $(".current").append(
        $(`<p style="font-weight:bold">Wind: ${weather.wind.speed} Mph</p>`)
    );
    $(".current").append(
        $(`<p style="font-weight:bold">Humidity: ${weather.main.humidity} %</p>`)
    );

    console.log(weather);
    console.log(weather.name);
    console.log(weather.main.temp);
    console.log(weather.wind.speed);
};

//function to get 5 day forecast, filter the response to each day at noon, dayjs to change the date format and finally append the data to the cards on the page
const getForecast = async (lat, lon) => {
    $(".forecast").empty();
    console.log(`In forecast ${(lat, lon)}`);
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=f6406638f7d67d23a5c2c55298a961a1`
    );
    const forecast = await response.json();
    console.log(forecast);

    const hourly = forecast.list.filter((list) => list.dt_txt.includes("12:00"));
    console.log(hourly);

    hourly.forEach((index) => {
        const date = dayjs(index.dt_txt).format("MMM DD, YYYY h:mm A");
        $(".forecast").append(
            $(`
        <div class="col bg-dark border border-3 border-gradient rounded m-3 text-center text-white">
          <p><img src="https://openweathermap.org/img/w/${index.weather[0].icon}.png"/></p>
          <p><br>${date}</br></p>
          <p>Temp: <br>${index.main.temp} &#8457;</br></p>
          <p>Wind Speed:<br> ${index.wind.speed} Mph</br></p>
          <p>Humidity: <br> ${index.main.humidity} %</br></p>
        </div>
      `)
        );
    });
};

const getCoords = async (city) => {
    console.log(city);
    const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=3be2b2b6acc21e3760901d15acf91f72`
    );
    // get the body out of the response
    const data = await response.json();
    // get our values
    const lat = data[0].lat;
    const lon = data[0].lon;

    getCurrent(lat, lon);
    getForecast(lat, lon);
    searched();
    displayLocal();

};


//make an array in local storage to pull recently searched locations from
function searched() {
    let addCity = JSON.parse(localStorage.getItem("newCity"));
    if (!Array.isArray(addCity)) {
        addCity = [];
    }
    addCity.unshift($(".city").val());
    localStorage.setItem("newCity", JSON.stringify(addCity));
}

// function to grab last city added to the array and display it as a button in the recently searched container
function displayLocal() {
    let localCity = JSON.parse(localStorage.getItem("newCity"));
    console.log(localCity);

    if (localCity) {
        const lastCity = localCity[(localCity = [0])];
        const listCity = $(
            `<button type="button" class="btn btn-dark mb-1">${lastCity}</button>`
        );
        $(".history").append(listCity);
    }
}

//listen for a click
$(".weather_btn").on("click", () => {
    // get the value from the form
    $(".current").empty();
    // get the coords
    getCoords($(".city").val());

});


// clicky clicky
window.addEventListener("beforeunload", function () {
    // Clear the local storage
    localStorage.clear();
});
