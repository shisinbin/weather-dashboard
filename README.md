# Weather Dashboard

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white) <img alt='moment.js badge' src='https://shields.io/badge/Moment.js-grey?logo=appveyor&style=for-the-badge'>

<p style="text-align:left" width="100%">
    <img width="80%" src="img/demo.gif">
</p>

## Description

Welcome to my weather dashboard app! With this app, you can view the current and forecasted weather conditions for any city in the world.

This app was built to help improve my skills with working with APIs and accessing data from a back-end server. I learned how to use the [OpenWeatherMap API](https://openweathermap.org/api) to fetch weather data and use it to dynamically update a webpage's HTML and CSS. I also learned how to work with [Leaflet](https://leafletjs.com/), a map data framework, and [Geoapify](https://www.geoapify.com/), a location-based API that I used to add an autocomplete feature for city searches.

While working on this project, I gained valuable experience in front-end development using HTML, CSS, and JavaScript. I hope you enjoy using the app as much as I enjoyed building it!

## Getting Started

To access the app, navigate to the link below in a browser on a device that supports a wide layout (or alternatively on mobile).

https://cozy-sprinkles-a45830.netlify.app/

### Searching for cities

You can search for a city by using the search bar at the top left of the page or by clicking on a recently searched city below the search bar. To make your search more specific, you can follow the city name with a comma and its country code (please refer to [ISO 3166](https://www.iso.org/obp/ui/#search) for codes).

<img width="60%" src="img/_ss1.gif">

You can also limit your searches to UK cities by checking the 'UK' radio button below the search bar, and if the API is unable to find a city that matches your search term, you will receive appropriate feedback.

### Understanding the layout

If the API is able to find a city that matches your search term, you will be presented with the weather conditions for that city.

![screenshot of a typical search result](img/_ss4.png)

The weather conditions are displayed in two sections: the current weather conditions and the forecasted weather conditions.

In the current weather conditions section, you can view current weather information (including wind speed and direction), the current date and time, and the location via an interactive map.

![screenshot of the section showing the current weather conditions](img/_ss5.png)

In the forecast section, you can view information about the weather for every third hour for the next 5-6 days. You can view the forecast for a specific day by clicking on one of the day 'tabs'. Each tab displays the maximum and minimum temperature for that day.

![screenshot of a different day's forecast being viewed](img/_ss6.png)

### Adding and removing searches to recent history

Successful city searches are stored on your local browser storage and are used to dynamically update the Recent Searches section of the webpage. A maximum of eight recent searches are displayed, listed in order of most recent to least recent. You can remove a single recent search from local storage by clicking the 'x' in the top right corner of its button.

<img width="35%" src="img/_ss6.gif" alt="city being added to recent searches">

### Mobile layout

The weather dashboard is now mobile-friendly! The following image demonstrates the functionality on mobile.

<img width="35%" src="img/demo_mobile.gif" alt="city being added to recent searches">

## Features

### Smart city search with autocomplete

Our smart city search feature uses autocomplete to provide suggestions as you type, making it easy to find the city you're looking for. Simply click on a suggestion to initiate a search.

<img width="55%" src="img/_autocomplete.gif" alt="city being added to recent searches">

### Global weather, localised for you

Get the weather information for any city in the world, displayed in terms of the local time. This means you can get accurate and timely weather forecasts no matter where you are.

<img width="55%" src="img/_timezones.gif" alt="city being added to recent searches">

### Explore any location using an interactive map

When you make a search, you'll get a map of the city's location. You can zoom in and out to explore the area.

<img width="55%" src="img/_map.gif" alt="city being added to recent searches">

## Limitations

Forecasts are only available every third hour, with a maximum of 40 forecasts (up to 5-6 days). It is not currently possible to include a chance of precipitation in the forecasts due to the limited data available (only rain volume in mm for 3 hours is provided).

The web app currently has limited support for browser sizes other than wide desktop or mobile. It may not display or function correctly on browsers with intermediate sizes.

The icon image quality is poor, which makes it difficult to increase its size, and the icons themselves are rather dated.

## Future enhancements

Right now, the app chains together a series of get requests before using the modified data to call another function. In the future, I want to use promises and handle asynchronous calls better by breaking the get requests into separate functions. This will make the app easier to maintain and perhaps faster as well.

Another thing I'd like to improve is the app's support for intermediate browser sizes. Currently, it works well on wide desktop browsers and mobile devices, but there's not much support for sizes in between. I want to make the app more responsive and look good on all browser sizes.

The app's layout and design work fine, but I would like to make it nicer and more modern. I will work on the layout and color scheme in future to make it more attractive and sleek. I also think it would be a good idea to use higher quality weather icons to make for a better overall experience, and [this resource](https://erikflowers.github.io/weather-icons/) looks like it might help.

## Credits

Wow, gonna include a bunch here. In terms of inspiration, defo BBC Weather, Met Office, and particularly TimeAndDate.com

## Documentation

Maybe links to the docs for OpenWeatherMap Api, Geoapify, jQuery UI, etc, etc
