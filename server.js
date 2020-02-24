/* Data endpoint */

// Preload endpoint with some example posts
let projectData = [
  {
    location: 'Edinburgh, GB',
    temperature: 9,
    date: '12.02.20',
    content: 'Tempus, ipsum penatibus volutpat! Massa lacinia faucibus fusce hendrerit curabitur mus purus. Sed mauris litora augue penatibus? Quis natoque platea cras magnis leo. Nisl ligula lorem nec ipsum nascetur nostra bibendum.',
    iconCode: '04d',
    id: 'ex1'
  },
  {
    location: 'New York, US',
    temperature: 13,
    date: '15.02.20',
    content: 'Et eleifend magna habitant tortor egestas. Himenaeos risus magna ultrices tellus a ut, suscipit ullamcorper. Maecenas curae; penatibus dis turpis, inceptos suscipit fusce himenaeos cubilia habitant.',
    iconCode: '01d',
    id: 'ex2'
  },
  {
    location: 'Leicester, GB',
    temperature: 10,
    date: '18.02.20',
    content: 'Tristique congue ridiculus purus magnis curae; faucibus venenatis neque dictum. Dignissim sem vel tempus inceptos pellentesque facilisi vestibulum. Rhoncus odio amet tincidunt conubia dolor quis massa.',
    iconCode: '09d',
    id: 'ex3'
  }
]

/* Create express server */
const express = require('express')
const app = express()

/* Body parser dependency */
const bodyParser = require('body-parser')

/* Middleware */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const cors = require('cors')
app.use(cors())

/* Direct server to project folder */
app.use(express.static('website'))

/* Choose port and start up server */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log('Server running on localhost: ' + PORT))

/* Routes */

// Get all
app.get('/all', (req, res) => {
  if (projectData.length > 0) {
    res.send(projectData)
  } else {
    res.send(null)
  }
})

// Get latest post
app.get('/latest', (req, res) => {
  const latestPost = projectData[projectData.length - 1]
  res.send(latestPost)
})

// Add post
app.post('/add', (req, res) => {
  console.log(req.body)
  projectData.push(req.body)
  res.send(req.body)
})

// Remove post
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id
  console.log('ID to be deleted: ' + id)
  projectData = projectData.filter((entry) => entry.id !== id)
  res.send({});
})
