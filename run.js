//----------------------------------------------------------------------------------------------------------//
//GLOBAL VARS
//----------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------//
//RESPONSIVNESS
//----------------------------------------------------------------------------------------------------------//

// RESIZE update
window.onresize = function () {
  location.reload();
};

// DEVICE
// device detection
//TBA

//SET RESPONSIVE VALUES
//1366x768	COMPUTER
//360x640 MOBILE
//601x962 TABLET

let optWidth;
let optHeight;
let relWidth;
let relHeight;

let cropWidthStart;
let cropWidthEnd;

//SET OPT WIDTH AND HEIGHT IF SCREEN IS SMALL
if (window.innerWidth > 601) {
  optWidth = 1366;
  optHeight = 768;
} else {
  optWidth = 360;
  optHeight = 640;
}

function setResponsiveSize() {
  relWidth = window.innerWidth / optWidth;
  relHeight = window.innerHeight / optHeight;
}

setResponsiveSize();

//----------------------------------------------------------------------------------------------------------//
//DOM ELEMENTS
//----------------------------------------------------------------------------------------------------------//
//SKY DOM
let skyCanvas = document.getElementById("skyCanvas");
let skyCtx = skyCanvas.getContext("2d");
let skyWidth = optWidth * relWidth;
let skyHeight = optHeight * relHeight;
skyCanvas.width = skyWidth;
skyCanvas.height = skyHeight;

//CITY DOM
let cityCanvas = document.getElementById("cityCanvas");
let cityCtx = skyCanvas.getContext("2d");
let cityWidth = optWidth * relWidth;
let cityHeight = optHeight * relHeight;
cityCanvas.width = cityWidth;
cityCanvas.height = cityHeight;

//WEATHER DOM
let weatherCanvas = document.getElementById("weather");
let weatherCtx = weatherCanvas.getContext("2d");
let weatherWidth = optWidth * relWidth;
let weatherHeight = optHeight * relHeight;
weatherCanvas.width = weatherWidth;
weatherCanvas.height = weatherHeight;

//WindowSize detection
// CROP IMAGE
if (window.innerWidth > 601) {
  croptWidthStart = 0;
  croptWidthEnd = 1;
} else {
  croptWidthStart = 0.3;
  croptWidthEnd = 0.6;
}

//----------------------------------------------------------------------------------------------------------//
//WEATHER & TIME API // GET DATA
//----------------------------------------------------------------------------------------------------------//
let apiKeyWeather = "ef834ba6b77d78c6f0324aee2e241488";
const locationInput = "Karlshamn";
const locationCountryInput = "Sweden";

let currentWeatherURL =
  "http://api.openweathermap.org/data/2.5/weather?q=" +
  locationInput +
  "&appid=" +
  apiKeyWeather;
let forcastURL =
  "http://api.openweathermap.org/data/2.5/forecast?q=" +
  locationInput +
  "&appid=" +
  apiKeyWeather;

const currentTimeData =
  "https://api.ipgeolocation.io/timezone?apiKey=f200af9f73d84b7abdcdaae87831b563&location=" +
  locationInput +
  "," +
  locationCountryInput;

