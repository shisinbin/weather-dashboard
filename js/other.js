var apiKey = '0e8f67bf6ac0e37689d7edea5f37f808';
var iconBaseURL = 'https://openweathermap.org/img/wn/';
var geocoderBaseURL = `https://api.openweathermap.org/geo/1.0/direct?appid=${apiKey}&limit=1&q=`;
const MAX_NUM_OF_RECENTS = 8;

// Grab HTML elements
// var forecastEl = $('.forecast');
var formEl = $('form');
var searchHistoryEl = $('.search-history');
var weatherEl = $('.weather');

// Initialise an array to help with local storage logic
var recentSearches = [];

// Helper function that converts a Unix timestamp representing a timezone shift
// to a readable format, such as '-0500' or '+0530'
function unixToReadableTimeShift(unixTimestamp) {
  // Convert the unix timestamp (in seconds) to hours
  var timeShiftInHours = unixTimestamp / 3600;

  // Convert the time shift from hours to hours and minutes
  var hours = Math.floor(timeShiftInHours);
  var minutes = Math.round((timeShiftInHours - hours) * 60);

  // Format the time shift as a string
  var readableTimeShift =
    (hours < 0 ? '-' : '+') +
    (Math.abs(hours) < 10 ? '0' : '') +
    Math.abs(hours) +
    (minutes < 10 ? '0' : '') +
    minutes;

  return readableTimeShift;
}

// Helper function to convert metres/sec to miles/hour
function convertMetersPerSecondToMilesPerHour(metersPerSecond) {
  return metersPerSecond * 2.23693629;
}

function convertUnixToMilitaryTime(unixTimestamp) {
  return moment.unix(unixTimestamp).format('HH:mm');
}

function capitaliseFirstCharacter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function showCurrent(weatherObj) {
  var iconurl = `${iconBaseURL + weatherObj.icon + '.png'}`;
  console.log(weatherObj);
  weatherEl.append(`
  <h3 class="now-text">Now</h3>

  <div class="current-weather text-center">
    <div class="current-main-details">
      <div class="tile column">
        <p>${Math.round(weatherObj.temp)}°C</p>
        <p><small>Feels like: 10.4</small></p>
      </div>
      <div class="tile">
        <div><img src="${iconurl}" alt="${weatherObj.description}"></div>
      </div>
      <div class="tile">
        <p>${capitaliseFirstCharacter(weatherObj.description)}</p>
      </div>
    </div>

    <div class="current-extra-details">
      <div class="tile">
        <p>${Math.round(weatherObj.windSpeed)} mph</p>
        <p><small>Wind speed</small></p>
      </div>

      <div class="tile">
        <p><i class="fas fa-arrow-up"></i>${Math.round(
          weatherObj.windDirection
        )}</p>
        <p><small>Wind dir</small></p>
      </div>

      <div class="tile">
        <p>${Math.round(weatherObj.visibility)} km</p>
        <p><small>Visibility</small></p>
      </div>

      <div class="tile">
        <p>${Math.round(weatherObj.humidity)}%</p>
        <p><small>Humidity</small></p>
      </div>

      <div class="tile">
        <p>${convertUnixToMilitaryTime(weatherObj.sunrise)}</p>
        <p><small>Sunrise</small></p>
      </div>

      <div class="tile">
        <p>${convertUnixToMilitaryTime(weatherObj.sunset)}</p>
        <p><small>Sunset</small></p>
      </div>
    </div>
  </div>
  `);
}

