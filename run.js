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
  optWidth = 560;
  optHeight = 750;
}

(function setResponsiveSize() {
  relWidth = window.innerWidth / optWidth;
  relHeight = window.innerHeight / optHeight;
})();




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
//DOM ELEMENTS
//----------------------------------------------------------------------------------------------------------//
//SKY DOM
let skyCanvas = document.getElementById("skyCanvas");
let skyCtx = skyCanvas.getContext("2d");
let skyWidth = optWidth * relWidth;
let skyHeight = optHeight * relHeight;
skyCanvas.width = skyWidth;
skyCanvas.height = skyHeight;

//CITY DARK MASK
let cityBlackCanvas = document.getElementById("cityCanvasBlack");
let cityBlackCtx = cityBlackCanvas.getContext("2d");
let cityBlackWidth = optWidth * relWidth;
let cityBlackHeight = optHeight * relHeight;
cityBlackCanvas.width = cityBlackWidth;
cityBlackCanvas.height = cityBlackHeight;

//WEATHER DOM (clouds)
let weatherCanvas = document.getElementById("weather");
let weatherCtx = weatherCanvas.getContext("2d");
let weatherWidth = optWidth * relWidth;
let weatherHeight = optHeight * relHeight;
weatherCanvas.width = weatherWidth;
weatherCanvas.height = weatherHeight;

//RAIN/SNOW canvas
let rainCanvas = document.getElementById("rainCanvas");
let rainCtx = rainCanvas.getContext("2d");
let rainWidth = optWidth * relWidth;
let rainHeight = optHeight * relHeight;
rainCanvas.width = rainWidth;
rainCanvas.height = rainHeight;

//CITY CANVAS MAIN
let cityCanvas2 = document.getElementById("cityCanvasMain");
let cityCtx = cityCanvas2.getContext("2d");
let cityWidth = optWidth * relWidth;
let cityHeight = optHeight * relHeight;
cityCanvas2.width = cityWidth;
cityCanvas2.height = cityHeight;

//SUN AND MOON CANVAS
let sunAndMoonCanvas = document.getElementById("sunAndMoonCanvas");
let sunAndMoonCtx = sunAndMoonCanvas.getContext("2d");
let sunAndMoonWidth = optWidth * relWidth;
let sunAndMoonHeight = optHeight * relHeight;
sunAndMoonCanvas.width = sunAndMoonWidth;
sunAndMoonCanvas.height = sunAndMoonHeight;


//DOM BUTTON ELEMENTS 
//SELECT LOCATION
let pageBody = document.querySelector("body");
let buttonStockholm = document.querySelector("#buttonStockholm");
let buttonKarlshamn = document.querySelector("#buttonKarlshamn");

let locationSelector = document.getElementById("locationSelector")
locationSelector.addEventListener("change", setLocation)

//Runs the event listener 
pageBody.addEventListener("load", setLocation, true);


//DOM TEXT OVERLAY ELEMETS
let weatherLocation = document.getElementById("weatherLocation");
let weatherDay = document.getElementById("weatherDay");
let weatherDescription = document.getElementById("weatherDescription");
let temperature = document.getElementById("temperature");
let windSpeedText = document.getElementById("windSpeedAndDirection");


// Set the location based on selection by user. Selection made by button press. Default city is Stockholm