(async function runWeatherAndTimeSystem() {
  //Fetch current Weather
  let responseCurrentWeather = await fetch(currentWeatherURL);
  let jsonCurrentWeather = await responseCurrentWeather.json();

  //CURRENT WEATHER
  //current weather reusltus
  let currentWeatherId = jsonCurrentWeather.weather[0].id;
  let currentWeatherDescription = jsonCurrentWeather.weather[0].description;
  let currentTemperatureInKelvin = jsonCurrentWeather.main.temp;
  let currentTemperatureInCelsius = (
    currentTemperatureInKelvin - 273.15
  ).toFixed(1);
  let currentWindSpeedMs = jsonCurrentWeather.wind.speed;
  let currentWindDirectionDegrees = jsonCurrentWeather.wind.deg;
  console.log(
    "Current weather " + "id: " + currentWeatherId,
    "description: " + currentWeatherDescription,
    "temp C° :" + currentTemperatureInCelsius,
    "windSpeed M/s: " + currentWindSpeedMs,
    "wind direction°: " + currentWindDirectionDegrees
  );
  // UNIX time Sunrise and Sunset

  let currentSunRiseUnix = jsonCurrentWeather.sys.sunrise;
  let currentSunSetUnix = jsonCurrentWeather.sys.sunset;

  let currentSunRiseDate = new Date(currentSunRiseUnix * 1000);
  let currentSunRiseHour = currentSunRiseDate.getHours();
  let currentSunRiseMinutes = currentSunRiseDate.getMinutes();
  let currentSunRiseTimeInMinutes =
    currentSunRiseHour * 60 + currentSunRiseMinutes;
  console.log(
    "current sunrise " + currentSunRiseHour,
    currentSunRiseMinutes,
    currentSunRiseTimeInMinutes
  );

  let currentSunSetDate = new Date(currentSunSetUnix * 1000);
  let currentSunSetHour = currentSunSetDate.getHours();
  let currentSunSetMinutes = currentSunSetDate.getMinutes();
  let currentSunSetTimeInMinutes =
    currentSunSetHour * 60 + currentSunSetMinutes;
  console.log(
    "current sunset " + currentSunSetHour,
    currentSunSetMinutes,
    currentSunSetTimeInMinutes
  );

  //FORECAST
  //Fetch 5-day 3h Weather forcast
  let responseForcastWeather = await fetch(forcastURL);
  let jsonForcastWeather = await responseForcastWeather.json();
  //Forcast +1 day AT 12.00
  let forecast_Plus1D_At_1200_WeatherId =
    jsonForcastWeather.list[9].weather[0].id;
  let forecast_Plus1D_At_1200_Description =
    jsonForcastWeather.list[9].weather[0].description;
  let forecast_Plus1D_At_1200_TemperatureInKelvin =
    jsonForcastWeather.list[9].main.temp;
  let forecast_Plus1D_At_1200_TemperatureInCelsius = (
    forecast_Plus1D_At_1200_TemperatureInKelvin - 273.15
  ).toFixed(1);
  let forecast_Plus1D_At_1200_WindSpeed = jsonForcastWeather.list[9].wind.speed;
  let forecast_Plus1D_At_1200_DirectionDegrees =
    jsonForcastWeather.list[9].wind.deg;

  console.log(
    "Forecast 1Day Plus At 12.00 " + "id: " + forecast_Plus1D_At_1200_WeatherId,
    "description: " + forecast_Plus1D_At_1200_Description,
    "temp C° :" + forecast_Plus1D_At_1200_TemperatureInCelsius,
    "windSpeed M/s: " + forecast_Plus1D_At_1200_WindSpeed,
    "wind direction°: " + forecast_Plus1D_At_1200_DirectionDegrees
  );

  //CURRENT TIME
  //Fetch current time
  let currentTimeandDate = await fetch(currentTimeData);
  let jsonCurrenTimeandDate = await currentTimeandDate.json();
  //Current date reuslt
  //Current month
  let currentMonth = jsonCurrenTimeandDate.month;
  let currentTime = jsonCurrenTimeandDate.time_24;
  let currentTimeSplit = currentTime.split(":");
  let currentHour = currentTimeSplit[0];
  let currentMinutes = currentTimeSplit[1];
  //let currentTimeInMinutes = Number(currentHour) * 60 + Number(currentMinutes);
  let currentTimeInMinutes = 720;

  console.log(
    "current month: " + currentMonth,
    "current local time: " + currentTime,
    "current hour: " + currentHour,
    "current miuntes: " + currentMinutes,
    "current time in minutes: " + currentTimeInMinutes
  );

  //----------------------------------------------------------------------------------------------------------//
  //LOAD MATERIAL
  //----------------------------------------------------------------------------------------------------------//
  //Load sky
  const skyImage = new Image();
  skyImage.src = "PlaceHolderImagesv1/sky.png";

  //Load weather images
  const cloudWhiteA = new Image();
  cloudWhiteA.src = "PlaceHolderImagesv1/cloud.png";

  const sunA = new Image();
  sunA.src = "PlaceHolderImagesv1/sun.png";

  //Load city elements

  const cityImage = new Image();
  const windows = new Image();

  if (locationInput === "Karlshamn") {
    cityImage.src = "PlaceHolderImagesv1/cityStockholm.png";
    windows.src = "PlaceHolderImagesv1/windows.png";
  }



  //----------------------------------------------------------------------------------------------------------//
  //SETUP
  //----------------------------------------------------------------------------------------------------------//
 // RUN WEATHER
     
 cloudWhiteA.addEventListener("load", () => {
  placeHolderSun()
  placeHolderClouds();
 
});


 sunA.addEventListener("load", () => {
  
})


     
  //RUN SKY
  skyImage.addEventListener("load", () => {
    runSky();
  });

  //RUN CITY
  cityImage.addEventListener("load", () => {
    runCity();
  });

 

  

  //----------------------------------------------------------------------------------------------------------//
  //UPDATE / DRAW / ANIMATE
  //----------------------------------------------------------------------------------------------------------//
  // function update (){
  //     requestAnimationFrame(update)
  // }
  //update();



  //----------------------------------------------------------------------------------------------------------//
  // FUNCTION COLLECTION
  //----------------------------------------------------------------------------------------------------------//
  
  //----------------------------------------------------------------------------------------------------------//
  //SKY
  //----------------------------------------------------------------------------------------------------------//
  function runSky() {
    let skyBrightness;
    skyCtx.drawImage(
      skyImage,
      skyImage.naturalWidth * croptWidthStart,
      0,
      skyImage.naturalWidth * croptWidthEnd,
      skyImage.naturalHeight,
      0,

      0,
      skyWidth,
      skyHeight
    );
    const scannedImage = skyCtx.getImageData(0, 0, skyWidth, skyHeight);
    const scannedData = scannedImage.data;

    // MAP RGB TO TIME
    if (currentTimeInMinutes <= 719) {
      skyBrightness = mapTo(currentTimeInMinutes, 0, 719, 255, 0);
    }
    if (currentTimeInMinutes > 719) {
      skyBrightness = mapTo(currentTimeInMinutes, 719, 1440, 0, 255);
    }

    // MAINPULATE SKY COLOR HERE
    for (let i = 0; i < scannedData.length; i += 4) {
      scannedData[i + 0] = scannedData[i + 0] - skyBrightness;
      scannedData[i + 1] = scannedData[i + 1] - skyBrightness;
      scannedData[i + 2] = scannedData[i + 2] - skyBrightness;
      scannedData[i + 3] = scannedData[i + 3];
    }
    scannedImage.data = scannedData;
    skyCtx.putImageData(scannedImage, 0, 0);
  }

  //----------------------------------------------------------------------------------------------------------//
  // CITY FUNCTIONS
  //----------------------------------------------------------------------------------------------------------//

  //RUN CITY FUNCTIONS
  function runCity() {
    cityDraw();
  }

  

  //DRAW CITY
  let cityDraw = () => {
    let cityBrightness;

    cityCtx.drawImage(
      cityImage,
      cityImage.naturalWidth * croptWidthStart,
      0,
      cityImage.naturalWidth * croptWidthEnd,
      cityImage.naturalHeight,
      0,
      cityHeight - 600 * relHeight,
      cityWidth,
      cityHeight - 100 * relHeight
    );

    const scannedImage = cityCtx.getImageData(0, 0, cityWidth, cityHeight);
    const scannedData = scannedImage.data;
    // MAP RGB TO TIME
    if (currentTimeInMinutes <= 719) {
      cityBrightness = mapTo(currentTimeInMinutes, 0, 719, 255, 0);
    }
    if (currentTimeInMinutes > 719) {
      cityBrightness = mapTo(currentTimeInMinutes, 719, 1440, 0, 255);
    }

    // MAINPULATE SKY COLOR HERE
    for (let i = 0; i < scannedData.length; i += 4) {
      scannedData[i + 0] = scannedData[i + 0] - cityBrightness;
      scannedData[i + 1] = scannedData[i + 1] - cityBrightness;
      scannedData[i + 2] = scannedData[i + 2] - cityBrightness;
      scannedData[i + 3] = scannedData[i + 3];
    }
    scannedImage.data = scannedData;
    cityCtx.putImageData(scannedImage, 0, 0);
  };


  //----------------------------------------------------------------------------------------------------------//
  // WEATHER FUNCTIONS
  //----------------------------------------------------------------------------------------------------------//
  function placeHolderSun(){
    weatherCtx.drawImage(
      sunA, 100,150,200,200
      // cloudWhiteA,
      // cloudWhiteA.naturalWidth * croptWidthStart,
      // 0,
      // cloudWhiteA.naturalWidth * croptWidthEnd,
      // cloudWhiteA.naturalHeight,
      // 0,
      // weatherHeight - 100 * relHeight,
      // weatherWidth,
      // weatherHeight - 100 * relHeight
    );
  }
  
  

function placeHolderClouds () {

  let cloudBrightness;

  weatherCtx.drawImage(
    cloudWhiteA, 200,100,300,200
    // cloudWhiteA,
    // cloudWhiteA.naturalWidth * croptWidthStart,
    // 0,
    // cloudWhiteA.naturalWidth * croptWidthEnd,
    // cloudWhiteA.naturalHeight,
    // 0,
    // weatherHeight - 100 * relHeight,
    // weatherWidth,
    // weatherHeight - 100 * relHeight
  );


  weatherCtx.drawImage(
    cloudWhiteA, 1000,100,200,150
    // cloudWhiteA,
    // cloudWhiteA.naturalWidth * croptWidthStart,
    // 0,
    // cloudWhiteA.naturalWidth * croptWidthEnd,
    // cloudWhiteA.naturalHeight,
    // 0,
    // weatherHeight - 100 * relHeight,
    // weatherWidth,
    // weatherHeight - 100 * relHeight
  );

  const scannedImage = weatherCtx.getImageData(0, 0, cityWidth, cityHeight);
  const scannedData = scannedImage.data;
  // MAP RGB TO TIME
  if (currentTimeInMinutes <= 719) {
    cloudBrightness = mapTo(currentTimeInMinutes, 0, 719, 255, 0);
  }
  if (currentTimeInMinutes > 719) {
    cloudBrightness = mapTo(currentTimeInMinutes, 719, 1440, 0, 255);
  }

  // MAINPULATE SKY COLOR HERE
  for (let i = 0; i < scannedData.length; i += 4) {
    scannedData[i + 0] = scannedData[i + 0] - cloudBrightness;
    scannedData[i + 1] = scannedData[i + 1] - cloudBrightness;
    scannedData[i + 2] = scannedData[i + 2] - cloudBrightness;
    scannedData[i + 3] = scannedData[i + 3];
  }
  scannedImage.data = scannedData;
  weatherCtx.putImageData(scannedImage, 0, 0);
};


})(); //LAST LINE OF WEATHER AND TIME SYSTEM
