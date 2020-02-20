/* Data endpoint */

//let journalData = [];

let projectData = [
  { location: 'UK',
    temperature: 9,
    date: '12.02.20',
    content: 'Tempus, ipsum penatibus volutpat! Massa lacinia faucibus fusce hendrerit curabitur mus purus. Sed mauris litora augue penatibus? Quis natoque platea cras magnis leo. Nisl ligula lorem nec ipsum nascetur nostra bibendum.'
  },
  { location: 'France',
    temperature: 13,
    date: '15.02.20',
    content: 'Et eleifend magna habitant tortor egestas. Himenaeos risus magna ultrices tellus a ut, suscipit ullamcorper. Maecenas curae; penatibus dis turpis, inceptos suscipit fusce himenaeos cubilia habitant.'
  },
  { location: 'Germany',
    temperature: 10,
    date: '18.02.20',
    content: 'Tristique congue ridiculus purus magnis curae; faucibus venenatis neque dictum. Dignissim sem vel tempus inceptos pellentesque facilisi vestibulum. Rhoncus odio amet tincidunt conubia dolor quis massa.'
  },
];

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

app.get('/all', (req, res) => {
  res.send(projectData);
});

app.post('/add', (req, res) => {
  console.log(req.body);
  projectData.push(req.body);
})