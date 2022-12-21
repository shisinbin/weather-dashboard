// app logic goes here
var forecastEl = $('.forecast');
var formEl = $('form');

function init() {
  formEl.submit(function (event) {
    event.preventDefault();
  });
}

init();
