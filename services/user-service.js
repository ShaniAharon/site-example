import { utilService } from './util-service.js'
import { storageService } from './async-storage.service.js'


export const userService = {
    query,
    getById,
    updateUser,
    getDefaultFilter,
    save,
    getEmptyUser,
    getUserByEmail
}

const KEY = 'usersDB'

function query(filterBy) {
    return storageService.query(KEY).then(users => {
        if (!users || !users.length) {
            users = gUsers
            _saveUsersToStorage()
        }
        console.log('filterBy', filterBy);
        if (filterBy) {
            let { title, price } = filterBy
            users = users.filter(user => {
                return user.title.includes(title)
                    && (user.listPrice.amount < price || !price)
            })
            console.log(users);
        }
        return users
    })
}

function getById(userId) {
    return storageService.get(KEY, userId)
}

function getUserByEmail(userEmail) {
    return storageService.getByEmail(KEY, userEmail)
}

function updateUser(user) {
    let users = storageService.loadFromStorage(KEY)
    users = users.map(b => (b.id === user.id) ? user : b)
    storageService.saveToStorage(KEY, users)
    return Promise.resolve(user)
}

function save(user) {
    if (user.id) {
        return storageService.put(KEY, user)
    } else {
        return storageService.post(KEY, user)
    }
}

function getDefaultFilter() {
    return { title: '', price: 0 }
}

function getEmptyUser() {
    return {
        name: '',
        email: '',
        password: ''
    }
}

function _createUser() {
    return {
        id: utilService.makeId(),
        title: "metus hendrerit",
        subtitle: utilService.makeLorem(15),
        authors: ["Oren Yaniv"],
        publishedDate: utilService.getRandomInt(1700, 2022),
        description: utilService.makeLorem(50),
        pageCount: utilService.getRandomInt(1, 700),
        categories: [
            "Computers",
            "Hack"
        ],
        thumbnail: "http://coding-academy.org/users-photos/20.jpg",
        language: "en",
        listPrice: {
            amount: utilService.getRandomInt(10, 30),
            currencyCode: "EUR",
            isOnSale: false
        }
    }
}

function _saveUsersToStorage() {
    saveToStorage(KEY, gUsers)
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

var gUsers = [
    { name: 'Admin', email: 'admin@gmail.com', password: 'admin' }
]