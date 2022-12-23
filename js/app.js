var apiKey = '0e8f67bf6ac0e37689d7edea5f37f808';
const MAX_NUM_OF_RECENTS = 8;

// Grab HTML elements
var forecastEl = $('.forecast');
var formEl = $('form');
var searchHistoryEl = $('.search-history');

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

    console.log(`id: ${id}, max: ${max}, min: ${min}`);

    // Use the id to find the breakdown element to target
    var breakdownToTarget = $(`#breakdown-${id}`);
    // As last hour element is descriptive text, need a way to exit upcoming loop on last iteration
    var maxLoops = breakdownToTarget.find('.hour').length - 1;

    // For each hour, set the height
    breakdownToTarget.find('.hour').each(function (index) {
      console.log(index);
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

      console.log(
        `temp: ${temp}, percentage: ${percentage}, height: ${height}`
      );

      // Now update the css for this p element
      paraToTarget.css('bottom', `${height}%`);
    });
  });
}

// Function that clears forecast HTML and provides feedback when user
// puts in a search term that the API doesn't recognise
function noResultsFound() {
  forecastEl.html('');
  var feedbackEl = $('<div>');
  feedbackEl.addClass('feedback');
  feedbackEl.text('No results found. Please try again!');
  forecastEl.append(feedbackEl);
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
  forecastEl.html('');

  // add the city name to h2 element
  forecastEl.append(
    `<h2 class="city-name">${
      weatherDetails.name + ', ' + weatherDetails.countryCode
    }</h2>`
  );

  // Come up with an array of all days covered in forecast
  var start = weatherDetails.forecasts[0].dayMonth;
  var end =
    weatherDetails.forecasts[weatherDetails.forecasts.length - 1].dayMonth;
  var days = [];
  for (var i = start; i <= end; i++) {
    days.push(i);
  }

  console.log(days);

  // Create the days tab row and append it to forecastEl
  var tabsEl = $('<div>');
  tabsEl.addClass('row days');
  forecastEl.append(tabsEl);

  // For each day, do stuff
  for (let i = 0; i < days.length; i++) {
    console.log(`day: ${i}`);
    // filter forecasts by this day
    var thisDaysForecasts = weatherDetails.forecasts.filter(
      (forecast) => forecast.dayMonth === days[i]
    );

    var todaysMoment = moment(thisDaysForecasts[0].unix, 'X');

    var today = {
      dateDay: Number(todaysMoment.format('D')),
      dateShort: todaysMoment.format('ddd D'),
      dateLong: todaysMoment.format('dddd D'),
    };

    console.log(thisDaysForecasts);

    if (i === 0) {
      // if the first day is the user's day as well, then show 'Today' in day tab
      if (today.dateDay == moment().format('D')) {
        today.dateShort = 'Today';
      }
      switch (true) {
        case thisDaysForecasts.length === 8:
          today.icon = thisDaysForecasts[4].icon;
          today.description = thisDaysForecasts[4].description;
          break;
        case thisDaysForecasts.length === 7:
          today.icon = thisDaysForecasts[3].icon;
          today.description = thisDaysForecasts[3].description;
          break;
        case thisDaysForecasts.length === 6:
          today.icon = thisDaysForecasts[2].icon;
          today.description = thisDaysForecasts[2].description;
          break;
        case thisDaysForecasts.length === 5:
          console.log(thisDaysForecasts[1]);
          today.icon = thisDaysForecasts[1].icon;
          today.description = thisDaysForecasts[1].description;
          break;
        default:
          today.icon = thisDaysForecasts[0].icon;
          today.description = thisDaysForecasts[0].description;
      }
    }

    if (i === days.length - 1) {
      switch (true) {
        case thisDaysForecasts.length === 1:
          today.icon = thisDaysForecasts[0].icon;
          today.description = thisDaysForecasts[0].description;
          break;
        case thisDaysForecasts.length === 2:
          today.icon = thisDaysForecasts[1].icon;
          today.description = thisDaysForecasts[1].description;
          break;
        case thisDaysForecasts.length === 3:
          today.icon = thisDaysForecasts[2].icon;
          today.description = thisDaysForecasts[2].description;
          break;
        case thisDaysForecasts.length === 4:
          today.icon = thisDaysForecasts[3].icon;
          today.description = thisDaysForecasts[3].description;
          break;
        default:
          today.icon = thisDaysForecasts[4].icon;
          today.description = thisDaysForecasts[4].description;
      }
    }

    if (i > 0 && i < days.length - 1) {
      today.icon = thisDaysForecasts[4].icon;
      today.description = thisDaysForecasts[4].description;
    }

    today.description =
      today.description.charAt(0).toUpperCase() + today.description.slice(1);

    today.iconurl = 'http://openweathermap.org/img/w/' + today.icon + '.png';

    //initialise tracking variables
    var high = -99;
    var low = 99;

    // create a breakdown element for this day
    var breakdownEl = $('<div>');
    breakdownEl.addClass('day-breakdown column hide');
    breakdownEl.attr('id', `breakdown-${today.dateDay}`);
    // add today's date
    breakdownEl.append(`
      <h3 class="day-date">${today.dateLong}</h3>
    `);
    var timeEl = $('<div>');
    timeEl.addClass('day row');
    breakdownEl.append(timeEl);

    // Iterate through each time period
    for (let i = 0; i < thisDaysForecasts.length; i++) {
      // update tracking variables
      if (thisDaysForecasts[i].temp > high) {
        high = thisDaysForecasts[i].temp;
      }
      if (thisDaysForecasts[i].temp < low) {
        low = thisDaysForecasts[i].temp;
      }

      var iconurl =
        'http://openweathermap.org/img/w/' + thisDaysForecasts[i].icon + '.png';

      // add time deets
      timeEl.append(`
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
    // "fas fa-long-arrow-alt-down" "fas fa-arrow-circle-down"

    timeEl.append(`
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

    console.log(today);
    // now that you've iterated through each time period for this day,
    // you can add a new day tab which gives the high and low temp
    tabsEl.append(`
      <div class="day-tab column" id="tab-${today.dateDay}">
        <p class="f-1">${today.dateShort}</p>
        <div class="tab-details row align-center">
          <div class="f-1"><img src="${today.iconurl}" alt="${
      today.description
    }"></div>
          <div class="column text-center f-1">
            <p class="max">${Math.round(high)}°</p>
            <p class="min"><small>${Math.round(low)}°</small></p>
          </div>
        </div>
        <p class="tab-description f-1 hide">${today.description}</p>
      </div>
    `);

    // finally, we can add the breakdown element to the forecast
    forecastEl.append(breakdownEl);
  }
  // sort out bigging up tab, and showing breakdown for this day
  $(`#breakdown-${start}`).removeClass('hide');
  $(`#tab-${start}`).addClass('selected');
  $(`#tab-${start}`).children('.tab-description').removeClass('hide');
  $('.search').select();
  setTempHeight();
}

// Function that handles the API calls, filtering the data required about 41 forecasts
function doForecast(city, countryParam) {
  var weatherDetails = {};
  // var numTodayForecasts;

  $.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${
      city + countryParam
    }&limit=1&appid=${apiKey}`
  ).then(function (result) {
    if (result.length === 0) {
      noResultsFound();
      return;
    }
    // console.log(result[0]);
    weatherDetails.lat = result[0].lat;
    weatherDetails.lon = result[0].lon;
    weatherDetails.name = result[0].name;
    weatherDetails.countryCode = result[0].country;
    $.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${weatherDetails.lat}&lon=${weatherDetails.lon}&appid=${apiKey}&units=metric`
    ).then(function (weatherNow) {
      // weatherDetails.todayForecasts = getNumTodayForecasts(weatherNow.dt);
      weatherDetails.timezone = weatherNow.timezone;
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
      };

      $.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherDetails.lat}&lon=${weatherDetails.lon}&appid=${apiKey}&units=metric`
      ).then(function (forecast) {
        weatherDetails.forecasts = forecast.list.map((aForecast) => ({
          unix: aForecast.dt + weatherDetails.timezone,
          dayMonth: Number(
            moment(aForecast.dt + weatherDetails.timezone, 'X').format('D')
          ),
          // dayWeek: moment(aForecast.dt, 'X').format('ddd'),
          hour: moment(aForecast.dt + weatherDetails.timezone, 'X').format(
            'HH:mm'
          ),
          temp: aForecast.main.temp,
          humidity: aForecast.main.humidity,
          description: aForecast.weather[0].description,
          icon: aForecast.weather[0].icon,
          windSpeed: (function convertMetersPerSecondToMilesPerHour(
            metersPerSecond
          ) {
            return metersPerSecond * 2.23693629;
          })(aForecast.wind.speed),
          windDirection: aForecast.wind.deg,
        }));

        weatherDetails.forecasts.unshift(weatherDetails.now);
        delete weatherDetails.now;
        console.log(weatherDetails);

        showForecast(weatherDetails);

        updateRecentSearches(weatherDetails.name, weatherDetails.countryCode);
      });
    });
  });
}

// Function to load on page load
function init() {
  // Form submit event listener
  formEl.submit(function (event) {
    event.preventDefault();

    var searchText = $('#search-text').val().trim();
    if (searchText === '') {
      return;
    }

    var countryParam = $('input[name="country"]:checked').val();

    if (countryParam === 'gb') {
      countryParam = ',GB';
    } else {
      countryParam = '';
    }
    doForecast(searchText, countryParam);
  });

  // Day tab event listener
  forecastEl.on('click', '.day-tab', function () {
    switchForecast($(this));
  });

  // Recent search event listener
  searchHistoryEl.on('click', 'button', function () {
    var searchParams = $(this).val().split(',');
    searchParams[1] = ',' + searchParams[1];
    console.log(searchParams);
    doForecast(searchParams[0], searchParams[1]);
    $('.search').val(`${searchParams[0]}`);
    $('.search').select();
  });

  // Removing recent search event listener
  searchHistoryEl.on('click', '.close', function (event) {
    // stop the other event on the button from happening
    event.stopPropagation();
    var cityToRemove = $(this).parent().val();
    var index = recentSearches.indexOf(cityToRemove);
    if (index !== -1) {
      recentSearches.splice(index, 1);
      if (recentSearches.length === 0) {
        localStorage.removeItem('weather_search_history');
        forecastEl.html('');
        forecastEl.append(`
          <div class="feedback">
            <p>Use the search box on the left to get started.</p>
          </div>
        `);
      } else {
        localStorage.setItem(
          'weather_search_history',
          JSON.stringify(recentSearches)
        );
      }
    }
    renderRecentSearches();
  });

  renderRecentSearches();
}

init();
