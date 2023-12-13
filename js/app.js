import {
  formatRecentSearchText,
  secondsToReadableTimeShift,
  getWindDirectionContext,
  metresToKilometres,
  convertMetersPerSecondToMilesPerHour,
  capitaliseFirstCharacter,
} from './utils.js';

const apiKey = '0e8f67bf6ac0e37689d7edea5f37f808';
const iconBaseURL = 'https://openweathermap.org/img/w/';
const geocoderBaseURL = `https://api.openweathermap.org/geo/1.0/direct?appid=${apiKey}&limit=1&q=`;
const MAX_NUM_OF_RECENTS = 8;

// Grab HTML elements
const weatherEl = document.querySelector('.weather');
const formEl = document.querySelector('form');
const searchHistoryEl = document.querySelector('.search-history');

// Initialise an array to help with local storage logic
let recentSearches = [];

// Initialise a globally accessible timer variable
let timer;

// Sets the height of every temperature element in forecast breakdown
// relative to its parent div, based on the min and max temp for that day
function setTempHeight() {
  // Loop through every day tab
  document.querySelectorAll('.day-tab').forEach((dayTab) => {
    // Get the day of the month
    const dayOfMonth = dayTab.id.split('-')[1];

    // Get the max and min temperature
    const max = Number(
      dayTab.querySelector('.max').textContent.match(/-?\d+/)[0]
    );
    const min = Number(
      dayTab.querySelector('.min').textContent.match(/-?\d+/)[0]
    );

    // For this day, find the breakdown to target
    const breakdownElToTarget = document.getElementById(
      `breakdown-${dayOfMonth}`
    );
    // As last hour is descriptive, need logic to help break from last iteration
    const maxLoops =
      breakdownElToTarget.querySelectorAll('.hour').length - 1;

    // Loop through every 'hour' element in breakdown
    breakdownElToTarget
      .querySelectorAll('.hour')
      .forEach((hourEl, index) => {
        if (index === maxLoops) {
          return;
        }

        // Target the temp paragraph
        const paraToTarget = hourEl.querySelector('.temp p');
        const temp = Number(
          paraToTarget.textContent.match(/-?\d+/)[0]
        );

        let percentage;
        if (max === min) {
          percentage = 50;
        } else {
          percentage = Math.round(((temp - min) / (max - min)) * 100);
        }

        // As I want the height to be between 25% and 75% from the bottom
        // of the parent div, this logic helps achieve this
        const heightPercentage = percentage / 2 + 25;

        // console.log(
        //   `temp: ${temp}, percentage: ${percentage}, height: ${height}`
        // );

        paraToTarget.style.bottom = `${heightPercentage}%`;
      });
  });
}

// Clears forecast HTML and provides feedback when user
// puts in a search term that the API doesn't recognise
function noResultsFound() {
  weatherEl.innerHTML = '';

  const feedbackEl = document.createElement('div');
  feedbackEl.classList.add('feedback');
  feedbackEl.textContent = 'No results found. Please try again!';
  weatherEl.appendChild(feedbackEl);
  // document.querySelector('.search').select(); // not mobile-friendly
}

