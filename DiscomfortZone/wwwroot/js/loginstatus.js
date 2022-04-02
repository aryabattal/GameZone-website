const onlineStatus = document.querySelector('#online-status')
const loginSwitcher = document.querySelector('#login-switcher')

if (loginSwitcher !== null) {
    if (localStorage.getItem('loggedin') !== null) {
        onlineStatus.innerText = localStorage.getItem('loggedin') + ' is playing 🎮'
        loginSwitcher.innerText = 'Log off'
    }


    loginSwitcher.addEventListener('click', e => {
        if (localStorage.getItem('loggedin') !== null) {
            window.localStorage.removeItem('loggedin')
        }
    })
}