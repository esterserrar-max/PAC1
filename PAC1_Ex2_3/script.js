const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');


const baseCurrency = 'USD'; 
const currencyRateSelect = document.getElementById('currency-rate');
const currencySymbolEl = document.getElementById('currency-symbol');

let currentRate = 1; 
let ticketPrice = +movieSelect.value; 

function setMovieData(movieIndex, moviePrice){
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

function updateSelectedCount(){
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    // Guardem la posició dels seients blaus
    const seatsIndex = [...selectedSeats].map(function(seat){
        return [...seats].indexOf(seat);
    });
    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

    const selectedSeatsCount = selectedSeats.length;
    count.innerText = selectedSeatsCount;
    total.innerText = (selectedSeatsCount * ticketPrice).toFixed(2); 
}


function updateCurrency() {
    const targetCurrency = currencyRateSelect.value; 

    fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`)
        .then(res => res.json())
        .then(data => {
    
            currentRate = data.rates[targetCurrency];

            currencySymbolEl.innerText = targetCurrency;

            localStorage.setItem('selectedMovieCurrency', targetCurrency);

            ticketPrice = +movieSelect.value * currentRate;

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


movieSelect.addEventListener('change', (e) => {
    const taxaActual = currentRate || 1;
    ticketPrice = +e.target.value * taxaActual;
    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
});

container.addEventListener('click', (e) => {
    if(e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateSelectedCount();
    }
});

currencyRateSelect.addEventListener('change', updateCurrency);

populateUI();

const monedaGuardada = localStorage.getItem('selectedMovieCurrency');
if (monedaGuardada !== null) {
    currencyRateSelect.value = monedaGuardada;
    updateCurrency(); 
} else {
    updateCurrency();
}
