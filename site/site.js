import { storageService } from "../services/storage-service.js";

document.querySelector('.logout').addEventListener('click', () => {
    window.location.href = "../index.html"
})

window.onload = () => {
    createWelcomeMessage();
};

function createWelcomeMessage() {
    const user = storageService.loadFromStorage('user')
    console.log('user', user);
    if (user) {
        document.querySelector('.username').innerText = `Welcome ${user.name}`
    }

}