// Inject the current weather section using the first forecast object
function showCurrentWeather(weatherObj) {
  const sunrise = moment
    .unix(weatherObj.sunrise)
    .utcOffset(weatherObj.timezone / 60)
    .format('HH:mm');
  const sunset = moment
    .unix(weatherObj.sunset)
    .utcOffset(weatherObj.timezone / 60)
    .format('HH:mm');

  const currentEl = document.createElement('section');
  currentEl.classList.add('current');

  currentEl.innerHTML = `
  <div class="overview column">
    <h1>Now</h1>
    <p class="temp">${Math.round(weatherObj.temp)}°C</p>
    <p>${capitaliseFirstCharacter(weatherObj.description)}.</p>
    <p>Feels like: ${Math.round(weatherObj.feelsLike)}°C</p>
    <p>Wind: 
      ${Math.round(weatherObj.windSpeed)} mph&nbsp;
      <i 
        class="fas fa-long-arrow-alt-down"
        style="transform: rotate(${weatherObj.windDirection}deg);
        -webkit-transform: rotate(${weatherObj.windDirection}deg);
        font-size: 1.1rem"
      ></i>&nbsp;
    from ${getWindDirectionContext(weatherObj.windDirection)}</p>
    <img
      src="${iconBaseURL + weatherObj.icon + '.png'}"
      width="80px"
      height="80px"
      alt="${weatherObj.description}"
    />
  </div>

  <table>
    <tr>
      <td><strong>Current time:</strong></td>
      <td id="clock"></td>
    </tr>
    <tr>
      <td><strong>Visibility:</strong></td>
      <td>${metresToKilometres(weatherObj.visibility)} km</td>
    </tr>
    <tr>
      <td><strong>Humidity:</strong></td>
      <td>${Math.round(weatherObj.humidity)}%</td>
    </tr>
    <tr>
      <td><strong>Sunrise:</strong></td>
      <td>${sunrise}</td>
    </tr>
    <tr>
      <td><strong>Sunset:</strong></td>
      <td>${sunset}</td>
    </tr>
  </table>

  <div id="map" style="width:300px; height:200px;" class="map"></div>
  `;
  // <tr>
  //   <td><strong>Pressure</strong></td>
  //   <td>${Math.round(weatherObj.pressure)} hPa</td>
  // </tr>

  weatherEl.appendChild(currentEl);

  // Work out the UTC offset, in minutes, of the forecast timestamp
  const timestamp = moment.unix(weatherObj.timestamp);
  const timezoneOffset = timestamp
    .utcOffset(weatherObj.timezone / 60)
    .utcOffset();

  // Clear previous timer, if there was one
  clearInterval(timer);

  // Handles showing the formatted time in clock element
  const updateClock = function () {
    const currentTime = moment().utcOffset(timezoneOffset);
    const timeString = currentTime.format('D MMM YYYY, HH:mm:ss');
    const clockEl = document.getElementById('clock');
    if (clockEl) {
      clockEl.textContent = timeString;
    }
  };

  // Start the timer, which runs updateClock every second
  updateClock();
  timer = setInterval(updateClock, 1000);

  // Creating map options
  const { lat, lon } = weatherObj;
  const mapOptions = {
    center: [lat, lon],
    zoom: 6,
  };

  // Creating a map object
  const map = new L.map('map', mapOptions);

  // Creating a Layer object
  const layer = new L.TileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 15,
      minZoom: 3,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }
  );

  // Adding layer to the map
  map.addLayer(layer);

  const marker = new L.marker([lat, lon]);
  marker.addTo(map);
}

// Update recentSearches array with successful search, and use it to update local storage
function updateRecentSearches(newSuccessfulSearch, countryCode) {
  const searchKey = `${newSuccessfulSearch.toLowerCase()},${countryCode.toLowerCase()}`;

  // Check to see if search already exists - if it does, remove it from recent searches
  const searchExists = recentSearches.includes(searchKey);

  if (searchExists) {
    recentSearches = recentSearches.filter(
      (search) => search != searchKey
    );
  }
  // const index = recentSearches.indexOf(searchKey);
  // if (index !== -1) {
  //   recentSearches.splice(index, 1);
  // }

  // Add this new search to the beginning of list
  recentSearches.unshift(searchKey);

  // If length of recent searches exceeds max, remove 'oldest' search
  if (recentSearches.length > MAX_NUM_OF_RECENTS) {
    recentSearches.pop();
  }

  // Now update local storage
  localStorage.setItem(
    'weather_search_history',
    JSON.stringify(recentSearches)
  );

  // Finally render the recent searches list on the page correctly
  renderRecentSearches();
}

