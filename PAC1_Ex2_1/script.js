const form = document.getElementById('form');
const username = document.getElementById('username'); 
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

// Show success outline
function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success'; 
}

// Show input error 
function showError(input, message){
    const formControl = input.parentElement; 
    formControl.className = 'form-control error'; 
    const small = formControl.querySelector('small'); 
    small.innerText = message; 
}

//Show input success outline
function showSuccess(input){
     const formControl = input.parentElement; 
    formControl.className = 'form-control success';
}

//Check email is valid
function isValidEmail(email){
    //Fem servir regex que es un validaador de email general. 
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}

// Event listener
form.addEventListener('submit', function(e){
    e.preventDefault(); //Serveix perque no fagi flash quan s'apreta submit.

    if(username.value === ''){
        showError(username, 'Username is required');
    } else {
        showSuccess(username);
    }

    if(email.value === ''){
        showError(email, 'Email is required');
    } else if(!isValidEmail(email.value)) {
        showError(email, 'Email is not valid')

    }
    else {
        showSuccess(email);
    }

    if(password.value === ''){
        showError(password, 'Password is required');
    } else {
        showSuccess(password);
    }

    if(password2.value === ''){
        showError(password2, 'Password 2 is required');
    } else {
        showSuccess(password2);
    }
    
});

