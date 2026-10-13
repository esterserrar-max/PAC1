//Declaració de les variables 
const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');

//Declaració de les variables de la divisa
const baseCurrency = 'USD'; 
const currencyRateSelect = document.getElementById('currency-rate');
const currencySymbolEl = document.getElementById('currency-symbol');

let currentRate = 1; 
let ticketPrice = +movieSelect.value; 

//Desament de les dades de la pel·licula al localstorage
function setMovieData(movieIndex, moviePrice){
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

//Update i contabilitzacio del nombre de seients 
function updateSelectedCount(){
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    // Guardem la posició dels seients blaus
    const seatsIndex = [...selectedSeats].map(function(seat){
        return [...seats].indexOf(seat);
    });
    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

    const selectedSeatsCount = selectedSeats.length;
    count.innerText = selectedSeatsCount;
    total.innerText = (selectedSeatsCount * ticketPrice).toFixed(2); //Utilització toFixed(2) per arrodonir els decimals
}

//Fetch per obtenir la divisa de l'API
function updateCurrency() {
    const targetCurrency = currencyRateSelect.value; 

    fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`)
        .then(res => res.json())
        .then(data => {
    
            currentRate = data.rates[targetCurrency];

            currencySymbolEl.innerText = targetCurrency;

            localStorage.setItem('selectedMovieCurrency', targetCurrency); //Guardem al localstorage el valor de la divisa de la pel·licula seleccionada

            ticketPrice = +movieSelect.value * currentRate;

            //Update del preu de cada pel·licula segons la divisa   
            const movieOptions = movieSelect.querySelectorAll('option');
            
            movieOptions.forEach(option => {
                const preuBaseUSD = +option.value; 
                const preuConvertit = (preuBaseUSD * currentRate).toFixed(2); 
                
                let nomPelicula = option.text.split('(')[0].trim();
                
                option.text = `${nomPelicula} (${preuConvertit} ${targetCurrency})`;
            });

            updateSelectedCount();  
        })
        .catch(err => console.error('Error canviant divisa:', err));
}

//Funcio populateUI
function populateUI(){
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

    if(selectedSeats !== null && selectedSeats.length > 0) {
        seats.forEach ((seat, index) => {
            if(selectedSeats.indexOf(index) > -1){
                seat.classList.add('selected');
            }
        });
    }

    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');
    if(selectedMovieIndex !== null) {
        movieSelect.selectedIndex = selectedMovieIndex;
    }
}

//EventListener de la pel·licula escollida amb la divisa en el option
movieSelect.addEventListener('change', (e) => {
    const taxaActual = currentRate || 1;
    ticketPrice = +e.target.value * taxaActual;
    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
});

//EventListener del click per update el numero de seients escollits
container.addEventListener('click', (e) => {
    if(e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateSelectedCount();
    }
});

//Crida de funcions
currencyRateSelect.addEventListener('change', updateCurrency);

populateUI();

//Serveix per evitar que al escollir una altre pel·licula el valor total es quedi NAN
const monedaGuardada = localStorage.getItem('selectedMovieCurrency');
if (monedaGuardada !== null) {
    currencyRateSelect.value = monedaGuardada;
    updateCurrency(); 
} else {
    updateCurrency();
}