// Handles the switching of days in the forecast
function switchDayInForecast(tabElement) {
  if (tabElement.classList.contains('selected')) {
    return;
  }

  // get the day of month from the tab id
  const dayOfMonth = tabElement.id.split('-')[1];

  // globally remove the 'selected' class from every tab and hide every description
  document.querySelectorAll('.day-tab').forEach((tab) => {
    tab.classList.remove('selected');
    tab.querySelector('.tab-description').classList.add('hide');
  });

  // expand the appropriate tab and 'unhide' its description
  tabElement.classList.add('selected');
  tabElement
    .querySelector('.tab-description')
    .classList.remove('hide');

  // globally hide all breakdowns
  document
    .querySelectorAll('.day-breakdown')
    .forEach((dayBreakdown) => {
      dayBreakdown.classList.add('hide');
    });
  // show the breakdown corresponding to the day of month
  const breakdownToDisplay = document.getElementById(
    `breakdown-${dayOfMonth}`
  );
  if (breakdownToDisplay) {
    breakdownToDisplay.classList.remove('hide');
  }
}

// Handles the bulk of the logic for showing the weather, given an object containing weather details
function showWeather(weatherDetails) {
  // Clear the old html
  weatherEl.innerHTML = '';

  const headerEl = document.createElement('h2');
  headerEl.classList.add('city-name');
  headerEl.innerHTML = `
    Weather conditions for <span class="location">${weatherDetails.name}, ${weatherDetails.countryCode}</span>
  `;

  weatherEl.appendChild(headerEl);

  showCurrentWeather(weatherDetails.forecasts[0]);

  // Generate an array, days, that includes all days to be covered in forecast (e.g. 28, 29, 30, 31, 1, 2)
  // the ... is a spread operator used to convert the set object into an array
  const days = [
    ...new Set(
      weatherDetails.forecasts.map((forecast) => forecast.dayMonth)
    ),
  ];

  const forecastEl = document.createElement('section');
  forecastEl.classList.add('forecast', 'column');
  forecastEl.innerHTML = `
    <h1 id="forecast-header">${days.length} Day Forecast</h1>
  `;
  weatherEl.appendChild(forecastEl);

  // this is a pointer variable needed for css stuff
  let start = days[0];

  // Create the days element that will hold all tabs and append it to forecast element
  const tabsEl = document.createElement('div');
  tabsEl.classList.add('row', 'days');
  forecastEl.appendChild(tabsEl);

  // For every day in days, do stuff
  for (let i = 0; i < days.length; i++) {
    // Filter weatherDetails to include forecasts for this day
    const thisDaysForecasts = weatherDetails.forecasts.filter(
      (forecast) => forecast.dayMonth === days[i]
    );

    // Checks to make on first iteration due to quirks of first day
    if (i === 0) {
      // If length is 1, then skip to next day as no point in repeating this NOW forecast
      if (thisDaysForecasts.length === 1) {
        // adjust pointer variable
        start = days[1];

        // also need to correct the number of days in the forecast header
        document.querySelector('#forecast-header').textContent = `${
          days.length - 1
        } Day Forecast`;
        continue;
      }
      // If length is 9, which can happen with some timezones, then just take
      // out the first NOW forecast as it doesn't give much value
      if (thisDaysForecasts.length > 8) {
        thisDaysForecasts.shift();
      }
    }

    const thisDaysMoment = moment
      .unix(thisDaysForecasts[0].timestamp)
      .utcOffset(weatherDetails.timezone / 60);

    // const thisDaysMoment = moment(thisDaysForecasts[0].unix, 'X');

    // Start to build an object for this day, starting with date stuff
    const thisDay = {
      dateDay: Number(thisDaysMoment.format('D')),
      dateShort: thisDaysMoment.format('ddd D'),
      dateLong: thisDaysMoment.format('dddd D MMMM'),
    };

    /* Now some logic to ensure that the selected icon and corresponding description
       is for the 5th time block (e.g. for UK, the 5th time block is 12:00)
       or if not possible, then select either the latest time block for the first day
       or the earliest time block for the last day. */

    // First day logic
    if (i === 0) {
      // If the first day is the USER'S current day, then show 'Today' in day tab
      if (thisDay.dateDay == moment().format('D')) {
        thisDay.dateShort = 'Today';
      }
      switch (true) {
        case thisDaysForecasts.length === 8:
          thisDay.icon = thisDaysForecasts[4].icon;
          thisDay.description = thisDaysForecasts[4].description;
          break;
        case thisDaysForecasts.length === 7:
          thisDay.icon = thisDaysForecasts[3].icon;
          thisDay.description = thisDaysForecasts[3].description;
          break;
        case thisDaysForecasts.length === 6:
          thisDay.icon = thisDaysForecasts[2].icon;
          thisDay.description = thisDaysForecasts[2].description;
          break;
        case thisDaysForecasts.length === 5:
          thisDay.icon = thisDaysForecasts[1].icon;
          thisDay.description = thisDaysForecasts[1].description;
          break;
        default:
          thisDay.icon = thisDaysForecasts[0].icon;
          thisDay.description = thisDaysForecasts[0].description;
      }
    }
    // Last day logic
    if (i === days.length - 1) {
      switch (true) {
        case thisDaysForecasts.length === 1:
          thisDay.icon = thisDaysForecasts[0].icon;
          thisDay.description = thisDaysForecasts[0].description;
          break;
        case thisDaysForecasts.length === 2:
          thisDay.icon = thisDaysForecasts[1].icon;
          thisDay.description = thisDaysForecasts[1].description;
          break;
        case thisDaysForecasts.length === 3:
          thisDay.icon = thisDaysForecasts[2].icon;
          thisDay.description = thisDaysForecasts[2].description;
          break;
        case thisDaysForecasts.length === 4:
          thisDay.icon = thisDaysForecasts[3].icon;
          thisDay.description = thisDaysForecasts[3].description;
          break;
        default:
          thisDay.icon = thisDaysForecasts[4].icon;
          thisDay.description = thisDaysForecasts[4].description;
      }
    }
    // Any other day logic
    if (i > 0 && i < days.length - 1) {
      thisDay.icon = thisDaysForecasts[4].icon;
      thisDay.description = thisDaysForecasts[4].description;
    }

    // Capitalise the first letter in the description
    thisDay.description =
      thisDay.description.charAt(0).toUpperCase() +
      thisDay.description.slice(1);

    // Build a string to help get the icon
    thisDay.iconurl = `${iconBaseURL + thisDay.icon}.png`;

    // Initialise tracking variables to help get the highest and lowest temps
    let highestTemp = -99;
    let lowestTemp = 99;

    // Create a breakdown element (a wrapper) for this day
    const breakdownEl = document.createElement('div');
    breakdownEl.classList.add('day-breakdown', 'column', 'hide');
    breakdownEl.id = `breakdown-${thisDay.dateDay}`;

    // Create a header element and add it to the breakdown element
    const dayHeaderEl = document.createElement('h3');
    dayHeaderEl.classList.add('day-date');
    dayHeaderEl.textContent = thisDay.dateLong;
    breakdownEl.appendChild(dayHeaderEl);

    // Create an empty day element and add it to this breakdown
    const dayEl = document.createElement('div');
    dayEl.classList.add('day', 'row');
    breakdownEl.appendChild(dayEl);

    // Iterate through each forecast for this day
    for (let i = 0; i < thisDaysForecasts.length; i++) {
      // Update tracking variables
      if (thisDaysForecasts[i].temp > highestTemp) {
        highestTemp = thisDaysForecasts[i].temp;
      }
      if (thisDaysForecasts[i].temp < lowestTemp) {
        lowestTemp = thisDaysForecasts[i].temp;
      }

      // Build a string to help get the icon
      const iconurl = `${
        iconBaseURL + thisDaysForecasts[i].icon
      }.png`;

      // Inject a time block element inside of the day element
      dayEl.insertAdjacentHTML(
        'beforeend',
        `
        <div class="hour column">
          <p>${thisDaysForecasts[i].hour}</p>
          <div class="img-wrap">
            <img 
              src="${iconurl}"
              alt="${thisDaysForecasts[i].description}"
              width="50px"
              height="50px"
              style="position:relative"
              title=""
            />
          </div>
          <div class="temp">
            <p><strong>${Math.round(
              thisDaysForecasts[i].temp
            )}°</strong></p>
          </div>
          <div class="wind-wrap">
            <p>${Math.round(thisDaysForecasts[i].windSpeed)}</p>
            <img
              src="img/wind_direction.svg"
              alt="wind direction"
              style="
                transform:
                  translate(-50%,-50%)
                  rotate(${
                    thisDaysForecasts[i].windDirection + 180
                  }deg);
                -webkit-transform:
                  translate(-50%,-50%)
                  rotate(${
                    thisDaysForecasts[i].windDirection + 180
                  }deg)"
              title="wind blowing from ${
                thisDaysForecasts[i].windDirection
              } degrees true north"
            />
          </div>
          <p>${thisDaysForecasts[i].humidity}%</p>
        </div>
      `
      );
    }

    // I replaced the code below with the wind-wrap block in the code above
    // <p>
    //   ${Math.round(thisDaysForecasts[i].windSpeed)}
    //   <i
    //     class='fas fa-arrow-circle-down'
    //     style='
    //        transform: rotate(${thisDaysForecasts[i].windDirection}deg);
    //        -webkit-transform: rotate(${thisDaysForecasts[i].windDirection}deg);
    //        font-size: 1.1rem'
    //   ></i>
    // </p>;

    // If I go back to previous, then easy solution is to change below to ''
    const windWrapIconStyleForDetailColumn = 'style="height: 40px"';
    // Add another element to the day that describes what each bit of info is
    dayEl.insertAdjacentHTML(
      'beforeend',
      `
      <div class="hour column hour-details">
        <p><small>(UTC${secondsToReadableTimeShift(
          weatherDetails.timezone
        )})</small></p>
        <p style="flex-grow:1"></p>
        <div class="temp" style="border:none"><p style="left: 0%;
        transform: none"><small>(°C)</small></p></div>
        <div ${windWrapIconStyleForDetailColumn} class="column justify-center"><p><small>Wind (mph)</small></p></div>
        <p><small>Humidity</small></p>
      </div>
    `
    );

    // Now that we have the highest and lowest temperature for this day,
    // use this and other details collected so far to inject a tab for this day
    tabsEl.insertAdjacentHTML(
      'beforeend',
      `
      <div class="day-tab column" id="tab-${thisDay.dateDay}">
        <p class="f-1">${thisDay.dateShort}</p>
        <div class="tab-details row align-center">
          <div class="f-1">
            <img
              src="${thisDay.iconurl}"
              alt="${thisDay.description}"
              width="50px"
              height="50px"
            />
          </div>
          <div class="column text-center f-1">
            <p class="max">${Math.round(highestTemp)}°</p>
            <p class="min"><small>${Math.round(
              lowestTemp
            )}°</small></p>
          </div>
        </div>
        <p class="tab-description f-1 hide">${thisDay.description}</p>
      </div>
    `
    );

    // Last thing to do for this day is add the wrapper breakdown element to the forecast element
    forecastEl.appendChild(breakdownEl);
  }

  // Add attribution
  forecastEl.insertAdjacentHTML(
    'beforeend',
    `
  <div class="attribution row justify-center align-center">
    <p>Weather data provided by </p>
    <a 
      href="https://openweathermap.org/"
      target="_blank"
    >
      <img 
        src="img/OpenWeather-Master-Logo RGB.png"
        height="60px"
        alt="OpenWeather logo"
        title="OpenWeather">
    </a>
  </div>
  `
  );

  // Show the breakdown for the first day
  document
    .querySelector(`#breakdown-${start}`)
    .classList.remove('hide');

  // Expand the tab and description for the first day
  const firstTabEl = document.querySelector(`#tab-${start}`);
  firstTabEl.classList.add('selected');
  firstTabEl
    .querySelector('.tab-description')
    .classList.remove('hide');

  // Highlights the text selection in the search bar
  // $('.search').select();
  // commenting above out as not great with mobile

  // Sort out the heights for the temperatures in each time block for each day
  setTempHeight();
}

