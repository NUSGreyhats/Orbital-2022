const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db.sqlite')

const defaultNotes = [
    {
        title: "Hello World!",
        body: "Hello!, this is the first post on the device",
        author: "admin",
    },
]

db.serialize(() => {

    db.run("DROP TABLE IF EXISTS posts")
    db.run("DROP TABLE IF EXISTS users")

    // Creating the tables for posts
    db.run("CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR, body VARCHAR, author VARCHAR)")

    for (let i = 0; i < defaultNotes.length; ++i) {
        const curr = defaultNotes[i];

        // SQLi here in the post
        db.run(`INSERT INTO posts(title, body, author) VALUES ('${curr.title}', '${curr.body}', '${curr.author}')`)
    }

    // Creating tables for login (Insecure password storage)
    db.run("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR UNIQUE NOT NULL, password VARCHAR NOT NULL)")
    db.run(`INSERT INTO users(username, password) VALUES('admin', 'password')`)
})

async function signup(username, password) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO users(username, password) VALUES('${username}', '${password}')`, (err) => {
            if (err) reject(err)
            resolve()
        })
    }).then(() => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

async function login(username, password) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE username = '${username}' and password = '${password}' LIMIT 1`, (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    }).then(
        (row) => {
            return row !== undefined;
        }
    ).catch((err) => {
        console.log(err)
        return false;
    })
}



module.exports = {
    signup,
    login
}