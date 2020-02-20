
/* Create express server */
const express = require('express');
const app = express();

/* Body parser dependency */
const bodyParser = require('body-parser');

/* Middleware */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

/* Direct server to project folder */
app.use(express.static('website'));

/* Choose port and start up server */
const port = 8000;
const server = app.listen(port, ()=> console.log('Server running on localhost: ' + port));

/* Routes */

app.get('/', (req, res)=> {
  res.send('hey');
});