// Function that handles the API calls and filters/transforms the data
// into an object that can be used to show the weather
async function doWeatherForecast(searchString) {
  try {
    // Initialise an object that we'll use to build weather info for all days
    const weatherDetails = {};

    // Geocoder API request
    const geocoderResponse = await fetch(
      `${geocoderBaseURL + searchString}`
    );
    const geocoderResult = await geocoderResponse.json();

    // If the geocoder returned nothing, then deal appropriately with that
    if (geocoderResult.length === 0) {
      noResultsFound();
      return;
    }

    // Build up the info about this city
    const geocoderItem = geocoderResult[0];
    weatherDetails.lat = geocoderItem.lat;
    weatherDetails.lon = geocoderItem.lon;
    weatherDetails.name = geocoderItem.name;
    weatherDetails.countryCode = geocoderItem.country;

    const urlBase = 'https://api.openweathermap.org/data/2.5/';
    const urlParams = `lat=${weatherDetails.lat}&lon=${weatherDetails.lon}&appid=${apiKey}&units=metric`;

    // Current weather API request
    const weatherNowResponse = await fetch(
      `${urlBase}weather?${urlParams}`
    );
    const weatherNow = await weatherNowResponse.json();

    // Pick up the timezone as it's needed for adjusting time block info for different locations
    weatherDetails.timezone = weatherNow.timezone;

    // Add a temporary object that holds the weather data for right now
    weatherDetails.now = {
      timestamp: weatherNow.dt,
      dayMonth: Number(
        moment
          .unix(weatherNow.dt)
          .utcOffset(weatherDetails.timezone / 60)
          .format('D')
      ),
      hour: moment
        .unix(weatherNow.dt)
        .utcOffset(weatherDetails.timezone / 60)
        .format('HH:mm'),
      temp: weatherNow.main.temp,
      humidity: weatherNow.main.humidity,
      description: weatherNow.weather[0].description,
      icon: weatherNow.weather[0].icon,
      windSpeed: convertMetersPerSecondToMilesPerHour(
        weatherNow.wind.speed
      ),
      windDirection: weatherNow.wind.deg,
      // extra stuff below
      feelsLike: weatherNow.main.feels_like,
      pressure: weatherNow.main.pressure,
      sunrise: weatherNow.sys.sunrise,
      sunset: weatherNow.sys.sunset,
      visibility: weatherNow.visibility,
      lat: weatherNow.coord.lat,
      lon: weatherNow.coord.lon,
      timezone: weatherDetails.timezone, // need this for calculating the current time for the first object
    };

    // 5-day forecast API request
    const forecastResponse = await fetch(
      `${urlBase}forecast?${urlParams}`
    );
    const forecast = await forecastResponse.json();

    // Filter the data from the API to only include details interested in
    weatherDetails.forecasts = forecast.list.map((aForecast) => ({
      timestamp: aForecast.dt,
      dayMonth: Number(
        moment
          .unix(aForecast.dt)
          .utcOffset(weatherDetails.timezone / 60)
          .format('D')
      ),
      hour: moment
        .unix(aForecast.dt)
        .utcOffset(weatherDetails.timezone / 60)
        .format('HH:mm'),
      temp: aForecast.main.temp,
      humidity: aForecast.main.humidity,
      description: aForecast.weather[0].description,
      icon: aForecast.weather[0].icon,
      windSpeed: convertMetersPerSecondToMilesPerHour(
        aForecast.wind.speed
      ),
      windDirection: aForecast.wind.deg,
    }));

    // Now put the forecast about right now into the beginning of the forecast array
    weatherDetails.forecasts.unshift(weatherDetails.now);
    delete weatherDetails.now;

    // Now that we've collected and arranged the data, use it to show the data
    showWeather(weatherDetails);

    // Update recent searches column
    updateRecentSearches(
      weatherDetails.name,
      weatherDetails.countryCode
    );
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Uses local storage to render recent searches
function renderRecentSearches() {
  searchHistoryEl.innerHTML = '';

  recentSearches =
    JSON.parse(localStorage.getItem('weather_search_history')) || [];
  // if (recentSearches === null) {
  //   recentSearches = [];
  //   return;
  // }

  searchHistoryEl.insertAdjacentHTML(
    'beforeend',
    `
    <p class="recent-search-header">
      <span id="collapse-down-arrow">
        <i class="fas fa-chevron-down"></i>
      </span>
      <span id="collapse-up-arrow">
        <i class="fas fa-chevron-up"></i>
      </span>&nbsp; Recent Searches
    </p>
  `
  );

  // Iterate through stored searches, adding a button for each one
  recentSearches.forEach((cityAndCode) => {
    searchHistoryEl.insertAdjacentHTML(
      'beforeend',
      `
      <button value="${cityAndCode}" class="history-button">
        <span class="button-text">${formatRecentSearchText(
          cityAndCode
        )}</span>
        <span class="close">x</span>
      </button>
    `
    );
  });
  // for (const cityAndCode of recentSearches) {
  //   searchHistoryEl.append(`
  //   <button value="${cityAndCode}" class="history-button">
  //     <span class="button-text">${formatRecentSearchText(cityAndCode)}</span>
  //     <span class="close">x</span>
  //   </button>
  //   `);
  // }
}

// Load page
function init() {
  // Render recent searches from local storage, if applicable
  renderRecentSearches();

  // Form submit event listener
  formEl.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchString = document
      .querySelector('#search-text')
      .value.trim();
    const countryCode = document.querySelector(
      'input[name="country"]:checked'
    ).value;

    // If there's no text in search input, do nothing
    if (searchString === '') {
      return;
    }

    // If there is a specified country code (i.e. 'gb')
    // then add it to string to use with API
    if (countryCode !== '') {
      searchString += ',' + countryCode;
    }
    // Do the forecast
    doWeatherForecast(searchString);
  });

  // Day tab click event listener
  weatherEl.addEventListener('click', function (event) {
    const dayTab = event.target.closest('.day-tab');
    if (dayTab) {
      switchDayInForecast(dayTab);
    }
  });

  // Recent search click event listener
  searchHistoryEl.addEventListener('click', function (event) {
    // check to see if we've clicked on a close span
    if (event.target.classList.contains('close')) {
      const cityToRemove = event.target.parentNode.value;
      const pastSearchExists = recentSearches.includes(cityToRemove);

      if (pastSearchExists) {
        // remove search from history
        recentSearches = recentSearches.filter(
          (pastSearch) => pastSearch !== cityToRemove
        );

        if (recentSearches.length === 0) {
          clearInterval(timer);
          localStorage.removeItem('weather_search_history');
          weatherEl.innerHTML = '';
          weatherEl.insertAdjacentHTML(
            'beforeend',
            `
            <div class="feedback">
              <p>Use the search bar to get started.</p>
            </div>
          `
          );
          searchHistoryEl.innerHTML = '';
          document.querySelector('.search').value = '';
          // document.querySelector('.search').select();
        } else {
          localStorage.setItem(
            'weather_search_history',
            JSON.stringify(recentSearches)
          );
        }

        // Use the updated local storage to re-render the search history column
        renderRecentSearches();
      }
      return;
    }

    //  now that we've eliminated the possibility of the close span
    // being clicked, check if a history button has been clicked
    const searchHistoryButton =
      event.target.closest('.history-button');

    if (searchHistoryButton) {
      const searchString = searchHistoryButton.value;
      doWeatherForecast(searchString);

      // Update the text in the search bar to reflect the search history item
      document.querySelector('.search').value =
        searchString.split(',')[0];
      // document.querySelector('.search').select(); // not mobile-friendly
    }
  });
}

