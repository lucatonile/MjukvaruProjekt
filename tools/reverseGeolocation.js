// eslint-disable-next-line prefer-destructuring
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Validate that lat, long coordinates are valid.
//  lat is -90 < lat < 90 and long is -180 < long < 180.
function validateCoordinates(lat, long) {
  console.log('validating coordinates');
  const latInt = parseInt(lat, 10);
  const longInt = parseInt(long, 10);
  console.log(latInt);
  console.log(longInt);
  if (latInt < -90 || latInt > 90 || Number.isNaN(latInt)) {
    console.log('returning lat out of bounds or nan');
    return { error: 'Lat out of bounds or not a number' };
  }
  if (longInt < -180 || longInt > 180 || Number.isNaN(longInt)) {
    console.log('returning log out of bounds or nan');
    return { error: 'Long out of bounds or not a number' };
  }
  console.log('returning true');
  return 'success';
}

// Call this function with lat, long. Returns the name of the nearest neighborhood
function getLocation(lat, long) {
  // Cant geolocate undefined coordaintes.
  if (lat === undefined || long === undefined) {
    return { error: 'Lat or long undefined or wrong type' };
  }

  // Parse POST request lat/long as ints to validate their value.
  const status = validateCoordinates(lat, long);
  // If return not true, an err msg will be returned from the func call.
  if (status !== 'success') return status;

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
  validateCoordinates,
};
