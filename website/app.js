window.onload = function() {
  updateUI(true);
}

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip='
const apiKey = '&appid=435c250cfdd45953cf40e7b8134adbb6';

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
    return newData;
  } catch(error) {
    console.log(error);
  }
}

// Update UI to reflect data in server

async function updateUI (firstLoad){
  const request = await fetch('http://localhost:8000/all');
  try {
    console.log('Got data from server')
    const allData = await request.json();
    if(firstLoad) {
      console.log('First load so appending all entries')
      allData.forEach(data => {
        const content = document.querySelector('content');
  
        const newEntry = document.createElement('div');
        newEntry.classList.add("weather-post");
  
        const location = document.createElement('p');
        location.classList.add("alignleft");
        location.classList.add("weather-location");
        location.innerText = data.location;
        newEntry.appendChild(location);
  
        const temperature = document.createElement('p');
        temperature.classList.add("alignright");
        temperature.classList.add("weather-temperature");
        temperature.innerText = `${data.temperature}\xB0c`;
        newEntry.appendChild(temperature);
  
        const date = document.createElement('p');
        date.classList.add("weather-date");
        date.innerText = data.date;
        newEntry.appendChild(date);
  
        const text = document.createElement('p');
        text.classList.add("weather-text");
        text.innerText = data.content;
        newEntry.appendChild(text);
  
        content.prepend(newEntry);

      });
      console.log('Appended all entries')
    } else {
      console.log('Not first load so appending last entry')
      const lastEntry = allData.pop();
      console.log('last entry : ' + lastEntry);
      const content = document.querySelector('content');

      const newEntry = document.createElement('div');
      newEntry.classList.add("weather-post");

      const location = document.createElement('p');
      location.classList.add("alignleft");
      location.classList.add("weather-location");
      location.innerText = lastEntry.location;
      newEntry.appendChild(location);

      const temperature = document.createElement('p');
      temperature.classList.add("alignright");
      temperature.classList.add("weather-temperature");
      temperature.innerText = `${lastEntry.temperature}\xB0c`;
      newEntry.appendChild(temperature);

      const date = document.createElement('p');
      date.classList.add("weather-date");
      date.innerText = lastEntry.date;
      newEntry.appendChild(date);

      const text = document.createElement('p');
      text.classList.add("weather-text");
      text.innerText = lastEntry.content;
      newEntry.appendChild(text);

      content.prepend(newEntry);
      console.log('Appended last entry')
    }
  } catch (error) {
    console.log(error);
  }
}

const submitButton = document.getElementById('generate');
submitButton.addEventListener('click', submitHandler);

function submitHandler() {
  console.log('Clicked submit')
  const zipCode = event.target.previousElementSibling.previousElementSibling.value;
  const text = event.target.previousElementSibling.value;

  const url = baseUrl + zipCode + apiKey;
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = dd + '/' + mm + '/' + yyyy;

  retrieveData(url)
  .then( data => {
    console.log('Got data from open weather')
    const entry = {
      location: data.sys.country,
      temperature: Math.round(data.main.temp - 273.15),
      date: today,
      content: text
    }
    console.log('Posting to server')
    postData('http://localhost:8000/add', entry);
    console.log('Posted to server')
  })
  .then(()=> {
    console.log('Posted data to server')
    updateUI(false);
  });
}

