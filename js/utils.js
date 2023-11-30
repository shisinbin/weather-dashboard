// Converts 'new york county,us' into 'New York County, US'
export function formatRecentSearchText(cityAndCode) {
  const parts = cityAndCode.split(',');
  const capitalisedCity = parts[0]
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

  return `${capitalisedCity}, ${parts[1].toUpperCase()}`;
}

// Converts a time shift to be more readable,
// e.g. 19800 to '+0530', -18000 to '-0500'
export function secondsToReadableTimeShift(timeShiftInSeconds) {
  const sign = Math.sign(timeShiftInSeconds) >= 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(timeShiftInSeconds) / 3600);
  const minutes = Math.round(
    (Math.abs(timeShiftInSeconds) % 3600) / 60
  );

  let readableTimeShift = sign;
  readableTimeShift += hours.toString().padStart(2, '0');
  readableTimeShift += minutes.toString().padStart(2, '0');

  return readableTimeShift;
}

// Converts a wind direction in degrees to cardinal direction
export function getWindDirectionContext(direction) {
  switch (true) {
    case direction >= 337.5 || direction < 22.5:
      return 'North';
    case direction >= 22.5 && direction < 67.5:
      return 'Northeast';
    case direction >= 67.5 && direction < 112.5:
      return 'East';
    case direction >= 112.5 && direction < 157.5:
      return 'Southeast';
    case direction >= 157.5 && direction < 202.5:
      return 'South';
    case direction >= 202.5 && direction < 247.5:
      return 'Southwest';
    case direction >= 247.5 && direction < 292.5:
      return 'West';
    case direction >= 292.5 && direction < 337.5:
      return 'Northwest';
    default:
      return 'Invalid direction';
  }
}

export function metresToKilometres(valueInMetres) {
  const valueInKilometres = valueInMetres / 1000;

  if (Number.isInteger(valueInKilometres)) {
    return valueInKilometres;
  }

  return Number(valueInKilometres.toFixed(1));
}

export function convertMetersPerSecondToMilesPerHour(
  metersPerSecond
) {
  return metersPerSecond * 2.23693629;
}

export function capitaliseFirstCharacter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// export function secondsToReadableTimeShift(timeShiftInSeconds) {
//   const timeShiftInHours = timeShiftInSeconds / 3600;

//   // Convert the time shift from hours to hours and minutes
//   const hours = Math.floor(timeShiftInHours);
//   const minutes = Math.round((timeShiftInHours - hours) * 60);

//   // Format the time shift as a string with inline if statements and concatenation
//   const readableTimeShift =
//     (hours < 0 ? '-' : '+') +
//     (Math.abs(hours) < 10 ? '0' : '') +
//     Math.abs(hours) +
//     (minutes < 10 ? '0' : '') +
//     minutes;

//   return readableTimeShift;
// }
