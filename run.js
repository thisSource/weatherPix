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


//CITY DARK MASK
let cityBlackCanvas = document.getElementById("cityCanvasBlack");
let cityBlackCtx = cityBlackCanvas.getContext("2d");
let cityBlackWidth = optWidth * relWidth;
let cityBlackHeight = optHeight * relHeight;
cityBlackCanvas.width = cityBlackWidth;
cityBlackCanvas.height = cityBlackHeight;

//WEATHER DOM
let weatherCanvas = document.getElementById("weather");
let weatherCtx = weatherCanvas.getContext("2d");
let weatherWidth = optWidth * relWidth;
let weatherHeight = optHeight * relHeight;
weatherCanvas.width = weatherWidth;
weatherCanvas.height = weatherHeight;

//CITY CANVAS MAIN
let cityCanvas2 = document.getElementById("cityCanvasMain")
let city2Ctx = cityCanvas2.getContext("2d")
let cityWidth = optWidth * relWidth;
let cityHeight = optHeight * relHeight;
cityCanvas2.width = cityWidth
cityCanvas2.height = cityHeight



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
const locationInput = "Stockholm";
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
  let currentTimeInMinutes = Number(currentHour) * 60 + Number(currentMinutes);
  //let currentTimeInMinutes = 1400;

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
  //Load city elements

  const cityImage = new Image();
  const cityBlackImage = new Image();
  // const windows = new Image();

  if (locationInput === "Stockholm") {
    cityImage.src = "PlaceHolderImagesv1/cityStockholm.png";
    cityBlackImage.src = "PlaceHolderImagesv1/cityStockholmBlack.png";
    // windows.src = "PlaceHolderImagesv1/windows.png";
  }

  //Load sky
  const skyImage = new Image();
  skyImage.src = "PlaceHolderImagesv1/sky.png";

  //Load weather images

  //Call cloud images and set image to var
  let cloudImage = new Image();
  cloudImage.src = "PlaceHolderImagesv1/cloud.png";
  let cloudImg = cloudImage;

  const sunA = new Image();
  sunA.src = "PlaceHolderImagesv1/sun.png";

  //----------------------------------------------------------------------------------------------------------//
  // FUNCTION COLLECTION
  //----------------------------------------------------------------------------------------------------------//

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
    const scannedImage = skyCtx.getImageData(0, 0, skyWidth, skyHeight);
    const scannedData = scannedImage.data;

    // MAP RGB TO TIME
    if (currentTimeInMinutes <= 719) {
      skyBrightness = mapTo(currentTimeInMinutes, 0, 719, 230, 0);
    }
    if (currentTimeInMinutes > 719) {
      skyBrightness = mapTo(currentTimeInMinutes, 719, 1440, 0, 230);
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
    return skyBrightness
  }

  //----------------------------------------------------------------------------------------------------------//
  // CITY FUNCTIONS
  //----------------------------------------------------------------------------------------------------------//


  function cityDrawMain() {
  
    city2Ctx.drawImage(cityImage,
    cityImage.naturalWidth * croptWidthStart,
    0,
    cityImage.naturalWidth * croptWidthEnd,
    cityImage.naturalHeight,
    0,
    cityHeight - 550 * relHeight,
    cityWidth,
    cityHeight - 100 * relHeight)
  }

  //DRAW CITY
 
  let cityBlackAlpha;

  function cityBlackDraw() {
    
    cityBlackCtx.drawImage(
      cityBlackImage,
      cityBlackImage.naturalWidth * croptWidthStart,
      0,
      cityBlackImage.naturalWidth * croptWidthEnd,
      cityBlackImage.naturalHeight,
      0,
      cityBlackHeight - 550 * relHeight,
      cityBlackWidth,
      cityBlackHeight - 100 * relHeight
    );

    const scannedImageBlack = cityBlackCtx.getImageData(
      0,
      0,
      cityBlackWidth,
      cityBlackHeight
    );
    const scannedDataBlack = scannedImageBlack.data;
    // MAP RGB TO TIME
    if (currentTimeInMinutes <= 719) {
      cityBlackAlpha = mapTo(currentTimeInMinutes, 0, 719, 0, 230);
    }
    if (currentTimeInMinutes > 719) {
      cityBlackAlpha = mapTo(currentTimeInMinutes, 719, 1440, 230, 0);
    }
    console.log(cityBlackAlpha);
    // MAINPULATE SKY COLOR HERE
    for (let i = 0; i < scannedDataBlack.length; i += 4) {
      scannedDataBlack[i + 0] = scannedDataBlack[i + 0];
      scannedDataBlack[i + 1] = scannedDataBlack[i + 1];
      scannedDataBlack[i + 2] = scannedDataBlack[i + 2];
      scannedDataBlack[i + 3] = scannedDataBlack[i + 3] - cityBlackAlpha;
    }
    scannedImageBlack.data = scannedDataBlack;
    cityBlackCtx.putImageData(scannedImageBlack, 0, 0);
  }

  //----------------------------------------------------------------------------------------------------------//
  // WEATHER FUNCTIONS
  //----------------------------------------------------------------------------------------------------------//

  //let weatherId = currentWeatherId;
  let weatherId = 801;

  let windDirection = currentWindDirectionDegrees;
  let windSpeed = currentWindSpeedMs;
  console.log(currentWeatherId);
  // WEATHER VARIABELS

  let xSpeedByWindSpeed;
  let clouds = [];
  let numberOfClouds;
  let cloudSizeMuliply;
  let setCloudBrightness;

  //WEATHER TYPES
  //----------------------------------------------------------------------------------------------------------//
  //SET WEATHER VARS BASED ON WEATHER ID
  // https://openweathermap.org/weather-conditions

  // 801
  if (weatherId === 801) {
    //Clouds
    xSpeedByWindSpeed = 1 * windDirection;
    numberOfClouds = 5;
    cloudSizeMuliply = 1.5;
    setCloudBrightness = 0;
  }
  // 804
  if (weatherId === 804) {
    //Clouds
    xSpeedByWindSpeed = 1 * windDirection;
    numberOfClouds = 50;
    cloudSizeMuliply = 5;
    setCloudBrightness = 50;
  }

  // SUN FUNCTION
  //----------------------------------------------------------------------------------------------------------//
  function placeHolderSun() {
    weatherCtx.drawImage(
      sunA,
      100,
      150,
      100,
      100
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
  // function cloudsUpdate (){
  //   return cloudPosX = 100;
  //   return cloudSpeedX = 0.5;
  // }

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

  // Cloud SETUP

  //Set cloud movement direction from wind degree direction.
  if (windDirection < 181) {
    windDirection = -1;
  } else {
    windDirection = +1;
  }

  //Set cloud speed based on windSpeed

  if (windSpeed > 3) {
    xSpeedByWindSpeed = 2;
  }
  if (windSpeed > 7) {
    xSpeedByWindSpeed = 3;
  } else {
    xSpeedByWindSpeed = 1;
  }

  //Clouds initialize/setup
  for (let i = 0; i < numberOfClouds; i++) {
    let xPos = randomInt(0 - 1000, window.innerWidth + 1000);
    let yPos = randomInt(-50, 200);
    let width = randomInt(100, 200);
    let height = randomInt(50, 100);
    clouds[i] = new CloudObject(cloudImg, xPos*relWidth, yPos*relHeight, xSpeedByWindSpeed, width * cloudSizeMuliply * relWidth, height * cloudSizeMuliply * relHeight);
  }

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

  //Set cloud color
  function cloudColor() {
    let cloudBrightness = setCloudBrightness;

    const scannedCloudImage = weatherCtx.getImageData(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
    const scannedDataCloud = scannedCloudImage.data;

    // MAINPULATE SKY COLOR HERE
    for (let i = 0; i < scannedDataCloud.length; i += 4) {
      scannedDataCloud[i + 0] = scannedDataCloud[i + 0] - cloudBrightness - skyBrightness/1.2;
      scannedDataCloud[i + 1] = scannedDataCloud[i + 1] - cloudBrightness - skyBrightness/1.2;
      scannedDataCloud[i + 2] = scannedDataCloud[i + 2] - cloudBrightness - skyBrightness/1.2;
      scannedDataCloud[i + 3] = scannedDataCloud[i + 3];
    }
    scannedCloudImage.data = scannedDataCloud;
    weatherCtx.putImageData(scannedCloudImage, 0, 0);
  }


  

  //----------------------------------------------------------------------------------------------------------//
  //SETUP
  //----------------------------------------------------------------------------------------------------------//
 
  //----------------------------------------------------------------------------------------------------------//
  //UPDATE / DRAW / ANIMATE
  //----------------------------------------------------------------------------------------------------------//
  (function update() {
    weatherCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    //RUN SKY
    runSky();
    //RUN WEATHER
    placeHolderSun();

   cloudRun();
    cloudColor();
    //RUN CITY
    cityDrawMain();
    cityBlackDraw();

    requestAnimationFrame(update);
  })();

   
})(); //LAST LINE OF WEATHER AND TIME SYSTEM
