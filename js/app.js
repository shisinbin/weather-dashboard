var apiKey = '0e8f67bf6ac0e37689d7edea5f37f808';
var recentSearches = [];
const MAX_NUM_OF_RECENTS = 6;

// app logic goes here
var forecastEl = $('.forecast');
var formEl = $('form');

var searchHistoryEl = $('.search-history');

// function getNumTodayForecasts(unixTime) {
//   var hourNow = Number(moment(unixTime, 'X').format('H'));
//   var num;
//   switch (true) {
//     case hourNow < 3:
//       num = 7;
//       break;
//     case hourNow >= 3 && hourNow < 6:
//       num = 6;
//       break;
//     case hourNow >= 6 && hourNow < 9:
//       num = 5;
//       break;
//     case hourNow >= 9 && hourNow < 12:
//       num = 4;
//       break;
//     case hourNow >= 12 && hourNow < 15:
//       num = 3;
//       break;
//     case hourNow >= 15 && hourNow < 18:
//       num = 2;
//       break;
//     case hourNow >= 18 && hourNow < 21:
//       num = 1;
//       break;
//     case hourNow >= 21 && hourNow < 24:
//       num = 0;
//       break;
//     default:
//       num = -1;
//   }
//   return num;
// }

function convertMetersPerSecondToMilesPerHour(metersPerSecond) {
  return metersPerSecond * 2.23693629;
}

function updateRecentSearches(newSuccessfulSearch, countryCode) {
  var combinedSearch =
    newSuccessfulSearch.toLowerCase() + ',' + countryCode.toLowerCase();
  // Check to see if search already exists
  var index = recentSearches.indexOf(`${combinedSearch}`);
  if (index !== -1) {
    console.log('we here');
    // If it does, remove it from recent searches
    recentSearches.splice(index, 1);
  }

  console.log('now we here');

  // Add this new search to beginning of list
  recentSearches.unshift(combinedSearch);

  console.log(`this is recent searches: ${recentSearches}`);

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

function renderRecentSearches() {
  searchHistoryEl.html('');

  recentSearches = JSON.parse(localStorage.getItem('weather_search_history'));

  if (recentSearches === null) {
    recentSearches = [];
    console.log('no recent searches');
    return;
  }

  for (var cityAndCode of recentSearches) {
    var city = cityAndCode.split(',')[0];
    city = city[0].toUpperCase() + city.slice(1);
    searchHistoryEl.append(`
      <button value="${cityAndCode}" class="history-button">
        <span class="button-text">${city}</span>
        <span class="close">x</span>
      </button>
    `);
  }
}

function switchForecast(element) {
  var tab = $(element);
  var id = tab.attr('id').split('-')[1];
  var tabToChange = $(`#tab-${id}`);

  // firstly, remove the selected class from all tabs
  element.parent().children().removeClass('selected');
  element.parent().children().children('.tab-description').addClass('hide');
  tabToChange.addClass('selected');
  tabToChange.children('.tab-description').removeClass('hide');

  forecastEl.children('.day-breakdown').addClass('hide');
  forecastEl.children(`#breakdown-${id}`).removeClass('hide');
}

function showForecast(weatherDetails) {
  // Clear the old html
  forecastEl.html('');

  // add the city name
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
      today.dateShort = 'Today';
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
          <div><img src="${iconurl}"></div>
          <div class="temp"><p>${Math.round(
            thisDaysForecasts[i].temp
          )}°</p></div>
          <p>${Math.round(
            thisDaysForecasts[i].windSpeed
          )} <i class="fas fa-arrow-circle-down" style="transform: rotate(${
        thisDaysForecasts[i].windDirection
      }deg); -webkit-transform: rotate(${
        thisDaysForecasts[i].windDirection
      }deg)"></i></p>
          <p>${thisDaysForecasts[i].humidity}%</p>
        </div>
      `);
    }

    timeEl.append(`
      <div class="hour column hour-details">
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
          <div class="f-1"><img src="${today.iconurl}"></div>
          <div class="column text-center f-1">
            <p>${Math.round(high)}°</p>
            <p><small>${Math.round(low)}°</small></p>
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
}

function doForecast(city, countryParam) {
  var weatherDetails = {};
  // var numTodayForecasts;

  $.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${
      city + countryParam
    }&limit=1&appid=${apiKey}`
  ).then(function (result) {
    if (result.length === 0) {
      console.log('no results!');
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
      weatherDetails.now = {
        unix: weatherNow.dt,
        dayMonth: Number(moment(weatherNow.dt, 'X').format('D')),
        // dayWeek: moment(weatherNow.dt, 'X').format('ddd'),
        hour: moment(weatherNow.dt, 'X').format('HH:mm'),
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
          unix: aForecast.dt,
          dayMonth: Number(moment(aForecast.dt, 'X').format('D')),
          // dayWeek: moment(aForecast.dt, 'X').format('ddd'),
          hour: moment(aForecast.dt, 'X').format('HH:mm'),
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

function init() {
  // add form event listener
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

  // tab event listener
  forecastEl.on('click', '.day-tab', function () {
    switchForecast($(this));
  });

  // recent search event listener
  searchHistoryEl.on('click', 'button', function () {
    var searchParams = $(this).val().split(',');
    searchParams[1] = ',' + searchParams[1];
    console.log(searchParams);
    doForecast(searchParams[0], searchParams[1]);
  });

  searchHistoryEl.on('click', '.close', function (event) {
    event.stopPropagation();
    var cityToRemove = $(this).parent().val();
    var index = recentSearches.indexOf(cityToRemove);
    if (index !== -1) {
      recentSearches.splice(index, 1);
      if (recentSearches.length === 0) {
        localStorage.removeItem('weather_search_history');
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