// ADD https://www.youtube.com/watch?v=Xwq1Hj1DyDM&ab_channel=KirupaChinnathambi
function setLocation (e){
  let locationInputSelect
  if( localStorage.Location === undefined){
    locationInputSelect = "Stockholm"
  } else locationInputSelect = localStorage.Location
 
  let locationInputCountrySelect = "Sweden";
  let selectedLocation = e.target.value;

  if(selectedLocation === "karlshamn") {
   localStorage.setItem("Location", "Karlshamn")
    locationInputSelect = localStorage.Location
    locationInputCountrySelect = "Sweden"
    location.reload()
    
  }

  if(selectedLocation === "stockholm") {
    localStorage.setItem("Location", "Stockholm")
    locationInputSelect = localStorage.Location
    locationInputCountrySelect = "Sweden"
    location.reload()
  } 

  // Set text to the selected location
  locationSelector.options[locationSelector.selectedIndex].textContent = locationInputSelect;


//----------------------------------------------------------------------------------------------------------//
//WEATHER & TIME API // GET DATA
//----------------------------------------------------------------------------------------------------------//
let apiKeyWeather = "ef834ba6b77d78c6f0324aee2e241488";
let locationInput = locationInputSelect;
let locationCountryInput = locationInputCountrySelect;

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
  let currentYear = jsonCurrenTimeandDate.year;
  let currentMonth = Number(jsonCurrenTimeandDate.month);
  let currentDate = jsonCurrenTimeandDate.date.split("-");
  let currentDay = Number(currentDate[2]);

  let currentTime = jsonCurrenTimeandDate.time_24;
  let currentTimeSplit = currentTime.split(":");
  let currentHour = currentTimeSplit[0];
  let currentMinutes = currentTimeSplit[1];
  let lengthOfDay = currentSunSetTimeInMinutes - currentSunRiseTimeInMinutes;


  let currentTimeInMinutes = Number(currentHour) * 60 + Number(currentMinutes);
  // let currentTimeInMinutes = 1400

  console.log(
    "current year " + currentYear,
    "current month: " + currentMonth,
    // "current day " + currentDay,
    "current local time: " + currentTime,
    "current hour: " + currentHour,
    "current miuntes: " + currentMinutes,
    "current time in minutes: " + currentTimeInMinutes
  );


// IS MORNING DAY OR NIGHT
  
let isMorning;
let isDay;
let isNight;

if (currentTimeInMinutes <= currentSunRiseTimeInMinutes) {
 isMorning = true;
 isDay = false;
 isNight = false;
}

if (currentTimeInMinutes > currentSunRiseTimeInMinutes && currentTimeInMinutes < currentSunSetTimeInMinutes ) {
  isMorning = false;
  isDay = true;
  isNight = false;
}

if (currentTimeInMinutes > currentSunSetTimeInMinutes) {
  isMorning = false;
  isDay = false;
  isNight = true;
}

console.log("Is morning? " + isMorning)
console.log("Is day? " + isDay)
console.log("Is Night? " + isNight)

 

  //----------------------------------------------------------------------------------------------------------//
  //LOAD MATERIAL
  //----------------------------------------------------------------------------------------------------------//
  //Load city elements

  const cityImage = new Image();
  const cityBlackImage = new Image();
  // const windows = new Image();

  if (locationInput === "Stockholm") {
    if (currentMonth <= 3) {
      cityImage.src = "Images/Locations/Stockholm/StockholmCityWinterDay.png";
    }
    if (currentMonth > 3 && currentMonth < 9) {
      cityImage.src = "PlaceHolderImagesv1/cityStockholm.png";
    }
    if (currentMonth > 8 && currentMonth < 12) {
      cityImage.src = "PlaceHolderImagesv1/cityStockholmAutumn.png";
    }
    if (currentMonth === 12) {
      cityImage.src = "PlaceHolderImagesv1/cityStockholmWinter.png";
    }

    cityBlackImage.src = "Images/Locations/Stockholm/StockholmCityBlack.png";
    // windows.src = "PlaceHolderImagesv1/windows.png";
  }


  if (locationInput === "Karlshamn") {
    if (currentMonth <= 3) {
      cityImage.src = "PlaceHolderImagesv1/Karlshamn/cityKarlshamnWinter2.png";
    }
    if (currentMonth > 3 && currentMonth < 9) {
      cityImage.src = "PlaceHolderImagesv1/Karlshamn/cityKarlshamnSummer2.png";
    }
    if (currentMonth > 8 && currentMonth < 12) {
      cityImage.src = "PlaceHolderImagesv1/Karlshamn/cityKarlshamnWAutumn2.png";
    }
    if (currentMonth === 12) {
      cityImage.src = "PlaceHolderImagesv1/Karlshamn/cityKarlshamnWinter2.png";
    }

    cityBlackImage.src = "PlaceHolderImagesv1//Karlshamn/cityKarlshamnBlack2.png";
    // windows.src = "PlaceHolderImagesv1/windows.png";
  }

  //Load sky
  const skyImage = new Image();
  skyImage.src = "Images/Sky/skyWinter.png";

  // Load Sun and Moon
  const sunA = new Image();
  sunA.src = "Images/SunAndMoon/sunStorm.png";
  //----------------------------------------------------------------------------------------------------------//
  // WEATHER, DAY AND NIGHT CYCLE, SKY, SEASON IMPLEMENTATION SECTION
  //----------------------------------------------------------------------------------------------------------//
  // MOON CYCLE FUNCTION
  //----------------------------------------------------------------------------------------------------------//
  function getMoonPhase(year, month, day) {
    var daysInYear = (daysInMonth = jd = b = 0);

    if (month < 3) {
      year--;
      month += 12;
    }
    ++month;
    daysInYear = 365.25 * year;
    daysInMonth = 30.6 * month;
    totalDaysInelapse = daysInYear + daysInMonth + day - 694039.09; //jd is total days elapsed
    totalDaysInelapse /= 29.5305882; //divide by the moon cycle
    totalDaysInelapseInteger = parseInt(totalDaysInelapse); //int(jd) -> b, take integer part of jd
    totalDaysInelapse -= totalDaysInelapseInteger; //subtract integer part to leave fractional part of original jd
    totalDaysInelapseInteger = Math.round(totalDaysInelapse * 8); //scale fraction from 0-8 and round
    if (totalDaysInelapseInteger >= 8) {
      totalDaysInelapseInteger = 0; //0 and 8 are the same so turn 8 into 0
    }

    // 0 => New Moon
    // 1 => Waxing Crescent Moon
    // 2 => Quarter Moon
    // 3 => Waxing Gibbous Moon
    // 4 => Full Moon
    // 5 => Waning Gibbous Moon
    // 6 => Last Quarter Moon
    // 7 => Waning Crescent Moon

    return totalDaysInelapseInteger;
  }
  let currentMoonPhase = getMoonPhase(currentYear, currentMonth, currentDay);

  const moonA = new Image();
  if (currentMoonPhase < 3) {
    moonA.src = "PlaceHolderImagesv1/MoonImages/quarterToFull.png";
  }
  if (currentMoonPhase < 5 && currentMoonPhase > 2) {
    moonA.src = "PlaceHolderImagesv1/MoonImages/eigthToFull.png";
  }
  if (currentMoonPhase === 4) {
    moonA.src = "PlaceHolderImagesv1/MoonImages/fullMoon.png";
  }

  if (currentMoonPhase === 5) {
    moonA.src = "PlaceHolderImagesv1/MoonImages/eightFromFull.png";
  }
  if (currentMoonPhase < 8 && currentMoonPhase > 5) {
    moonA.src = "PlaceHolderImagesv1/MoonImages/quarterFromFull.png";
  }

  //----------------------------------------------------------------------------------------------------------//
  // DAY AND NIGHT CYCLES
  //----------------------------------------------------------------------------------------------------------//
  
  function sunAndMoon() {
    // SUNSET AND SUNRISE
    if (
      currentTimeInMinutes > currentSunRiseTimeInMinutes &&
      currentTimeInMinutes < currentSunSetTimeInMinutes
    ) {
      runSun();
     
    } else {
      runMoon();
  
    }
  }

  // SUN CYCLE
  //----------------------------------------------------------------------------------------------------------//

  // SET SUN POSITION
  let sunYPos;
  let sunXPos = mapTo(
    currentTimeInMinutes,
    0 + currentSunRiseTimeInMinutes,
    0 + currentSunRiseTimeInMinutes + lengthOfDay,
    0,
    window.innerWidth
  );
  if (currentTimeInMinutes < 720) {
    sunYPos = mapTo(
      currentTimeInMinutes,
      0 + currentSunRiseTimeInMinutes,
      0 + currentSunRiseTimeInMinutes + lengthOfDay / 2,
      window.innerHeight / 2,
      window.innerHeight / 6
    );
  } else {
    sunYPos = mapTo(
      currentTimeInMinutes,
      0 + currentSunRiseTimeInMinutes + lengthOfDay / 2,
      0 + currentSunRiseTimeInMinutes + lengthOfDay,
      window.innerHeight / 6,
      window.innerHeight / 2
    );
  }
  function runSun() {
    sunAndMoonCtx.drawImage(
      sunA,
      sunXPos * relWidth,
      sunYPos * relHeight,
      100,
      100
    );
   
  }

  // MOON CYCLE
  //----------------------------------------------------------------------------------------------------------//
  // SET MOON POSITION
  let moonYPos;
  let moonXPos;
  if (currentTimeInMinutes < currentSunRiseTimeInMinutes) {
    moonXPos = mapTo(
      currentTimeInMinutes,
      0,
      currentSunRiseTimeInMinutes,
      0,
      window.innerWidth / 2
    );
  } else {
    moonXPos = mapTo(
      currentTimeInMinutes,
      currentSunSetTimeInMinutes,
      1440,
      window.innerWidth / 2,
      window.innerWidth
    );
  }

  if (currentTimeInMinutes < 720) {
    sunYPos = mapTo(
      currentTimeInMinutes,
      0 + currentSunRiseTimeInMinutes,
      0 + currentSunRiseTimeInMinutes + lengthOfDay / 2,
      window.innerHeight / 2,
      window.innerHeight / 6
    );
  } else {
    sunYPos = mapTo(
      currentTimeInMinutes,
      0 + currentSunRiseTimeInMinutes + lengthOfDay / 2,
      0 + currentSunRiseTimeInMinutes + lengthOfDay,
      window.innerHeight / 6,
      window.innerHeight / 2
    );
  }
  function runMoon() {
    sunAndMoonCtx.drawImage(moonA, moonXPos, 150, 100, 100);
  
  }

  //----------------------------------------------------------------------------------------------------------//
  //SKY
  //----------------------------------------------------------------------------------------------------------//
  let skyBrightness;
  function runSky() {
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

    // MAP RGBA TO TIME
    if (currentTimeInMinutes <= 719) {
      skyBrightness = mapTo(
        currentTimeInMinutes,
        currentSunRiseTimeInMinutes,
        719,
        0.3,
        0
      );
    }
    if (currentTimeInMinutes > 719) {
      skyBrightness = mapTo(
        currentTimeInMinutes,
        719,
        currentSunSetTimeInMinutes,
        0,
        0.3
      );
    }

    // MAINPULATE SKY COLOR
    skyCtx.fillStyle = "rgb(0,0,0,"+ skyBrightness +")"
    skyCtx.fillRect(0,0,window.innerWidth, window.innerHeight)
    skyCtx.fill()
  }

  //----------------------------------------------------------------------------------------------------------//
  // CITY FUNCTIONS
  //----------------------------------------------------------------------------------------------------------//

  //DRAW CITY
  function cityDrawMain() {
    cityCtx.drawImage(
      cityImage,
      cityImage.naturalWidth * croptWidthStart,
      0,
      cityImage.naturalWidth * croptWidthEnd,
      cityImage.naturalHeight,
      0,
      cityHeight - 650 * relHeight,
      cityWidth,
      cityHeight - 110 * relHeight
    );
  }

  //DRAW CITY BLACK
  let cityBlackAlpha;

  // MAP ALPHA TO TIME (cityBlackAlpha)


    if (currentTimeInMinutes <= currentSunRiseTimeInMinutes) {
      cityBlackAlpha = mapTo(
        currentTimeInMinutes,
        0,
        currentSunRiseTimeInMinutes,
        0.8,
        0 
      );
    }

    if (currentTimeInMinutes > currentSunRiseTimeInMinutes && currentTimeInMinutes < currentSunSetTimeInMinutes ) {
      cityBlackAlpha = 0
    }

    if (currentTimeInMinutes > currentSunSetTimeInMinutes) {
      cityBlackAlpha = mapTo(
        currentTimeInMinutes,
        currentSunSetTimeInMinutes,
        1440,
        0,
        0.8
      );
    }

  cityBlackCtx.globalAlpha = cityBlackAlpha;

  function cityBlackDraw() {
    cityBlackCtx.drawImage(
      cityBlackImage,
      cityBlackImage.naturalWidth * croptWidthStart,
      0,
      cityBlackImage.naturalWidth * croptWidthEnd,
      cityBlackImage.naturalHeight,
      0,
      cityBlackHeight - 650 * relHeight,
      cityBlackWidth,
      cityBlackHeight - 110 * relHeight
    );
  }

  //----------------------------------------------------------------------------------------------------------//
  // WEATHER APPLICATION SECTION 
  //----------------------------------------------------------------------------------------------------------//

  // SET IF TO DISPLAY CURRENT WEATHER OR FORCAST
  let buttonCurrentWeather = document.querySelector("#buttonCurrentWeather");
  let buttonTomorrowWeather = document.querySelector("#buttonTomorrowWeather");

  let forcastSelector = document.getElementById("forcastSelector")
 buttonCurrentWeather.addEventListener("click", setForecastorCurrent)
 buttonTomorrowWeather.addEventListener("click", setForecastorCurrent)
 
  buttonCurrentWeather.click()
 
forcastSelector.addEventListener("change", setForecastorCurrent)

  function setForecastorCurrent (e){
    let weatherSelectText = "Today"
    let selectedWeatherDescription;
    let selectedTemp;
    let selectedWinddirection;
    let selectedWindSpeed;
    let selectedItemForcast = e.target.value;
    let clickedItemForcast = e.target.id;
    let weatherId = currentWeatherId;        

       
          //Set weather id to current
      if(selectedItemForcast === "today" || clickedItemForcast === "buttonCurrentWeather") {
      
      weatherId = currentWeatherId;
      weatherSelectText = "Today";
      selectedWeatherDescription = currentWeatherDescription;
      selectedTemp = currentTemperatureInCelsius;
      selectedWinddirection = currentWindDirectionDegrees;
      selectedWindSpeed = currentWindSpeedMs;
      currentTimeInMinutes = Number(currentHour) * 60 + Number(currentMinutes); //reset time
    }

            //Set weather id to tomorrow at 12.00

    if(selectedItemForcast === "tomorrowAt12") {
  
      weatherId = forecast_Plus1D_At_1200_WeatherId
      weatherSelectText = "Tomorrow at 12.00";
      selectedWeatherDescription = forecast_Plus1D_At_1200_Description;
      selectedTemp = forecast_Plus1D_At_1200_TemperatureInCelsius;
      selectedWinddirection = forecast_Plus1D_At_1200_DirectionDegrees;
      selectedWindSpeed = forecast_Plus1D_At_1200_WindSpeed;    
      currentTimeInMinutes = 720 //Sets the time to 12.00
    } 
  
    weatherLocation.textContent = locationInputSelect
    weatherDescription.textContent = selectedWeatherDescription;
    temperature.textContent = selectedTemp + " °C"
    weatherDay.textContent = "Weather " + weatherSelectText;
    windSpeedText.textContent = "Wind speed " + selectedWindSpeed + " m/s"


  // WIND VARIABELS
  let windDirection = currentWindDirectionDegrees;
  let windSpeed = currentWindSpeedMs;
  let xSpeedByWindSpeed;
 

  // WIND SETUP
  //Set cloud/rain/snow movement direction from wind degree direction.
  if (windDirection < 181) {
    windDirection = -1;
  } else {
    windDirection = +1;
  }
  //Set cloud speed based on windSpeed

  console.log(windSpeed)
 if(windSpeed <=3){
  xSpeedByWindSpeed = 0.1;
 }
  if (windSpeed > 3) {
    xSpeedByWindSpeed = 0.3;
  }
  if (windSpeed > 7) {
    xSpeedByWindSpeed = 0.5;
  } 


  //Load weather images (clouds)
  //Call cloud images and set image to var
  let cloudImage = new Image();
  let cloudImg;

  //Cloud variabels  for types of weather
  let clouds = [];
  let numberOfClouds;
  let cloudSizeMuliply;

  //Rain variabels for types of weather
  let numberOfRainDrops;
  let numberOfSnowFlakes;

  //WEATHER TYPES
  //----------------------------------------------------------------------------------------------------------//
  //SET WEATHER VARS BASED ON WEATHER ID
  // https://openweathermap.org/weather-conditions

   //ID 500- 531 Rain
  //----------------------------------------------------------------------------------------------------------//
  // 500 - Light Rain
  if (weatherId === 500) {
    //Clouds
    xSpeedByWindSpeed = xSpeedByWindSpeed * windDirection;
    numberOfClouds = 50;
    cloudSizeMuliply = 5;
    setCloudBrightness = 50;
     //Clouds
     cloudImage.src = "Images/Clouds/stormcloudBright1.png";
     cloudImg = cloudImage;
     //Rain 
    numberOfRainDrops = 100;
  }

  // 501 - Moderate Rain
  if (weatherId === 501) {
    //Clouds
    xSpeedByWindSpeed = xSpeedByWindSpeed * windDirection;
    numberOfClouds = 50;
    cloudSizeMuliply = 5;
    setCloudBrightness = 50;
     //Clouds
     cloudImage.src = "Images/Clouds/stormcloudBright1.png";
     cloudImg = cloudImage;
     //Rain 
    numberOfRainDrops = 200;
  }

   // 502 - heavy intensity rain
   if (weatherId === 501) {
    //Clouds
    xSpeedByWindSpeed = xSpeedByWindSpeed * windDirection;
    numberOfClouds = 50;
    cloudSizeMuliply = 5;
    setCloudBrightness = 50;
     //Clouds
     cloudImage.src = "Images/Clouds/stormcloudBright1.png";
     cloudImg = cloudImage;
     //Rain 
    numberOfRainDrops = 300;
  }

   //ID 600- 622 SNOW
  //----------------------------------------------------------------------------------------------------------//
   // 600 - Light Snow
   if (weatherId === 600) {
    //Clouds
    xSpeedByWindSpeed = xSpeedByWindSpeed * windDirection;
    numberOfClouds = 50;
    cloudSizeMuliply = 5;
    setCloudBrightness = 50;
     //Clouds
     cloudImage.src = "Images/Clouds/stormcloudBright1.png";
     cloudImg = cloudImage;
     //Snow 
    numberOfSnowFlakes = 50;
  }

     // 601 - Snow
     if (weatherId === 601) {
      //Clouds
      xSpeedByWindSpeed = xSpeedByWindSpeed * windDirection;
      numberOfClouds = 50;
      cloudSizeMuliply = 3;
      setCloudBrightness = 10;
       //Clouds
       cloudImage.src = "Images/Clouds/stormcloudBright1.png";
       cloudImg = cloudImage;
       //Snow 
      numberOfSnowFlakes = 200;
    }

   // 615 Light Snow and Rain
   if (weatherId === 615) {
    //Clouds
    xSpeedByWindSpeed = xSpeedByWindSpeed * windDirection;
    numberOfClouds = 50;
    cloudSizeMuliply = 5;
    setCloudBrightness = 50;
     //Clouds
     cloudImage.src = "Images/Clouds/stormcloudBright1.png";
     cloudImg = cloudImage;
     //Rain 
    numberOfRainDrops = 50;
     //Snow 
    numberOfSnowFlakes = 50;
  }


  //ID 800- 804
  //----------------------------------------------------------------------------------------------------------//
   // 800 - Clear

   if (weatherId === 800) {
    //Clouds
    xSpeedByWindSpeed = xSpeedByWindSpeed * windDirection;
    numberOfClouds = 1;
    cloudSizeMuliply = 2.5;
    setCloudBrightness = 0;
    //Clouds
    cloudImage.src = "Images/Clouds/cloudWhite1.png";
   cloudImg = cloudImage;
  }

  // 801 - Few clouds
  if (weatherId === 801) {
    //Clouds
    xSpeedByWindSpeed = xSpeedByWindSpeed * windDirection;
    numberOfClouds = 5;
    cloudSizeMuliply = 2.5;
    setCloudBrightness = 0;
    //Clouds
    cloudImage.src = "Images/Clouds/cloudWhite1.png";
   cloudImg = cloudImage;
  }
  // 802
  if (weatherId === 802) {
    //Clouds
    xSpeedByWindSpeed = xSpeedByWindSpeed * windDirection;
    numberOfClouds =  13;
    cloudSizeMuliply = 2.5;
    setCloudBrightness = 15;
    //Clouds
    cloudImage.src = "Images/Clouds/cloudWhite1.png";
   cloudImg = cloudImage;
  }
   // 803
   if (weatherId === 803) {
    //Clouds
    xSpeedByWindSpeed = xSpeedByWindSpeed * windDirection;
    numberOfClouds = 35;
    cloudSizeMuliply = 3.5;
    setCloudBrightness = 25;
    //Clouds
    cloudImage.src = "Images/Clouds/cloudWhite1.png";
   cloudImg = cloudImage;
  }
  // 804
  if (weatherId === 804) {
    //Clouds
    xSpeedByWindSpeed = xSpeedByWindSpeed * windDirection;

    numberOfClouds = 50;
    cloudSizeMuliply = 5;
    setCloudBrightness = 50;
     //Clouds
     cloudImage.src = "Images/Clouds/stormcloudBright1.png";
     cloudImg = cloudImage;
  }


  // CLOUDS FUNCTIONS
  //----------------------------------------------------------------------------------------------------------//

  //Cloud object constructor
  function CloudObject(
    cloudImage,
    xPos,
    yPos,
    xSpeed,
    cloudWidth,
    cloudHeight
  ) {
    this.cloudImage = cloudImage;
    this.xPos = xPos;
    this.yPos = yPos;
    this.xSpeed = xSpeed;
    this.cloudWidth = cloudWidth;
    this.cloudHeight = cloudHeight;
    this.createCloud = function () {
      weatherCtx.drawImage(
        this.cloudImage,
        this.xPos,
        this.yPos,
        this.cloudWidth,
        this.cloudHeight
      );
    };
  }



  //Clouds initialize/setup
  for (let i = 0; i < numberOfClouds; i++) {
    let xPos = randomInt(0 - 1000, window.innerWidth + 1000);
    let yPos = randomInt(100, 300);
    let width = randomInt(150, 200);
    let height = randomInt(50, 150);
    clouds[i] = new CloudObject(
      cloudImg,
      xPos * relWidth,
      yPos * relHeight,
      xSpeedByWindSpeed,
      width * cloudSizeMuliply * relWidth,
      height * cloudSizeMuliply * relHeight
    );
  }


  //Cloud global alpha. Map cloudAlpha to time 
let cloudAlpha;

  if (currentTimeInMinutes <= currentSunRiseTimeInMinutes) {
    cloudAlpha = mapTo(
      currentTimeInMinutes,
      0,
      currentSunRiseTimeInMinutes,
      0,
      0.5 
    );
  }

  if (currentTimeInMinutes > currentSunRiseTimeInMinutes && currentTimeInMinutes < currentSunSetTimeInMinutes ) {
    cloudAlpha = 0.5
  }

  if (currentTimeInMinutes > currentSunSetTimeInMinutes) {
    cloudAlpha = mapTo(
      currentTimeInMinutes,
      currentSunSetTimeInMinutes,
      1440,
      0.5,
      0
    );
  }

  weatherCtx.globalAlpha = cloudAlpha;

  //Clouds run function
  function cloudRun() {
    for (let i = 0; i < clouds.length; i++) {
      clouds[i].xPos = clouds[i].xPos + clouds[i].xSpeed;
      if (clouds[i].xPos > window.innerWidth + 400 && xSpeedByWindSpeed > 0) {
        clouds[i].xPos = randomInt(-200, -800);
      }
      if (clouds[i].xPos < 0 - 400 && xSpeedByWindSpeed < 0) {
        clouds[i].xPos = window.innerWidth + randomInt(200, 800);
      }
      clouds[i].createCloud();
    }
  }



  //RAIN
  //----------------------------------------------------------------------------------------------------------//
  let particlesArray = [];
  const numberOfParticles = numberOfRainDrops;
  

  let dropImage = new Image();
  if(isMorning === true){
    dropImage.src = "PlaceHolderImagesv1/dropNight.png"
  }
  if(isDay === true){
    dropImage.src = "PlaceHolderImagesv1/drop.png"
  }
  if(isNight === true){
    dropImage.src = "PlaceHolderImagesv1/dropNight.png"
  }
  
  
  
  rainCtx.globalAlpha = 1
  
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 7 + 1;
      this.weight = Math.random() * 2 + 3;
      this.directionX = Math.random() *  xSpeedByWindSpeed * 2; // insert wind direction
      this.r =  Math.random() * 255
      this.g = Math.random() * 255
      this.b = Math.random() * 255
  
    }
    update() {
      if (this.y > rainCanvas.height) {
        this.y = 0 - this.size;
        this.weight = Math.random() * 2 + 3;
        this.x = Math.random() * rainCanvas.width * 1.3;
      }
      this.weight += 0.01;
      this.y += this.weight;
      this.x += this.directionX;
  
    }
    draw() {
      rainCtx.drawImage(dropImage, this.x, this.y, this.size, this.size*2)
    }
  }
  
  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * rainCanvas.width;
        const y = Math.random() * rainCanvas.height;
        particlesArray.push(new Particle(x ,y))
    }
  }
  
  init();
