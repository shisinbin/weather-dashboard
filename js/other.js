// app logic goes here
const MAX_NUM_OF_RECENTS = 6;

// geocoderArr - result that gives lat and lon
// cityObj - result that uses lat and lon to give weather info about that day
// forecastArr - result that uses lat and lon to give weather info about next 40 3-hour periods

// grab html elements
var todaysWeatherEl = $('.current-day-wrapper');
var forecastEl = $('.forecast');
var formEl = $('form');
var searchHistoryEl = $('.search-history');

// global variables
var recentSearches = [];
var apiKey = '0e8f67bf6ac0e37689d7edea5f37f808';
var countryCode = 'GB';

// Fuction to return the most common string, given an array of strings.
// If there is more than one most common, selects the first most common
function mostCommonString(strings) {
  // Create an object to store the frequency of each string
  const frequency = {};

  // Iterate through the array and count the frequency of each string
  for (const string of strings) {
    if (frequency[string]) {
      frequency[string]++;
    } else {
      frequency[string] = 1;
    }
  }

  // Find the key in the object with the highest count
  let mostCommon = '';
  let maxCount = 0;
  for (const string in frequency) {
    if (frequency[string] > maxCount) {
      mostCommon = string;
      maxCount = frequency[string];
    }
  }

  return mostCommon;
}

// Function to return an average wind direction given an array of wind directions
function averageWindDirection(windDirections) {
  // Convert wind directions to angles in radians
  const angles = windDirections.map(
    (windDirection) => windDirection * (Math.PI / 180)
  );

  // Sum sines and cosines of the angles
  const sinSum = angles.reduce((sum, angle) => sum + Math.sin(angle), 0);
  const cosSum = angles.reduce((sum, angle) => sum + Math.cos(angle), 0);

  // Calculate average sine and cosine
  const avgSin = sinSum / windDirections.length;
  const avgCos = cosSum / windDirections.length;

  // Convert average sine and cosine back to an angle in radians
  const avgAngle = Math.atan2(avgSin, avgCos);

  // Convert angle in radians back to a wind direction in degrees
  const avgWindDirection = avgAngle * (180 / Math.PI);

  // Ensure direction is always between 0 and 360 inclusive
  return Math.round((avgWindDirection + 360) % 360);
}

// Function to update the recent searches array, given a new successful search
function updateRecentSearches(newSuccessfulSearch) {
  // Check to see if search already exists
  var index = recentSearches.indexOf(newSuccessfulSearch.toLowerCase());
  if (index !== -1) {
    // If it does, remove it from recent searches
    recentSearches.splice(index, 1);
  }

  // Add this new search to beginning of list
  recentSearches.unshift(newSuccessfulSearch.toLowerCase());

  // Check if the length isn't over the max allowed
  if (recentSearches.length > MAX_NUM_OF_RECENTS) {
    // If it is, remove the 'oldest' search
    recentSearches.pop();
  }

  // Now update local storage
  localStorage.setItem('search_history', JSON.stringify(recentSearches));

  // Finally render the recent searches list on the page correctly
  renderRecentSearches();
}

// Function to render the recent searches
function renderRecentSearches() {
  // Clear innerhtml
  searchHistoryEl.html('');

  // Grab the recent searches from local storage
  recentSearches = JSON.parse(localStorage.getItem('search_history'));

  // Check that it isn't empty
  if (recentSearches === null) {
    recentSearches = [];
    return;
  }

  // Iterate through recent searches, adding a button for each one
  for (var city of recentSearches) {
    searchHistoryEl.append(`
      <button value="${city}" class="history-button">
        <span class="button-text">${city}</span>
        <span class="close">x</span>
      </button>
    `);
  }
}

// Helper function to return an average given an array of numbers
function getAverage(arr) {
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
}

