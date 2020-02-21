// Weather API url parts
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip='
const apiKey = '&appid=435c250cfdd45953cf40e7b8134adbb6';

// Weather icon url parts
const iconUrlStart = 'http://openweathermap.org/img/wn/';
const iconUrlEnd = '@2x.png';

// Get data
const retrieveData = async (url='') => {
  const request = await fetch(url);
  try {
    const allData = await request.json();
    return allData;
  }
  catch(error) {
    console.log(error);
  }
}

// Post data
const postData = async (url = '', data ={}) => {
  console.log('posting new data')
  const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),      
  });

  try {
    const newData = await response.json();
    console.log('posted new data')
    return newData;
  } catch(error) {
    console.log(error);
  }
}

// Initialise UI to reflect data in server
const initialiseUI = async () => {
  const request = await fetch('http://localhost:8000/all');
  try {
    const allData = await request.json();
    allData.forEach(data => buildJournalEntry(data));
  } catch (error) {
    console.log(error);
  }
}

// Update UI with latest post
const updateUi = async () => {
  console.log('Updating UI');

  const request = await fetch('http://localhost:8000/latest');
  try {
    const latestPost = await request.json();
    buildJournalEntry(latestPost);
    console.log('updated UI')
  } catch (error) {
    console.log(error);
  }
}

const submitButton = document.getElementById('generate');
submitButton.addEventListener('click', submitHandler);

function submitHandler() {
  publishPost();
}

const publishPost = () => {
  const zipCode = document.querySelector('#zip').value;
  const text = document.querySelector('#feelings').value;
  const countryCode = ',' + document.querySelector('#country').value;
  const apiUrl = baseUrl + zipCode + countryCode + apiKey;

  let today = dateString();

  retrieveData(apiUrl)
  .then( async function (data) {
    const entry = {
      location: data.name + ", " + data.sys.country,
      temperature: Math.round(data.main.temp - 273.15),
      date: today,
      content: text,
      iconCode: data.weather[0].icon
    }
    await postData('http://localhost:8000/add', entry);
    updateUi();

  });
  
}


// Get the date in a string formatted dd/mm/yyyy
function dateString() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  let dateString = dd + '.' + mm + '.' + yyyy;
  return dateString;
}

// Build a journal entry element from journal data
function buildJournalEntry(data) {
  // Build url to fetch icon from
  iconUrl = iconUrlStart + data.iconCode + iconUrlEnd;

  // Find content element
  const content = document.querySelector('content');
  
  // Create journal entry card
  const newEntry = document.createElement('div');
  newEntry.classList.add("weather-post");

  // Create post header div
  const postHeader = document.createElement('div');
  postHeader.classList.add("post-header");

  // Create container for location and date
  const locationDateContainer = document.createElement('div');

  // Create location <p> and append to above container
  const location = document.createElement('p');
  location.classList.add("weather-location");
  location.innerText = data.location;
  locationDateContainer.appendChild(location);

  // Create date <p> and append to above container
  const date = document.createElement('p');
  date.classList.add("weather-date");
  date.innerText = data.date;
  locationDateContainer.appendChild(date);

  // Append location and date container to post header
  postHeader.appendChild(locationDateContainer);

  // Create and append icon to post header
  const icon = document.createElement('img');
  icon.setAttribute("src", iconUrl);
  icon.setAttribute("alt", "Weather icon");
  postHeader.appendChild(icon);

  // Create and append temperature to post header
  const temperature = document.createElement('p');
  temperature.classList.add("weather-temperature");
  temperature.innerText = `${data.temperature}\xB0c`;
  postHeader.appendChild(temperature);

  // Append post header to post
  newEntry.appendChild(postHeader);

  // Create and append journal text to post
  const text = document.createElement('p');
  text.classList.add("weather-text");
  text.innerText = data.content;
  newEntry.appendChild(text);

  // Append journal entry to content
  content.prepend(newEntry);
}

initialiseUI();
