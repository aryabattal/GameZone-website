const loginButton = document.querySelector('#login-button')
const form = document.querySelector('.form')

const usernameField = document.querySelector('#username')
const passwordField = document.querySelector('#password')
const commentField = document.querySelector('#comment')


loginButton.addEventListener('click', e => {
    if (localStorage.getItem(usernameField.value) === passwordField.value) {
        console.log(localStorage.getItem(usernameField.value))
        commentField.innerText = 'Welcome, ' + usernameField.value
        window.localStorage.setItem('loggedin', usernameField.value)
    } else {
        commentField.innerText = 'Username or password are invalid!'
    }
});
