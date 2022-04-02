const registrationButton = document.querySelector('#registration-button')
const form = document.querySelector('.form')

const usernameField = document.querySelector('#username')
const passwordField = document.querySelector('#password')
const commentField = document.querySelector('#comment')


registrationButton.addEventListener('click', e => {
    if (usernameField.value.length > 0 && passwordField.value.length > 0) {
        form.classList.add('form--no')
        window.localStorage.setItem(usernameField.value, passwordField.value)
        commentField.innerText = 'You have been registered!'
    } else {
        commentField.innerText = 'Do not leave any field blank!'
    }
});