// Function to show a full forecast, given an array containing the next 5 dates
// and an array of (40) forecasts across these 5 days
function showForecast(dateArr, forecastArr) {
  // Clear innerHTML
  forecastEl.html('');

  console.log(forecastArr.length);

  // initialise the pointer variable
  var forecastPointer = 0;

  // iterate through the forecast array until the pointer moves past today's date
  for (forecastPointer; forecastPointer < 8; forecastPointer++) {
    if (
      moment(forecastArr[forecastPointer].dt, 'X').format('D') ===
      moment(dateArr[0], 'DD/MM/YY').format('D')
    ) {
      break;
    }
  }
  console.log(`After initial stuff, pointer is now ${forecastPointer}`);

  // now iterate through the date array
  for (var i = 0; i < dateArr.length; i++) {
    // Get the date
    var dateMoment = moment(dateArr[i], 'DD/MM/YY');
    var day = moment(dateArr[i], 'DD/MM/YY').format('D');

    // initialise tracking variables
    var high = -99;
    var low = 99;
    var windSpeeds = [];
    var humidities = [];
    var windDirections = [];

    var weatherDescriptions = [];
    var weatherIcons = {};

    // Iterate either 8 times or until the pointer moves past array length
    var maxBeforeIteration = forecastPointer + 8;
    for (
      forecastPointer;
      forecastPointer < maxBeforeIteration &&
      forecastPointer < forecastArr.length;
      forecastPointer++
    ) {
      // Point to forecast object
      var forecastObj = forecastArr[forecastPointer];

      // Get day of object
      var dayOfForecast = moment(forecastObj.dt, 'X').format('D');

      // If the date of object matches, update trackers
      if (day === dayOfForecast) {
        windSpeeds.push(Number(forecastObj.wind.speed));
        humidities.push(Number(forecastObj.main.humidity));
        // windIcons.push(forecastObj.weather[0].icon);
        windDirections.push(forecastObj.wind.deg);

        weatherDescriptions.push(forecastObj.weather[0].description);
        weatherIcons[forecastObj.weather[0].description] =
          forecastObj.weather[0].icon;
        if (forecastObj.main.temp > high) {
          high = forecastObj.main.temp;
        }
        if (forecastObj.main.temp < low) {
          low = forecastObj.main.temp;
        }
      }
    }

    console.log(`After loop ${i}, the pointer is now ${forecastPointer}`);

    // Calculate averages
    var windSpeedAvg = getAverage(windSpeeds);
    var humidityAvg = getAverage(humidities);
    var windDirAvg = averageWindDirection(windDirections);

    // var mostCommonIcon = mostCommonString(windIcons);

    var mostCommonDescription = mostCommonString(weatherDescriptions);

    // Use iconurl (could create helper function that selects most frequent icon code but heyho)
    var iconurl =
      'http://openweathermap.org/img/w/' +
      weatherIcons[mostCommonDescription] +
      '.png';

    // Inject
    forecastEl.append(`
    <div class='forecast-day'>
      <p><strong>${dateMoment.format('ddd D')}</strong></p>
      <img src="${iconurl}">
      <p>Temp high: ${Math.round(high)}°</p>
      <p>Temp low: ${Math.round(low)}</p>
      <p>Wind avg: ${Math.round(windSpeedAvg)} mph</p>
      <p>Humidity avg: ${Math.round(humidityAvg)}%</p>
      <p><i class="fas fa-arrow-circle-down" style="transform: rotate(${windDirAvg}deg); -webkit-transform: rotate(${windDirAvg}deg)"></i></p>
      <p>${mostCommonDescription}</p>
    </div>
    `);
  }
}

function getNextFiveDays(today) {
  var currentDay = moment(today, 'X');
  var days = [];
  for (var i = 0; i < 5; i++) {
    currentDay.add(1, 'day');
    days.push(currentDay.format('DD/MM/YY'));
  }
  return days;
}

function showTodaysWeather(city, obj) {
  todaysWeatherEl.html('');
  var iconurl =
    'http://openweathermap.org/img/w/' + obj.weather[0].icon + '.png';
  todaysWeatherEl.append(`
  <article class='current-day'>
    <h2>${city}</h2>
    <h3>${moment(obj.dt, 'X').format('ddd D, HH:mm:ss')}</h3>
    <img src="${iconurl}">
    <p>Temp: ${Math.round(obj.main.temp)}°</p>
    <p>Wind: ${Math.round(obj.wind.speed)} mph</p>
    <p>Humidity: ${Math.round(obj.main.humidity)}%</p>
  </article>
  `);
}

function getWeatherData(city) {
  // check if city is in fact a city
  // var currentWeatherObj = {};
  var lat;
  var lon;
  var nextFiveDays = [];
  var returnedName;

  $.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${
      city + ',' + countryCode
    }&limit=1&appid=${apiKey}`
  ).then(function (ukResult) {
    lat = ukResult[0].lat;
    lon = ukResult[0].lon;
    returnedName = ukResult[0].name;
    $.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    ).then(function (dataToday) {
      showTodaysWeather(returnedName, dataToday);
      nextFiveDays = getNextFiveDays(dataToday.dt);
      $.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      ).then(function (forecast) {
        showForecast(nextFiveDays, forecast.list);
        console.log(ukResult);
        updateRecentSearches(returnedName);
      });
    });
  });
  // highlight text in search bar
  $('.search').select();
}

function init() {
  // event listener for form submit
  formEl.submit(function (event) {
    event.preventDefault();
    // initial text entered check
    var searchText = $('#search-text').val().trim();
    if (searchText === '') {
      return;
    }
    // get weather data
    getWeatherData(searchText);
  });
  // event listener for clicking button
  searchHistoryEl.on('click', 'button', function () {
    getWeatherData($(this).val());
  });

  searchHistoryEl.on('click', '.close', function (event) {
    event.stopPropagation();
    var cityToRemove = $(this).parent().val();
    var index = recentSearches.indexOf(cityToRemove);
    if (index !== -1) {
      recentSearches.splice(index, 1);
      if (recentSearches.length === 0) {
        localStorage.removeItem('search_history');
      } else {
        localStorage.setItem('search_history', JSON.stringify(recentSearches));
      }
    }
    renderRecentSearches();
  });

  renderRecentSearches();
}

init();

// $(document).ready(function() {
//   // Bind a hover event handler to the "x" element
//   $('.close').hover(function() {
//     // Highlight the "x" element when the cursor is hovering over it
//     $(this).css('color', '#f44336');
//   }, function() {
//     // Reset the color of the "x" element when the cursor is no longer hovering over it
//     $(this).css('color', '#000000');
//   });

//   // Bind a hover event handler to the button element
//   $('.my-button').hover(function() {
//     // Highlight the button text when the cursor is hovering over the button
//     $(this).find('.button-text').css('color', '#f44336');
//   }, function() {
//     // Reset the color of the button text when the cursor is no longer hovering over the button
//     $(this).find('.button-text').css('color', '#ffffff');
//   });

//   // Bind a mouseenter event handler to the "x" element
//   $('.close').mouseenter(function(event) {
//     // Prevent the hover event from affecting the parent button element
//     event.stopPropagation();
//   });
// });
