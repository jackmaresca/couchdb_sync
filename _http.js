var opts = {
  host: 'localhostt',
  port: 9999,
  path: '/cars/d5',
  method: 'POST',
};
console.log("start");
var http = require('http');
var req = http.request(opts, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
req.end();
