var request = require('request');
// var r = request.put('http://localhost:9999/cars/d6',function (error, response, body) {
var r = request.get('http://www.heise.de',function (error, response, body) {
  console.log(error);
  console.log(response.statusCode);
  if (!error && response.statusCode == 200) {
    console.log(body) // Print the google web page.
  }
});
