const details = {};

// All the resources of APIs
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
const username = 'walaessam27';
const weatherbitforecastURL = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=';
const weatherbithistoryURL = 'https://api.weatherbit.io/v2.0/history/daily?lat=';
const weatherbitkey = 'd416ef96c4b744438a2b052a5b5eeb33';
const pixabayURL = 'https://pixabay.com/api/?key=';
const pixabayAPI = '49273820-3e7ed41ba0a7636aafc1f540d';

const trip_details_section = document.getElementById('trip_details_section');
const plan_trip = document.getElementById('plan_trip');

async function handleSubmit(e) {
    e.preventDefault(); // Prevent default behaviour to stop page reload

    // Getting elements value from DOM
    details['from'] = document.getElementById('from_place').value;
    details['to'] = document.getElementById('to_place').value;
    details['date'] = document.getElementById('travel_date').value;
    details['daystogo'] = date_diff_indays(details['date']);

    try {
        // Fetching geo stats of destination place.
        const toInfo = await getGeoDetails(details['to']);

        if (!toInfo || !toInfo.geonames || toInfo.geonames.length === 0) {
            throw new Error("Invalid response from GeoNames API: No location data found.");
        }

        const toLat = toInfo.geonames[0].lat;
        const toLng = toInfo.geonames[0].lng;

        // Getting Weather details
        const weatherData = await getWeatherData(toLat, toLng, details['date']);

        if (weatherData && weatherData.data && weatherData.data[0] && weatherData.data[0].weather) {
            details['temperature'] = weatherData.data[0].temp;
            details['weather_condition'] = weatherData.data[0].weather.description;
        } else {
            console.error("Weather API returned invalid data.");
            details['temperature'] = "N/A";
            details['weather_condition'] = "Data not available";
        }

        // Calling Pixabay API to fetch the first img of the city
        const imageDetails = await getImage(details['to']);

        if (imageDetails && imageDetails.hits.length > 0) {
            details['cityImage'] = imageDetails.hits[0].webformatURL;
        }

        // Sending data to server to store the details.
        const responseData = await postData(details);

        // Updating the UI
        updateUI(responseData);
    } catch (e) {
        console.error('Error:', e);
    }
}

// Function to get Geo stats
async function getGeoDetails(to) {
    try {
        const response = await fetch(`${geoNamesURL}${to}&maxRows=10&username=${username}`);

        if (!response.ok) {
            throw new Error(`GeoNames API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("GeoNames Response:", data); // Debugging the response

        if (!data || !data.geonames || data.geonames.length === 0) {
            throw new Error("Invalid response from GeoNames API: No location data found.");
        }

        return data;
    } catch (e) {
        console.error('Error fetching GeoNames data:', e);
        return null;
    }
}

// Function to get weather data
async function getWeatherData(toLat, toLng, date) {
    try {
        const timestamp_trip_date = Math.floor(new Date(date).getTime() / 1000);
        const todayDate = new Date();
        const timestamp_today = Math.floor(new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()).getTime() / 1000);

        let response;
        if (timestamp_trip_date < timestamp_today) {
            let next_date = new Date(date);
            next_date.setDate(next_date.getDate() + 1);
            response = await fetch(`${weatherbithistoryURL}${toLat}&lon=${toLng}&start_date=${date}&end_date=${next_date.toISOString().split('T')[0]}&key=${weatherbitkey}`);
        } else {
            response = await fetch(`${weatherbitforecastURL}${toLat}&lon=${toLng}&key=${weatherbitkey}`);
        }

        console.log("WeatherBit Response Status:", response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`WeatherBit API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("WeatherBit Data:", data); // Debugging

        if (!data || !data.data || data.data.length === 0) {
            throw new Error("Weather API did not return valid data.");
        }

        return data;
    } catch (e) {
        console.error('Error fetching weather data:', e);
        return null;
    }
}

// Function to get city image
async function getImage(toCity) {
    try {
        const response = await fetch(`${pixabayURL}${pixabayAPI}&q=${toCity} city&image_type=photo`);
        if (!response.ok) {
            throw new Error(`Pixabay API error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Error fetching Pixabay image:', e);
        return null;
    }
}

// Function to send trip details to backend
async function postData(details) {
    try {
        const response = await fetch('http://localhost:8888/postData', {
            method: "POST",
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(details)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Error posting data to server:', e);
        return null;
    }
}

// Updating the UI
function updateUI(data) {
    if (!data) {
        console.error("No data available to update UI.");
        return;
    }

    trip_details_section.classList.remove('invisible');
    trip_details_section.scrollIntoView({ behavior: "smooth" });

    document.getElementById("destination").innerHTML = data.to;
    document.getElementById("boarding").innerText = data.from;
    document.getElementById("departing_date").innerHTML = data.date;

    if (data.daystogo < 0) {
        document.querySelector('#days_to_go_details').innerHTML = 'Seems like you have already been to the trip!';
    } else {
        document.getElementById('number_of_days').innerHTML = data.daystogo;
    }

    document.getElementById('temperature').innerHTML = `${data.temperature}&#8451;`;

    if (data.cityImage) {
        document.getElementById('dest_desc_photo').setAttribute('src', data.cityImage);
    }

    document.getElementById('weather').innerHTML = data.weather_condition;
}

// Function to calculate days difference
function date_diff_indays(date1) {
    let dt1 = new Date(date1);
    let dt2 = new Date();
    return Math.floor((Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) - Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate())) / (1000 * 60 * 60 * 24));
}

export {
    plan_trip,
    handleSubmit,
    trip_details_section
};
