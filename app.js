const inputCountry = document.getElementById('country-input');
const resultsContainer = document.querySelector('.results');
const flagImage = document.getElementById('banderas');
const weatherInfo = document.getElementById('weather');
const errorContainer = document.getElementById('error-container');

let countryData;

window.addEventListener('load', () =>{
    //cuando la pagina termina de cargar se descarga la informacion completa
    llamarApi();

    inputCountry.addEventListener('input', filtrarPaises)
})



function llamarApi() { 
    const url = `https://restcountries.com/v3.1/all`;

    spinner()
    fetch(url)
        .then( response => response.json())
        .then(data => {
            if (data.cod === '404') {
                mostrarAlerta('Conexión fallida. Intente nuevamente');
                return;
            }
            //almacenamos la informacion un varaible global con un spread Operator
            countryData = [...data]; 
    
        })

}

function filtrarPaises() {
    //esta funcion toma la info sumistrada y busca coincidencias en el array
    const paisBuscado = inputCountry.value.toLowerCase(); //
    const match = countryData.filter(pais => pais.name.common.toLowerCase().includes(paisBuscado));

    limpiarHTML();

    //revisamos la cantiadas de coicidencias obtenidas
    if (match.length === 0) { 
        mostrarAlerta('No se encontró ninguna coincidencia');
    } else if (match.length > 10) {
        mostrarAlerta('Se más específico');
    } else if (match.length <= 10 && match.length > 1) { 
        mostrar10(match);
    } else {
        encontrado(match);
    }
}

function mostrarAlerta(message) {

    const alertaExistente = document.querySelector('.error-message');
    if (!alertaExistente) {
        const error = document.createElement('div');
        error.classList.add('error-message');
        error.textContent = message;
    
        errorContainer.appendChild(error);
    
        setTimeout(() => {
            error.remove();
        }, 2000);
    }
}

function mostrar10(array) {
    array.forEach( country => {
        const divBandera = document.createElement('div');
        divBandera.classList.add('card-flag')
        divBandera.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name.common}" class="flag">
            <h2>${country.name.common}</h2>
        `;
        flagImage.appendChild(divBandera);
    });
}

function encontrado(array) {
    const pais = array[0];
    console.log(pais);
    const divBandera = document.createElement('div');
        divBandera.classList.add('flag-match')
        
        // Mostrar información del país
        divBandera.innerHTML = `
            <img src="${pais.flags.png}" alt="${pais.name.common}" class="flag">
            <h2>${pais.name.common}</h2>
            <p>Capital: ${pais.capital}</p>
            <p>Población: ${pais.population.toLocaleString()}</p>
            <p>Área: ${pais.area} km²</p>
            <p>Región: ${pais.region}</p>
        `;
        flagImage.appendChild(divBandera);

        llamarApiClima(pais.capital);
}

function limpiarHTML() {
    while (flagImage.firstChild) {
        flagImage.removeChild(flagImage.firstChild);
    }
    while (weatherInfo.firstChild) {
        weatherInfo.removeChild(weatherInfo.firstChild);
    }
}

function llamarApiClima(capital) {
    const appId = '0dcc10466fcd8774db77d400fefa10f2';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${appId}`;

    fetch(url)
        .then(response => response.json())
        .then( weatherData => {
            const {main: {temp}} = weatherData;
            console.log(weatherData)
            const temperatura = kelvinToCelsius(temp);
            const divClima = document.createElement('div');
            divClima.classList.add('clima-pais')

            divClima.innerHTML = `
                <h2>Clima:</h2>
                <p>Temperatura: ${temperatura}°C</p>
                <p>Clima: ${weatherData.weather[0].description}</p>
                <p>Humedad: ${weatherData.main.humidity}%</p>
            `;
            weatherInfo.appendChild(divClima);
        })
}

function kelvinToCelsius(grados) {
    return parseInt(grados - 273.15);
}

function spinner() {
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
    
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>

    `;
    flagImage.appendChild(divSpinner);

    setTimeout(() => {
        divSpinner.remove()
    }, 3000);
}