const form = document.getElementById('form');
const username = document.getElementById('username'); 
const age = document.getElementById('age'); 
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

// Show input error 
function showError(input, message){
    const formControl = input.parentElement; 
    formControl.className = 'form-control error'; 
    const small = formControl.querySelector('small'); 
    small.innerText = message; 

    if (input.id === 'password') {
        small.style.display = 'block';      
        small.style.marginTop = '10px';     
        small.style.position = 'relative';  
    }
}

// Show input success outline
function showSuccess(input){
    const formControl = input.parentElement; 
    formControl.className = 'form-control success';

    const small = formControl.querySelector('small');
    if (small) {
        small.style.marginTop = '0px';
    }
}

// Check email is valid
function checkEmail(input){
    
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    if(re.test(input.value.trim())){
        showSuccess(input);
    } else {
        showError(input, 'Email is not valid');
    }
}

// Check required fields
function checkRequired(inputArr){
    inputArr.forEach(function(input) {
        if (input.value.trim() === '') {
            showError(input, `${getFieldName(input)} is required`);
        } else {
            showSuccess(input);
        }
    });
}

//Check characters passwords
function checkCharacterPassword(input) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}|\[\]\\Formating:";'<>,.?/~`])/;

    // Fem el test sobre el contingut real de la contrasenya
    if (re.test(input.value.trim())) {
        showSuccess(input);
    } else {
        showError(input, 'Password must contain lower case, upper case and special characters.');
    }
}

// Check passwords match 
function checkPasswordsMatch(input1, input2){
    if(input1.value !== input2.value){
        showError(input2, 'Passwords do not match')
    } 
}

//Check length 
function checkLength(input, min, max){
    if(input.value.length < min){
        showError(input, `${getFieldName(input)} must be at least ${min} characters`)
    } else if (input.value.length > max){
        showError(input, `${getFieldName(input)} must be less than ${max} characters`)
        }
}

//Check Age
function checkAge(input, min, max) {
    const value = parseInt(input.value, 10);
    if (value < min || value > max || isNaN(value)) {
        showError(input, `${getFieldName(input)} must be between ${min} and ${max} years old.`);
    }
}

// Get fieldname
function getFieldName(input){
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}


// Event listener
form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    // Comprovem tots els camps obligatoris
    checkRequired([username, age, email, password, password2]);
    
    // Validem el correu només si s'hi ha escrit alguna cosa
    if (email.value.trim() !== '') {
        checkEmail(email); 
    }

    // Validem la contrasenya només si s'hi ha escrit alguna cosa
    if (password.value.trim() !== '') {
        checkCharacterPassword(password);
        checkLength(password, 8, 20);
    }

    // Validem si les contrasenyes coincideixen 
    if (password2.value.trim() !== '') {
        checkPasswordsMatch(password, password2);
    }

    // Validem les mides i l'edat de la resta de camps si tenen text
    if (username.value.trim() !== '') {
        checkLength(username, 4, 15);
    }
    
    if (age.value.trim() !== '') {
        checkAge(age, 0, 1000); 
    }
});
