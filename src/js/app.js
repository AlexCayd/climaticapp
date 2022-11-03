const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima (e) {
    e.preventDefault();

    // Validar 
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {
        // Hubo un error
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    // Consultar la API
    consultarAPI(ciudad, pais);

}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.alerta');

    if(!alerta) {
        // Crear alerta

        const alerta = document.createElement('DIV');
        alerta.classList.add('alerta');
        alerta.innerHTML = `
        <p class="alerta__mensaje">Error! <span>${mensaje}</span> <p>
        `;
        container.appendChild(alerta);
        // Elimina la alerta despues de 5s
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }   
}

function consultarAPI(ciudad, pais) {
    const appId = '330a419e831344a4095cd02fb4f5de43';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
    Spinner();
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos =>  {
            limpiarHTML(); // Limpiar el HTML previo

            if (datos.cod === "404") {
                mostrarError('Ciudad no encontrada');
                return;
            }

            // Imprime en HTML
            mostrarClima(datos);
        })
}

function mostrarClima(datos) {
    const {name, main: { temp, temp_max, temp_min } } = datos;
    
    const centigrados = KelvinACentigrados(temp);
    const max = KelvinACentigrados(temp_max);
    const min = KelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('clima-ciudad');
    
    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} °C`;
    actual.classList.add('clima');
    if (centigrados >= 23) {
        actual.classList.add('clima-calido');
    } else if (centigrados >= 18) {
        actual.classList.add('clima-templado');
    } else {
        actual.classList.add('clima-frio');
    }

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} °C`;
    tempMaxima.classList.add('clima-max');

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Min: ${min} °C`;
    tempMin.classList.add('clima-min');
    
    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('divclima');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);

    const divMinMax = document.createElement('div');
    divMinMax.classList.add('divMinMax');
    divMinMax.appendChild(tempMaxima);
    divMinMax.appendChild(tempMin);

    resultado.appendChild(resultadoDiv);
    resultadoDiv.appendChild(divMinMax);

}

function KelvinACentigrados(grados) {
    return parseInt(grados - 273.15);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() {
    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
        <div class="cube1"></div>
        <div class="cube2"></div>
    `;
    resultado.appendChild(divSpinner);
}