/*
  <h3 class="now-text">Now</h3>

  <div class="current-weather text-center">
    <div class="current-main-details">
      <div class="tile column">
        <p>10°C</p>
        <p><small>Feels like: 10.4</small></p>
      </div>
      <div class="tile">
        <p><i class="fas fa-smog"></i></p>
      </div>
      <div class="tile">
        <p>Heavy smog</p>
      </div>
    </div>

    <div class="current-extra-details">
      <div class="tile">
        <p>5 mph</p>
        <p><small>Wind speed</small></p>
      </div>

      <div class="tile">
        <p><i class="fas fa-arrow-up"></i></p>
        <p><small>Wind dir</small></p>
      </div>

      <div class="tile">
        <p>1000 km</p>
        <p><small>Visibility</small></p>
      </div>

      <div class="tile">
        <p>85%</p>
        <p><small>Humidity</small></p>
      </div>

      <div class="tile">
        <p>06:23</p>
        <p><small>Sunrise</small></p>
      </div>

      <div class="tile">
        <p>17:47</p>
        <p><small>Sunset</small></p>
      </div>
    </div>
  </div>
*/

// Function that sets the height of every temperature element in a forecast
// relative to its parent div, based on the min and max temp for that day
function setTempHeight() {
  // For each day tab, get the id, max and min
  $('.day-tab').each(function () {
    var id = $(this).attr('id').split('-')[1];

    // Convert max/min to number, making sure to pick up - sign and digits only
    var max = $(this).find('.max').text();
    max = Number(max.match(/-?\d+/)[0]);
    var min = $(this).find('.min').text();
    min = Number(min.match(/-?\d+/)[0]);

    // console.log(`id: ${id}, max: ${max}, min: ${min}`);

    // Use the id to find the breakdown element to target
    var breakdownToTarget = $(`#breakdown-${id}`);
    // As last hour element is descriptive text, need a way to exit upcoming loop on last iteration
    var maxLoops = breakdownToTarget.find('.hour').length - 1;

    // For each hour, set the height
    breakdownToTarget.find('.hour').each(function (index) {
      if (index === maxLoops) {
        return;
      }

      // Target the temp paragraph
      var paraToTarget = $(this).find('.temp p');
      var temp = paraToTarget.text();
      temp = Number(temp.match(/-?\d+/)[0]);

      var percentage;
      if (max === min) {
        percentage = 50;
      } else {
        percentage = Math.round(((temp - min) / (max - min)) * 100);
      }

      // As I want the height to be between 25% and 75% from the bottom
      // of the parent div, this logic helps achieve this
      var height = percentage / 2;
      height += 25;

      // console.log(
      //   `temp: ${temp}, percentage: ${percentage}, height: ${height}`
      // );

      // Now update the css for this p element
      paraToTarget.css('bottom', `${height}%`);
    });
  });
}

// Function that clears forecast HTML and provides feedback when user
// puts in a search term that the API doesn't recognise
function noResultsFound() {
  weatherEl.html('');
  weatherEl.append(`
  <div class="city-wrapper">
    <h1 class="city-name">No results found. Please try again!</h1>
  </div>
  `);
  // var feedbackEl = $('<div>');
  // feedbackEl.addClass('feedback');
  // feedbackEl.text('No results found. Please try again!');
  // forecastEl.append(feedbackEl);
}

