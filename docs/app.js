/** ************** GLOBAL VARIABLES *****************/

// Weather API url parts
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip='
const apiKey = '&appid=435c250cfdd45953cf40e7b8134adbb6'

// Weather icon url parts
const iconUrlStart = 'http://openweathermap.org/img/wn/'
const iconUrlEnd = '@2x.png'

// A crude varaible to generate unique ID's for posts
let crudeId = 0

/** ******** FUNCTIONS TO RUN IMMEDIATELY ***********/

initialiseUI()

/** *************** EVENT LISTENERS ******************/

// For publish buttom
const submitButton = document.getElementById('generate')
submitButton.addEventListener('click', submitHandler)

// For returning zip code to orginal style after invalid zip entered
const zip = document.getElementById('zip')
zip.addEventListener('click', (event) => zipClickHandler(event))

// For changing placeholder text according to country selected
const countrySelector = document.getElementById('country')
countrySelector.addEventListener('change', (event) => selectHandler(event))

// For potential delete click
const content = document.querySelector('content')
content.addEventListener('click', (event) => deleteHandler(event))

/** **************** EVENT HANDLERS *******************/

// Change palceholder text according to country selected
function selectHandler (event) {
  const zip = document.getElementById('zip')
  const value = event.target.value
  if (value === 'gb') {
    zip.setAttribute('placeholder', 'Enter post code. Eg: SW9')
  } else if (value === 'us') {
    zip.setAttribute('placeholder', 'Enter zip code. Eg: 94040')
  }
}

// Remove 'invalid' class from zip code field when user reattempts a zip code
function zipClickHandler (event) {
  event.target.classList.remove('invalid')
}

// Publish post
function submitHandler () {
  // Get relevant values from input elements
  const zipCode = document.querySelector('#zip').value
  const text = document.querySelector('#feelings').value
  const countryCode = ',' + document.querySelector('#country').value

  // Build api request URL based on inputs
  const apiUrl = baseUrl + zipCode + countryCode + apiKey
  const id = crudeId.toString()
  crudeId++

  // Get today's date as a string
  const today = dateString()

  // Fetch weather data from Open Weather map
  retrieveData(apiUrl)
    .then(async function (data) {
      try {
      // Create a new journal entry object
        const entry = {
          location: data.name + ', ' + data.sys.country,
          temperature: Math.round(data.main.temp - 273.15),
          date: today,
          content: text,
          iconCode: data.weather[0].icon,
          id: id
        }

        // Post new entry to back end
        await postData('http://localhost:8000/add', entry)

        // Update UI with new journal entry
        updateUi()
      } catch (error) {
        console.log(error)
        // Make zip code field red to indicate invalid zip code
        document.querySelector('#zip').classList.add('invalid')
      }
    })
}

async function deleteHandler (event) {
  let target = event.target

  // Test if the target is a remove button
  if (target.className === 'remove-button') {
    // Find the post that the remove button belongs to
    while (target.className !== 'weather-post') {
      target = target.parentElement
    }
    // Use the id held in the post's dataset to build DELETE request url
    const id = target.dataset.id
    await deleteData('http://localhost:8000/delete/' + id)

    // Remove post from the UI
    removeFromUI(target)
  }
}

/** **************** API REQUESTS *******************/

// Get data
async function retrieveData (url = '') {
  const request = await fetch(url)
  try {
    const allData = await request.json()
    return allData
  } catch (error) {
    console.log(error)
  }
}

// Post data
async function postData (url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  try {
    const newData = await response.json()
    return newData
  } catch (error) {
    console.log(error)
  }
}

// Delete post
async function deleteData (url = '', id = '') {
  const deleteUrl = url + id
  const response = await fetch(deleteUrl, {
    method: 'delete'
  })

  try {
    const deleteResponse = await response.json()
    return deleteResponse
  } catch (error) {
    console.log(error)
  }
}

// Initialise UI to reflect data in server
async function initialiseUI () {
  const request = await fetch('http://localhost:8000/all')
  try {
    const allData = await request.json()
    allData.forEach(data => buildJournalEntry(data))
  } catch (error) {
    console.log(error)
  }
}

// Update UI with latest post
async function updateUi () {
  const request = await fetch('http://localhost:8000/latest')
  try {
    const latestPost = await request.json()
    buildJournalEntry(latestPost)
    document.querySelector('#feelings').value = ''
    document.querySelector('#country').value = '0'
    document.querySelector('#zip').value = ''
  } catch (error) {
    console.log(error)
  }
}

// Remove post from UI
function removeFromUI (target) {
  target.parentNode.removeChild(target)
}

/** **************** HELPER FUNCTIONS *******************/

// Build a journal entry element from journal data
function buildJournalEntry (data) {
  // Build url to fetch icon from
  const iconUrl = iconUrlStart + data.iconCode + iconUrlEnd

  // Find content element
  const content = document.querySelector('content')

  // Create journal entry card
  const newEntry = document.createElement('div')
  newEntry.classList.add('weather-post')

  // Add remove button to entry card
  const removeButton = document.createElement('img')
  removeButton.setAttribute('src', './images/remove.png')
  removeButton.setAttribute('alt', 'Remove button')
  removeButton.classList.add('remove-button')
  newEntry.appendChild(removeButton)

  // Add id data to card
  newEntry.setAttribute('data-id', data.id)

  // Create post header div
  const postHeader = document.createElement('div')
  postHeader.classList.add('post-header')

  // Create container for location and date
  const locationDateContainer = document.createElement('div')

  // Create location <p> and append to above container
  const location = document.createElement('p')
  location.classList.add('weather-location')
  location.innerText = data.location
  locationDateContainer.appendChild(location)

  // Create date <p> and append to above container
  const date = document.createElement('p')
  date.classList.add('weather-date')
  date.innerText = data.date
  locationDateContainer.appendChild(date)

  // Append location and date container to post header
  postHeader.appendChild(locationDateContainer)

  // Create and append icon to post header
  const icon = document.createElement('img')
  icon.setAttribute('src', iconUrl)
  icon.setAttribute('alt', 'Weather icon')
  icon.classList.add('weather-icon')
  postHeader.appendChild(icon)

  // Create and append temperature to post header
  const temperature = document.createElement('p')
  temperature.classList.add('weather-temperature')
  temperature.innerText = `${data.temperature}\xB0c`
  postHeader.appendChild(temperature)

  // Append post header to post
  newEntry.appendChild(postHeader)

  // Create and append journal text to post
  const text = document.createElement('p')
  text.classList.add('weather-text')
  text.innerText = data.content
  newEntry.appendChild(text)

  // Append journal entry to content
  content.prepend(newEntry)
}

// Get the date in a string formatted dd/mm/yyyy
function dateString () {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  const dateString = dd + '.' + mm + '.' + yyyy
  return dateString
}
