const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-1'); 
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-2'); 

const rateEl = document.getElementById('rate');
const swap = document.getElementById('swap');

//Check if value is positive
function checkPositiveValue() {
    const value = parseFloat(amountEl_one.value); 
    const formControl = amountEl_one.parentElement; 
    const small = formControl.querySelector('small');

    if (value < 0 || isNaN(value)) {
        
        formControl.className = 'currency error';
        small.innerText = 'Quantity must be positive';
        
        amountEl_two.value = '';
        rateEl.innerText = '';
    } else {
        
        formControl.className = 'currency';
        small.innerText = '';
        calculate();
    }
}


// Fetch exchanging rates and updates
function calculate (){
    const currency_one = currencyEl_one.value;
    const currency_two = currencyEl_two.value;

    rateEl.innerHTML = `
        <img src="src/12-dots-scale-rotate.svg" alt="Cargando" width="24px" style="vertical-align: middle; margin-right: 10px;">
        <span>Carregant canvi...</span>
    `;

    fetch(`https://open.er-api.com/v6/latest/${currency_one}`)
    .then(res => res.json())
    .then(data => {
        const rate = data.rates[currency_two];
        rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;
        amountEl_two.value = (amountEl_one.value * rate).toFixed(2);
    })
    .catch(error =>{
        rateEl.innerHTML = 'Server Error';
    });
}

//Event Listeners
currencyEl_one.addEventListener('change', checkPositiveValue);
amountEl_one.addEventListener('input', checkPositiveValue); 
currencyEl_two.addEventListener('change', checkPositiveValue);

// Swap button Event Listener
swap.addEventListener('click', () => {
    const temp = currencyEl_one.value;
    currencyEl_one.value = currencyEl_two.value;
    currencyEl_two.value = temp;
    
    checkPositiveValue();
});


checkPositiveValue();
