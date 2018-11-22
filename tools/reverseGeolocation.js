const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Call this function with lat, long. Returns the name of the nearest neighborhood
function getLocation(lat, long) {
  // Cant geolocate undefined coordaintes.
  if (lat === undefined || long === undefined) return 'Coordinates undefined';

  const host = 'https://maps.googleapis.com';
  const path = '/maps/api/geocode/json';
  const parameters = `?latlng=${lat},${long}&key=${process.env.GOOGLE_API_KEY}`;
  const url = host + path + parameters;

  function httpGet(theUrl) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
  }

  const result = JSON.parse(httpGet(url));
  const locations = {
    city: result.results[0].address_components[3].long_name,
    neighborhood: result.results[0].address_components[2].long_name,
    street: result.results[0].address_components[1].long_name,
  };

  return (locations);
}

module.exports = {
  getLocation,
};
