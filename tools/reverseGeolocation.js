// eslint-disable-next-line prefer-destructuring
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Call this function with lat, long. Returns the name of the nearest neighborhood
function getLocation(lat, long) {
  // Cant geolocate undefined coordaintes.
  if (lat === undefined || long === undefined) {
    return { error: 'Lat or long undefined or wrong type' };
  }

  // Parse POST request lat/long as ints to validate their value.
  //  lat is -90 < lat < 90 and long is -180 < long < 180.
  const latAsInt = parseInt(lat, 10);
  const longAsInt = parseInt(long, 10);
  if (latAsInt < -90 || latAsInt > 90 || Number.isNaN(latAsInt)) {
    return { error: 'Lat out of bounds or not a number' };
  }
  if (longAsInt < -180 || longAsInt > 180 || Number.isNaN(longAsInt)) {
    return { error: 'Long out of bounds or not a number' };
  }

  // Lat and long values are validated. Set up the Google Geolocation API call.
  const host = 'https://maps.googleapis.com';
  const path = '/maps/api/geocode/json';
  const parameters = `?latlng=${lat},${long}&key=${process.env.GOOGLE_API_KEY}`;
  const url = host + path + parameters;

  // Define the HTTP call and perform it.
  function httpGet(theUrl) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
  }

  const result = JSON.parse(httpGet(url));

  // Try populating location with the data from the API call.
  let locations = null;
  try {
    locations = {
      city: result.results[0].address_components[3].long_name,
      neighborhood: result.results[0].address_components[2].long_name,
      street: result.results[0].address_components[1].long_name,
    };
  } catch (e) {
    locations = { error: `Error: ${e}, could not get correct parameters from geolocation api return` };
  }

  return (locations);
}

module.exports = {
  getLocation,
};