init();

/*
                                  AUTOCOMPLETE USING GEOCODER API

    The following code covers using a geocoder (GeoApify) to help fill an autocomplete list when
    the user enters text in the search field.

    To achieve this, first requirement is an API key which I got from https://myprojects.geoapify.com/.
    According to thier free plan, 3,000 requests are allowed per day, so should be okay to use.

    The code specifies the minimum number of characters (4) that a user enters before a search is performed.

    The jQuery function .ajax() is used to make an HTTP GET request to the API. The nifty thing with this is
    that it breaks down long urls by putting the parameters (text, apiKey, limit) into an object.

    The text parameter is set to the value of the search text input (request.term), and results are
    limited to 5.

    The request returns a single object with around 3-4 properties, the only one we are interested in is
    the 'features' property which returns an array of objects representing locations.

    This array is then transformed 4 times:
    1. Filter out the returned objects and cherry pick the data we are interested in (city, country, code)
    2. Filter out any results that return 'undefined' anywhere
    3. Filter out results to only show unique ones (the API could return multiple items
       all with the same city, country and country_code but slightly different locations)
    4. Make the country code uppercase for superficial reasons

    Finally the filtered array of objects with both label and value properties is returned
    in the response.

    Pretty cool stuff.

    There's also an event listener for when a list item is selected, which is really easy.

    A final thing: if the user ignores the autocomplete list and presses enter,
    then to clear the autocomplete list there needs to a specific event listener for that.
*/
const geoapifyApiKey = '9634b8d64110479ebf267e2b2dae0528';
const searchTextInput = $('#search-text');

