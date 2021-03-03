const port = 5555;
const UsersRepository = require('./user.repository')
const express = require('express')
const bodyParser = require('body-parser');
const server = express();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config();

const tokenSecret = process.env.TOKEN_SECRET;
var cors = require('cors')

server.use(cors())
server.use(bodyParser.json({extended: false }));

server.post('/user', async (req, res) => {
    try {
        let repo = new UsersRepository();
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = {
            name: req.body.name,
            password: hashedPassword
        }
        repo.createUser(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

// TODO: nur für Testzwecke
server.post('/user/login', async (req, res) => {
    let repo = new UsersRepository();
    const user = repo.getUser(req.body.name);
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success');
        } else {
            res.send('Not Allowed');
        }

    } catch {
        res.status(500).send();
    }
});

// TODO: nur für Testzwecke
server.get('/users', (req, res) => {
    let repo = new UsersRepository();
    repo.getUsers()
        .then(obj => res.status(200).send(obj))
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
})

server.post('/login', async (req, res) => {
    let repo = new UsersRepository();
    const user = await repo.getUser(req.body.name.trim());
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const username = req.body.name;
            const user = { name: username }
            const accessToken = generateAccessToken(user);
            const decodedAccessToken = jwt.decode(accessToken);
            console.log(decodedAccessToken);
            res.json( {accessToken: accessToken, expiresAt: decodedAccessToken.exp } );
        } else {
            res.send('Not Allowed');
        }

    } catch {
        res.status(500).send();
    }
});

function generateAccessToken(user) {
    return jwt.sign(user, tokenSecret, { expiresIn: '30m' });
}

server.listen(port, () => {
    console.log('Authentication-Server is running...');
});
