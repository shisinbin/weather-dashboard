var apiKey = '0e8f67bf6ac0e37689d7edea5f37f808';

// app logic goes here
var forecastEl = $('.forecast');
var formEl = $('form');

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

function showForecast(weatherDetails) {
  // Clear the old html
  forecastEl.html('');

  // add the city name
  forecastEl.append(
    `<h2>${weatherDetails.name + ', ' + weatherDetails.countryCode}</h2>`
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

    //initialise tracking variables
    var high = -99;
    var low = 99;

    // create a breakdown element for this day
    var breakdownEl = $('<div>');
    breakdownEl.addClass('day-breakdown column');
    // add today's date
    breakdownEl.append(`
      <h3 class="day-date">${todaysMoment.format('dddd D')}</h3>
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
        <div class="hour">
          <p>${thisDaysForecasts[i].hour}</p>
          <img src="${iconurl}">
          <p>${Math.round(thisDaysForecasts[i].temp)}°</p>
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

    // now that you've iterated through each time period for this day,
    // you can add a new day tab which gives the high and low temp
    tabsEl.append(`
      <div class="day-tab column justify-space-between">
        <p>${todaysMoment.format('ddd D')}</p>
        <div class="row align-center justify-space-between">
          <i class="fas fa-cloud-rain"></i>
          <div class="column">
            <p>${Math.round(high)}°</p>
            <p><small>${Math.round(low)}°</small></p>
          </div>
        </div>
      </div>
    `);

    // finally, we can add the breakdown element to the forecast
    forecastEl.append(breakdownEl);
  }
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
      });
    });
  });
}

function init() {
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
}

init();