function addAutocompleteFeature() {
  searchTextInput.autocomplete({
    minLength: 4,
    source: function (request, response) {
      $.ajax({
        url: `https://api.geoapify.com/v1/geocode/autocomplete`,
        data: {
          text: request.term,
          apiKey: geoapifyApiKey,
          limit: 5,
        },
        success: function (result) {
          // create an array of objects with label and value properties from the API response
          const results = result.features.map(function (feature) {
            return {
              label: `${feature.properties.city}, ${feature.properties.country}`,
              value: `${feature.properties.city},${feature.properties.country_code}`,
            };
          });
          // console.log(results);

          // some rejigging to only include valid city results
          const filteredResults = results.filter(function (result) {
            return (
              !result.label.includes('undefined') &&
              !result.value.includes('undefined')
            );
          });

          // console.log(filteredResults);

          // drop duplicates
          const uniqueResults = filteredResults.filter(function (
            result,
            index
          ) {
            return (
              filteredResults.findIndex(function (otherResult) {
                return otherResult.label === result.label;
              }) === index
            );
          });

          // last bit of formatting to capitalize the country code
          uniqueResults.forEach((obj) => {
            const [city, code] = obj.value.split(',');
            obj.value = `${city},${code.toUpperCase()}`;
          });

          // console.log(uniqueResults);
          // pass the unique results array to the response callback
          response(uniqueResults);
        },
        error: function (error) {
          console.log('error', error);
        },
      });
    },
    // select event listener
    select: function (event, ui) {
      // console.log(ui.item);
      doWeatherForecast(ui.item.value);
    },
  });

  // event listener for if the user ignores the autocomplete list
  // and presses enter - it basically clears the autocomplete list
  // note - doesn't always work (due to asynchronicity??)
  searchTextInput.keydown(function (event) {
    if (event.keyCode === 13) {
      searchTextInput.autocomplete('close');
    }
  });
}

