import { userService } from "../services/user-service.js";
import { storageService } from "../services/storage-service.js";

document.querySelector('.loginForm').addEventListener('submit', login)
document.querySelector('.signupForm').addEventListener('submit', signup)

const wrapper = document.querySelector(".wrapper"),
    signupHeader = document.querySelector(".signup header"),
    loginHeader = document.querySelector(".login header");

loginHeader.addEventListener("click", () => {
    wrapper.classList.add("active");
});
signupHeader.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

function login(event) {
    console.log('event', event);
    event.preventDefault();
    const { target } = event
    const [email, pass] = target
    console.log('email, pass', email.value, pass.value);
    userService.getUserByEmail(email.value).then(user => {
        if (user && user.password === pass.value) {
            // In this case,
            // you should be able to simply remove the leading slash to make the path relative to the root of your site:
            //when upload to github pages
            //etc : window.location.href = "site/index.html"
            storageService.saveToStorage('user', user)
            window.location.href = "site/index.html"
        } else {
            console.log('user not found');
        }
    })
}

async function signup(event) {
    console.log('event', event);
    event.preventDefault();
    const { target } = event
    const [name, email, pass] = target
    // Remove existing error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    let isNameValid = true
    let isPassValid = true
    let isEmailValid = true
    if (!isValidName(name.value)) {
        // console.error('Invalid name. Name should be 5 to 10 English characters.');
        // return;
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Name should be 5 to 10 English characters.';
        name.parentElement.insertBefore(errorMessage, name);
        isNameValid = false
    }

    let testUser
    try {
        testUser = await userService.getUserByEmail(email.value)
    } catch (err) {
        console.log('err', err);
    }
    if (testUser) {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Email already in use.';
        email.parentElement.insertBefore(errorMessage, email);
        // return //console.error('email already in use')
        isEmailValid = false
    }

    if (!isValidPassword(pass.value)) {
        // console.error('Invalid password. Password should be 4 to 8 characters with only English letters and numbers.');
        // return;
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Password should be 4 to 8 English letters/nums';
        pass.parentElement.insertBefore(errorMessage, pass);
        isPassValid = false
    }
    if (!isEmailValid || !isNameValid || !isPassValid) {
        return
    }

    console.log('name, email, pass', name.value, email.value, pass.value);
    const user = {
        name: name.value,
        email: email.value,
        password: pass.value
    }
    userService.save(user).then(savedUser => {
        if (savedUser) {
            wrapper.classList.add("active");
        } else {
            console.log('couldent save user');
        }
    })
}


function isValidName(name) {
    const regex = /^[A-Za-z]{5,10}$/;
    return regex.test(name);
}


function isValidPassword(password) {
    const regex = /^[A-Za-z0-9]{4,8}$/;
    return regex.test(password);
}