//RAIN END  




//SNOW
  //----------------------------------------------------------------------------------------------------------//
  let snowParticlesArray = [];
  const numberOfSnowParticles = numberOfSnowFlakes;
  

  let snowImage = new Image();
  if(isMorning === true){
    snowImage.src = "PlaceHolderImagesv1/snowflakes.png"
  }
  if(isDay === true){
    snowImage.src = "PlaceHolderImagesv1/snowflakes.png"
  }
  if(isNight === true){
    snowImage.src = "PlaceHolderImagesv1/snowflakes.png"
  }
  
    
  class SnowParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 2;
      this.weight = Math.random() * 0.1 + 0.15;
      this.directionX = Math.random() *  xSpeedByWindSpeed * 2; // insert wind direction
      this.r =  Math.random() * 255
      this.g = Math.random() * 255
      this.b = Math.random() * 255
  
    }
    updateSnow() {
      if (this.y > rainCanvas.height) {
        this.y = 0 - this.size -50;
        this.weight = Math.random() * 0.1 + 0.15;
        this.x = Math.random() * rainCanvas.width * 1.3;
      }
      this.weight += 0.004;
      this.y += this.weight;
      this.x += this.directionX;
  
    }
    drawSnow() {
      rainCtx.drawImage(snowImage, this.x, this.y, this.size, this.size*2)
    }
  }
  
  function initSnow() {
    for (let i = 0; i < numberOfSnowParticles; i++) {
        const x = Math.random() * rainCanvas.width;
        const y = Math.random() * rainCanvas.height;
        snowParticlesArray.push(new SnowParticle(x ,y))
    }
  }
  
  initSnow();
//SNOW END  


  //----------------------------------------------------------------------------------------------------------//
  //SETUP
  //----------------------------------------------------------------------------------------------------------//

  //----------------------------------------------------------------------------------------------------------//
  //UPDATE / DRAW / ANIMATE
  //----------------------------------------------------------------------------------------------------------//
  (function update() {

    weatherCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    sunAndMoonCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    cityCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    cityBlackCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    rainCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    skyCtx.clearRect(0,0, window.innerWidth, window.innerHeight)

    //RUN SKY
    sunAndMoon();
    runSky();

    //RUN WEATHER
    cloudRun();
   
    //RUN CITY
    cityDrawMain();
    cityBlackDraw();

     // RUN RAIN
     for(let i = 0; i < particlesArray.length; i++){
      particlesArray[i].update();
      particlesArray[i].draw();
    }
     // RUN SNOW
     for(let i = 0; i <
       snowParticlesArray.length; i++){
      snowParticlesArray[i].updateSnow();
      snowParticlesArray[i].drawSnow();
     }
 
    requestAnimationFrame(update);
  })();
} // LAST LINE SET FORECAST TRUE OR FALSE

})(); //LAST LINE OF WEATHER AND TIME SYSTEM
} // LAST LINE SET LOCATION
