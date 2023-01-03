# Development

So I want to document my thoughts and experiences when working on this app in a cohesive way so that I can come back to this app and understand how I did a lot of the stuff in it. I think some kind of blog post would be suitable. Or maybe just a separate md file, which I've now created.

I'll deal with this later (it's now New Year's Eve 2022).

![screenshot of console output](img/ss1.png)

![screenshot of console output](img/ss2.png)

More details (better description, fuller instructions including screenshots, credit section) later.

**Update 28 Dec**: after doing some more work, particularly adding a 'Now' section, the look of the app has changed to something below.

![screenshot of console output](img/ss3.png)

I've spent a ton of work on this to be honest but I've learnt a lot. It's really important that I document how I did several things, if only so that I can look back and understand things myself. Off the top of my head, the things that stand out are:

- `position: absolute`, `position: relative`, for taking elements out of the flow of the page but bounded by its parent. Really useful for positioning items (e.g., the 'x' close button for recent searches, the larger icon in the 'Now' panel, the temperatures in the hourly breakdown)
- A lot of stuff to do with Moment.js, particularly understanding UTC time, UTC offsets, yada yada
- Using global CSS rules, e.g. a `wrapper` class for wrapping elements to a certain width or with common padding and margin
- using `.map()` and `.filter()` to cherry-pick data, e.g. getting all the days of the month from a single property in an array of objects, or filtering an array of forecasts based on a condition.
- a bit of stuff on regex or character mapping (`.match()`) which was useful for ensuring the -ve sign was considered when converting a string to a number
- integrating maps, so both Leaflet and OpenStreetMap
- stopping event propagation, which was important when the 'x' was clicked in a parent element that also had an event listener

On top of that

- more practice with translating logic or pseudocode into actual code
- dealing with error debugging (a lot of console.log()ing)
- spending a bunch of time trying to get things to look a certain way, or position themselves how I want them to
- spending an even greater amount of time on colour schemes and layout (struggled big time here tbh)
- more practice with jQuery and taking advantage of how it makes some things easier, particularly traversal, looping and fetching API data

Things I learnt while working on this app...

### Taking elements out of the flow of the page

By setting an element to `position: absolute` and setting a parent element (not necessarily direct) to `position: relative` you can take that child element out of the flow of the page and position it exactly relative to the parent. So, for example, to position two child elements to be exactly in the centre of the parent element, the following CSS might look like:

<code>
.parent {
  height:40px;
  position: relative;
}

.child1 p {
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%,-50%);
z-index: 2;
}

.child2 img {
position: absolute
left: 50%;
top:50%;
z-index: 1;
}
</code>

Notice the `z-index` property too. This is used to indicate which element should have priority. So here the p element has a higher z-index over the img element and should be seen over the image.

Taking elements out of the flow of the page was particularly useful for:

- adding a small 'x' in the corner of recent search buttons
- positioning the weather icon in the top right corner of the 'Now' panel
- adding wind direction images and overlaying it with the wind speed
- positioning tooltips to appear directly below an image when the mouse hovers over it
- positioning the temperature element to be at a certain height relative to the max and min temp that day

### Understanding how to use Moment.js for being timezone-aware

The weather data included unix-based timestamps in UTC time, and timezone 'shifts' representing the number of seconds to shift the timestamp in order to get the local time.

To show the local time for each location and to indicate how many hours it was different from UTC time, I had to make use of the Moment.js library.

To work out the local 'moment' of aForecast:

- `localMoment = moment.unix(aForecast.dt).utcOffset(aForecast.timezone / 60)`

Then you could chain on a `.format('yada yada')` to it. The way it works is that `utcOffset()` receives either a positive or negative offset in terms of _minutes_ to adjust the time, hence why the timezone shift is divided by 60 to get it into minutes.

To do a local clock or timer, I had to do a few things:

- work out the timezone offset in minutes: `timezoneOffset = localMoment.utcOffset()` gives the number of minutes a moment is offset from UTC time by.
- use this offset on the user's local time `currentTime = moment().utcOffset(timezoneOffset)`

It works correctly based on my time, but my local time is UTC+0000, so not sure if it would work the same if a user from a different timezone were to use it. Maybe I should look into that...

### Global CSS rules