addAutocompleteFeature();

/*
                         Mobile-friendly features
    So this is just an event listener that listens for when the recent search header
    (a p element) is clicked. It toggles the class to both its siblings (the buttons)
    and its children (the arrows).
*/

function addMobileFriendlyFeatures() {
  searchHistoryEl.addEventListener('click', function (event) {
    if (event.target.classList.contains('recent-search-header')) {
      document
        .querySelector('#collapse-down-arrow')
        .classList.toggle('expanded');
      document
        .querySelector('#collapse-up-arrow')
        .classList.toggle('expanded');
    }
    searchHistoryEl
      .querySelectorAll('.history-button')
      .forEach((buttonEl) => {
        buttonEl.classList.toggle('expanded');
      });
  });
}

addMobileFriendlyFeatures();

/*
                         A tooltip feature
    For the images in the forecast breakdown.
    Having both event listeners mouseenter and mouseleave is the equivalent of hover.
    Got to set style="display:none" on the p element so that fadeIn works
*/

function addToolTipFeature() {
  const jQueryWeatherEl = $('.weather');
  jQueryWeatherEl.on('mouseenter', '.img-wrap', function () {
    // grab the alt text
    const altText = capitaliseFirstCharacter(
      $(this).children('img').attr('alt')
    );
    // add a new tooltip element using this text
    $('<p class="tooltip" style="display:none"></p>')
      .text(altText)
      .appendTo($(this))
      .fadeIn('slow');
  });
  jQueryWeatherEl.on('mouseleave', '.img-wrap', function () {
    // remove this tooltip element
    $(this).children('.tooltip').remove();
  });
}

addToolTipFeature();
