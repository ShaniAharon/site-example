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
    let testUser
    try {
        testUser = await userService.getUserByEmail(email.value)
    } catch (err) {
        console.log('err', err);
    }
    if (testUser) {
        return console.log('email already in use')
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