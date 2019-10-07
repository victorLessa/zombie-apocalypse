const fs = require('fs');
const path = require('path');

let routes = {
}

fs.readdirSync(__dirname).forEach(function (filename) {
  let file = path.join(__dirname, filename)
  const route = require(file)
  let basename = path.basename(`${__dirname}/${filename}`, '.js')
  routes[basename] = route
});
module.exports = routes;