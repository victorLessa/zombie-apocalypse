require('dotenv').config();

const app = require('./app');

const port = process.env.PORT;

app.listen(port || 3000, function () {
  console.log(`server listen ${port}`);
});