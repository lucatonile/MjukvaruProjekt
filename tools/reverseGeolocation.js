// eslint-disable-next-line prefer-destructuring
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Validate that lat, long coordinates are valid.
//  lat is -90 < lat < 90 and long is -180 < long < 180.
function validateCoordinates(lat, long) {
  const latInt = parseInt(lat, 10);
  const longInt = parseInt(long, 10);
  if (latInt < -90 || latInt > 90 || Number.isNaN(latInt)) {
    return { error: 'Lat out of bounds or not a number' };
  }
  if (longInt < -180 || longInt > 180 || Number.isNaN(longInt)) {
    return { error: 'Long out of bounds or not a number' };
  }
  return 'success';
}

// Call this function with lat, long. Returns the name of the nearest neighborhood
function getLocation(lat, long) {
  // Cant geolocate undefined coordaintes.
  if (lat === undefined || long === undefined) {
    return { error: 'Lat or long undefined or wrong type' };
  }
  if (!process.env.GOOGLE_API_KEY) {
    return { error: 'Local env variable Google API Key not set' };
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
  const unParsedResult = httpGet(url);
  const result = JSON.parse(unParsedResult);

  const addressComponents = result.results[0].address_components;

  const locations = {
    city: '',
    neighborhood: '',
    street: '',
  };

  for (let i = 0; i < addressComponents.length; i += 1) {
    for (let j = 0; j < addressComponents[i].types.length; j += 1) {
      // console.log(addressComponents[i].types[j]);
      // console.log(addressComponents[i]);
      if (addressComponents[i].types[j].includes('sublocality')) {
        locations.neighborhood = addressComponents[i].long_name;
        // console.log('!!!');
        // console.log(`adding a sublocality: ${locations.neighborhood}`);
        // console.log('!!!');
      }
      if (addressComponents[i].types[j].includes('postal_town')) {
        locations.city = addressComponents[i].long_name;
        // console.log('!!!');
        // console.log(`adding postal_town: ${locations.city}`);
        // console.log('!!!');
      }
      if (addressComponents[i].types[j].includes('route')) {
        locations.street = addressComponents[i].long_name;
        // console.log('!!!');
        // console.log(`adding a route: ${locations.street}`);
        // console.log('!!!');
      }
    }
  }

  return (locations);
}

module.exports = {
  getLocation,
  validateCoordinates,
};