// Function that takes in a successful search term and its corresponding country code
// and adds this to local storage
function updateRecentSearches(newSuccessfulSearch, countryCode) {
  var combinedSearch =
    newSuccessfulSearch.toLowerCase() + ',' + countryCode.toLowerCase();
  // Check to see if search already exists
  var index = recentSearches.indexOf(`${combinedSearch}`);
  if (index !== -1) {
    // If it does, remove it from recent searches
    recentSearches.splice(index, 1);
  }

  // Add this new search to beginning of list
  recentSearches.unshift(combinedSearch);

  // Check if the length isn't over the max allowed
  if (recentSearches.length > MAX_NUM_OF_RECENTS) {
    // If it is, remove the 'oldest' search
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

// Function that uses local storage to help render the recent searches bar
function renderRecentSearches() {
  searchHistoryEl.html('');

  recentSearches = JSON.parse(localStorage.getItem('weather_search_history'));

  if (recentSearches === null) {
    recentSearches = [];
    return;
  }

  for (var cityAndCode of recentSearches) {
    var displayOnlyCity = cityAndCode.split(',')[0]; // could use this instead of below
    var displayBoth = cityAndCode.split(',').join(', ');
    searchHistoryEl.append(`
      <button value="${cityAndCode}" class="history-button">
        <span class="button-text">${displayBoth}</span>
        <span class="close">x</span>
      </button>
    `);
  }
}

// Function to show both the day tab and breakdown for the tab that was clicked
function switchForecast(element) {
  var tab = $(element);
  var forecastEl = $('.forecast');

  // Get the id, and grab the element that needs to be changed
  var id = tab.attr('id').split('-')[1];
  var tabToChange = $(`#tab-${id}`);

  // globally remove the selected class to every tab and hide every description
  element.parent().children().removeClass('selected');
  element.parent().children().children('.tab-description').addClass('hide');

  // 'expand' the appropriate tab and shows its description
  tabToChange.addClass('selected');
  tabToChange.children('.tab-description').removeClass('hide');

  // globally hide all breakdowns before unhiding the appropriate one
  forecastEl.children('.day-breakdown').addClass('hide');
  forecastEl.children(`#breakdown-${id}`).removeClass('hide');
}

// Function that handles the logic involved for translating received data and displaying it
function showForecast(weatherDetails) {
  // Clear the old html
  weatherEl.html('');

  weatherEl.append(`
  <div class="city-wrapper">
    <h1 class="city-name">Weather conditions for ${
      weatherDetails.name + ', ' + weatherDetails.countryCode
    }</h1>
  </div>
  `);

  showCurrent(weatherDetails.forecasts[0]);

  // // Add city name to h2 element
  // forecastEl.append(
  //   `<h2 class="city-name"><i class="fas fa-map-marker-alt"></i> ${
  //     weatherDetails.name + ', ' + weatherDetails.countryCode
  //   }</h2>`
  // );

  var forecastEl = $('<section>');
  forecastEl.addClass('forecast column');
  weatherEl.append(forecastEl);

  // Generate an array, days, that includes all days to be covered in forecast (e.g. 28, 29, 30, 31, 1, 2)
  // the ... is a spread operator used to convert the set object into an array
  days = [
    ...new Set(weatherDetails.forecasts.map((forecast) => forecast.dayMonth)),
  ];

  // Create the days element that will hold all tabs and append it to forecast element
  var tabsEl = $('<div>');
  tabsEl.addClass('row days');
  forecastEl.append(tabsEl);

  // For every day in days, do stuff
  for (let i = 0; i < days.length; i++) {
    // Filter weatherDetails to include forecasts for this day
    var thisDaysForecasts = weatherDetails.forecasts.filter(
      (forecast) => forecast.dayMonth === days[i]
    );

    var thisDaysMoment = moment(thisDaysForecasts[0].unix, 'X');

    // Start to build an object for this day, starting with date stuff
    var thisDay = {
      dateDay: Number(thisDaysMoment.format('D')),
      dateShort: thisDaysMoment.format('ddd D'),
      dateLong: thisDaysMoment.format('dddd D'),
    };

    // Now some logic to ensure that the selected icon and corresponding description
    // is for the 5th time block (e.g. for UK, the 5th time block is 12:00)
    // or if not possible, then select either the latest time block for the first day
    // or the earliest time block for the last day.
    // First day
    if (i === 0) {
      // If the first day is the user's current day, then show 'Today' in day tab
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
    // Last day
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
    // Any other day
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
    var highestTemp = -99;
    var lowestTemp = 99;

    // Create a breakdown element (a wrapper) for this day
    var breakdownEl = $('<div>');
    breakdownEl.addClass('day-breakdown column hide');
    breakdownEl.attr('id', `breakdown-${thisDay.dateDay}`);
    // add thisDay's date
    breakdownEl.append(`
      <h3 class="day-date">${thisDay.dateLong}</h3>
    `);

    // Create a day element inside of the wrapper
    var dayEl = $('<div>');
    dayEl.addClass('day row');
    breakdownEl.append(dayEl);

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
      var iconurl = `${iconBaseURL + thisDaysForecasts[i].icon}.png`;

      // Inject a time block element inside of the day element
      dayEl.append(`
        <div class="hour column">
          <p>${thisDaysForecasts[i].hour}</p>
          <div><img src="${iconurl}" alt="${
        thisDaysForecasts[i].description
      }"></div>
          <div class="temp"><p>${Math.round(
            thisDaysForecasts[i].temp
          )}°</p></div>
          <p>${Math.round(
            thisDaysForecasts[i].windSpeed
          )} <i class="fas fa-arrow-circle-down" style="transform: rotate(${
        thisDaysForecasts[i].windDirection
      }deg); -webkit-transform: rotate(${
        thisDaysForecasts[i].windDirection
      }deg);font-size: 1.1rem"></i></p>
          <p>${thisDaysForecasts[i].humidity}%</p>
        </div>
      `);
    }

    // Add another element to the day that describes what each bit of info is
    dayEl.append(`
      <div class="hour column hour-details">
        <p><small>(UTC${unixToReadableTimeShift(
          weatherDetails.timezone
        )})</small></p>
        <p style="flex-grow:1"></p>
        <div class="temp" style="border:none"><p style="left: 0%;
        transform: none"><small>(°C)</small></p></div>
        <p><small>Wind (mph)</small></p>
        <p><small>Humidity</small></p>
      </div>
    `);

    // Now that we have the highest and lowest temperature for this day,
    // use this and other details collected so far to inject a tab for this day
    tabsEl.append(`
      <div class="day-tab column" id="tab-${thisDay.dateDay}">
        <p class="f-1">${thisDay.dateShort}</p>
        <div class="tab-details row align-center">
          <div class="f-1"><img src="${thisDay.iconurl}" alt="${
      thisDay.description
    }"></div>
          <div class="column text-center f-1">
            <p class="max">${Math.round(highestTemp)}°</p>
            <p class="min"><small>${Math.round(lowestTemp)}°</small></p>
          </div>
        </div>
        <p class="tab-description f-1 hide">${thisDay.description}</p>
      </div>
    `);

    // Last thing to do for this day is add the wrapper breakdown element to the forecast element
    forecastEl.append(breakdownEl);
  }

  var start = weatherDetails.forecasts[0].dayMonth;
  // Show the breakdown for the first day
  $(`#breakdown-${start}`).removeClass('hide');

  // Expand the tab and show the description for this first day
  $(`#tab-${start}`).addClass('selected');
  $(`#tab-${start}`).children('.tab-description').removeClass('hide');

  // Highlights the text selection in the search bar
  $('.search').select();

  // Sort out the heights for the temperatures in each time block for each day
  setTempHeight();
}

// Function that handles the API calls, filtering the data required about 41 forecasts
function doForecast(searchString) {
  // Initialise an object that we'll use to build weather info for all days
  var weatherDetails = {};

  // Do the API stuff
  // Geocoder API request
  $.get(`${geocoderBaseURL + searchString}`).then(function (geocodeResult) {
    // If the geocoder returned nothing, then deal appropriately with that
    if (geocodeResult.length === 0) {
      noResultsFound();
      return;
    }

    // Build up the info about this city
    weatherDetails.lat = geocodeResult[0].lat;
    weatherDetails.lon = geocodeResult[0].lon;
    weatherDetails.name = geocodeResult[0].name;
    weatherDetails.countryCode = geocodeResult[0].country;

    var urlBase = 'https://api.openweathermap.org/data/2.5/';
    var urlParams = `lat=${weatherDetails.lat}&lon=${weatherDetails.lon}&appid=${apiKey}&units=metric`;

    // Current weather API request
    $.get(`${urlBase}weather?${urlParams}`).then(function (weatherNow) {
      // Pick up the timezone as it's needed for adjusting time block info for different locations
      weatherDetails.timezone = weatherNow.timezone;

      // Add a temporary object that holds the weather data for right now
      weatherDetails.now = {
        unix: weatherNow.dt + weatherDetails.timezone,
        dayMonth: Number(
          moment(weatherNow.dt + weatherDetails.timezone, 'X').format('D')
        ),
        // dayWeek: moment(weatherNow.dt, 'X').format('ddd'),
        hour: moment(weatherNow.dt + weatherDetails.timezone, 'X').format(
          'HH:mm'
        ),
        temp: weatherNow.main.temp,
        humidity: weatherNow.main.humidity,
        description: weatherNow.weather[0].description,
        icon: weatherNow.weather[0].icon,
        windSpeed: convertMetersPerSecondToMilesPerHour(weatherNow.wind.speed),
        windDirection: weatherNow.wind.deg,
        sunrise: weatherNow.sys.sunrise + weatherDetails.timezone,
        sunset: weatherNow.sys.sunset + weatherDetails.timezone,
        visibility: weatherNow.visibility,
      };

      // 5-day forecast API request
      $.get(`${urlBase}forecast?${urlParams}`).then(function (forecast) {
        // Filter the data from the API to only include details interested in
        weatherDetails.forecasts = forecast.list.map((aForecast) => ({
          unix: aForecast.dt + weatherDetails.timezone,
          dayMonth: Number(
            moment(aForecast.dt + weatherDetails.timezone, 'X').format('D')
          ),
          hour: moment(aForecast.dt + weatherDetails.timezone, 'X').format(
            'HH:mm'
          ),
          temp: aForecast.main.temp,
          humidity: aForecast.main.humidity,
          description: aForecast.weather[0].description,
          icon: aForecast.weather[0].icon,
          windSpeed: convertMetersPerSecondToMilesPerHour(aForecast.wind.speed),
          windDirection: aForecast.wind.deg,
        }));

        // Now put the forecast about right now into the beginning of the forecast array
        weatherDetails.forecasts.unshift(weatherDetails.now);
        delete weatherDetails.now;
        // Now that we've collected and arranged the data, use it to show the data
        showForecast(weatherDetails);

        // Update recent searches column
        updateRecentSearches(weatherDetails.name, weatherDetails.countryCode);
      });
    });
  });
}

// Function to load on page load
function init() {
  // Render recent searches from local storage if applicable
  renderRecentSearches();

  // Form submit event listener
  formEl.submit(function (event) {
    event.preventDefault();
    var searchString = $('#search-text').val().trim();
    var countryCode = $('input[name="country"]:checked').val();

    // If there's no text in search input, do nothing
    if (searchString === '') {
      return;
    }

    // If there is a specified country code (i.e. gb) then add it to string to use with API
    if (countryCode !== '') {
      searchString += ',' + countryCode;
    }
    // Do the forecast
    doForecast(searchString);
  });

  // Day tab click event listener
  weatherEl.on('click', '.day-tab', function () {
    switchForecast($(this));
  });

  // Recent search click event listener
  searchHistoryEl.on('click', 'button', function () {
    var searchString = $(this).val();
    doForecast(searchString);

    // Update the text in the search bar to reflect the search history item
    $('.search').val(`${searchString.split(',')[0]}`);
    $('.search').select();
  });

  // Removing recent search event listener
  searchHistoryEl.on('click', '.close', function (event) {
    // Stop the other event in the button from happening
    event.stopPropagation();

    // Get the value of the button and use if to remove it from recentSearches array
    var cityToRemove = $(this).parent().val();
    var index = recentSearches.indexOf(cityToRemove);
    if (index !== -1) {
      recentSearches.splice(index, 1);

      // If recentSearches array is now empty, remove it from local storage and clear page
      if (recentSearches.length === 0) {
        localStorage.removeItem('weather_search_history');
        weatherEl.html('');
        weatherEl.append(`
          <div class="feedback">
            <p>Use the search box on the left to get started.</p>
          </div>
        `);
        $('.search').val('');
        $('.search').select();
        // Otherwise just update local storage to reflect changes made
      } else {
        localStorage.setItem(
          'weather_search_history',
          JSON.stringify(recentSearches)
        );
      }
    }
    // Use the updated local storage to re-render the search history column
    renderRecentSearches();
  });
}

init();
